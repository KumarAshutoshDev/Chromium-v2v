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
  aggregatedSeverity: number;
}

export interface Route {
  type: 'recommended' | 'shortest';
  geometry: GeoJSON.LineString;
  estimatedMinutes: number;
  hazardCount: number;
}

export interface PanicResult {
  name: string;
  walkTime: number;
  stop: SafeStop;
  route: GeoJSON.LineString;
  summary: string; // e.g. "Café Amara — 3 min, lit main road, 5 confirmations."
  estimatedMinutes: number;
}