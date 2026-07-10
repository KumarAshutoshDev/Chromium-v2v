// src/types.ts
export interface SafeStop {
  id: string;
  name: string;
  category: string;
  location: { lat: number; lng: number };
  trustScore: number;
}

export interface Segment {
  id: string;
  geometry: GeoJSON.LineString;
  aggregatedSeverity: number; // 0-1, drives line weight
}