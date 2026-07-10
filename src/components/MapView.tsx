// src/components/MapView.tsx
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { fetchSafeStops, fetchSegments } from '../lib/api';
import type { SafeStop, Segment } from '../types';
import type { Route } from '../types';
import './MapView.css';

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  onSafeStopClick?: (stop: SafeStop) => void;
  routes?: Route[];
}

export default function MapView({ center = [77.209, 28.6139], zoom = 15, onSafeStopClick, routes = [] }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [safeStops, setSafeStops] = useState<SafeStop[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);

  useEffect(() => {
    fetchSafeStops().then(setSafeStops).catch(console.error);
    fetchSegments().then(setSegments).catch(console.error);
  }, []);

  // Init map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center,
      zoom,
    });

    map.on('load', () => setMapReady(true));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // SafeStop markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const markers: maplibregl.Marker[] = [];

    safeStops.forEach((stop) => {
      const el = document.createElement('div');
      el.className = 'safestop-marker';
      const ringWidth = 2 + stop.trustScore * 4;
      el.style.setProperty('--ring-width', `${ringWidth}px`);
      el.addEventListener('click', () => onSafeStopClick?.(stop));

      const marker = new maplibregl.Marker({ element: el }).setLngLat([stop.location.lng, stop.location.lat]).addTo(map);
      markers.push(marker);
    });

    return () => markers.forEach((m) => m.remove());
  }, [safeStops, onSafeStopClick, mapReady]);

  // Hazard segments
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || segments.length === 0) return;

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: segments.map((seg) => ({
        type: 'Feature',
        properties: { severity: seg.aggregatedSeverity },
        geometry: seg.geometry,
      })),
    };

    try {
      const existingSource = map.getSource('hazard-segments') as maplibregl.GeoJSONSource | undefined;
      if (existingSource) {
        existingSource.setData(geojson);
      } else {
        map.addSource('hazard-segments', { type: 'geojson', data: geojson });
        map.addLayer({
          id: 'hazard-segments-layer',
          type: 'line',
          source: 'hazard-segments',
          paint: {
            'line-color': '#E11D2E',
            'line-width': ['+', 2, ['*', ['get', 'severity'], 6]],
          },
        });
      }
    } catch (err) {
      console.warn('Hazard layer update skipped:', err);
    }
  }, [segments, mapReady]);

  // Route lines
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    try {
      routes.forEach((route: Route) => {
        const sourceId = `route-${route.type}`;
        const layerId = `route-${route.type}-layer`;
        const geojson: GeoJSON.Feature = { type: 'Feature', properties: {}, geometry: route.geometry };

        const existingSource = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
        if (existingSource) {
          existingSource.setData(geojson);
        } else {
          map.addSource(sourceId, { type: 'geojson', data: geojson });
          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            paint: route.type === 'recommended'
              ? { 'line-color': '#F3EFE9', 'line-width': 5 }
              : { 'line-color': '#E11D2E', 'line-width': 3, 'line-dasharray': [2, 2] },
          });
        }
      });
    } catch (err) {
      console.warn('Route layer update skipped:', err);
    }

    return () => {
      const m = mapRef.current;
      if (!m || !m.getStyle()) return;
      try {
        ['recommended', 'shortest'].forEach((type) => {
          const layerId = `route-${type}-layer`;
          const sourceId = `route-${type}`;
          if (m.getLayer(layerId)) m.removeLayer(layerId);
          if (m.getSource(sourceId)) m.removeSource(sourceId);
        });
      } catch (err) {
        console.warn('Route layer cleanup skipped:', err);
      }
    };
  }, [routes, mapReady]);

  return <div ref={mapContainerRef} className="map-view" />;
}