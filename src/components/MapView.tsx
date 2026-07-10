// src/components/MapView.tsx
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { fetchSafeStops, fetchSegments } from '../lib/api';
import type { SafeStop, Segment } from '../types';
import './MapView.css';

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  onSafeStopClick?: (stop: SafeStop) => void;
}

export default function MapView({ center = [77.209, 28.6139], zoom = 15, onSafeStopClick }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [safeStops, setSafeStops] = useState<SafeStop[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);

  // Load data once
  useEffect(() => {
    fetchSafeStops().then(setSafeStops).catch(console.error);
    fetchSegments().then(setSegments).catch(console.error);
  }, []);

  // Init map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center,
      zoom,
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Render SafeStop markers whenever data changes
  useEffect(() => {
    if (!mapRef.current) return;
    const markers: maplibregl.Marker[] = [];

    safeStops.forEach((stop) => {
      const el = document.createElement('div');
      el.className = 'safestop-marker';
      // Ring thickness scales with trust score (2px min, 6px max)
      const ringWidth = 2 + stop.trustScore * 4;
      el.style.setProperty('--ring-width', `${ringWidth}px`);
      el.addEventListener('click', () => onSafeStopClick?.(stop));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([stop.location.lng, stop.location.lat])
        .addTo(mapRef.current!);
      markers.push(marker);
    });

    return () => markers.forEach((m) => m.remove());
  }, [safeStops, onSafeStopClick]);

  // Render hazard segments whenever data changes
  useEffect(() => {
    if (!mapRef.current || segments.length === 0) return;
    const map = mapRef.current;

    const addLayer = () => {
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: segments.map((seg) => ({
          type: 'Feature',
          properties: { severity: seg.aggregatedSeverity },
          geometry: seg.geometry,
        })),
      };

      if (map.getSource('hazard-segments')) {
        (map.getSource('hazard-segments') as maplibregl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource('hazard-segments', { type: 'geojson', data: geojson });
        map.addLayer({
          id: 'hazard-segments-layer',
          type: 'line',
          source: 'hazard-segments',
          paint: {
            'line-color': '#E11D2E', // --signal-red
            // Line WEIGHT scales with severity — not color intensity (colorblind-safe)
            'line-width': ['+', 2, ['*', ['get', 'severity'], 6]],
          },
        });
      }
    };

    if (map.isStyleLoaded()) addLayer();
    else map.once('load', addLayer);
  }, [segments]);

  return <div ref={mapContainerRef} className="map-view" />;
}