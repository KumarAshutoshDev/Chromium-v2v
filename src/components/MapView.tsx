// src/components/MapView.tsx
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import './MapView.css';

interface MapViewProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
}

export default function MapView({ center = [77.209, 28.6139], zoom = 14 }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty', // keyless OpenFreeMap style
      center,
      zoom,
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainerRef} className="map-view" />;
}