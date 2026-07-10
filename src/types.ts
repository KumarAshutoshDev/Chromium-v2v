// src/types.ts
import type { LineString } from 'geojson';
export interface SafeStop {
  id: string;
  name: string;
  category: string;
  location: { lat: number; lng: number };
  trustScore: number;
}

export interface Segment {
  id: string;
  geometry: LineString;
  aggregatedSeverity: number;
}

export interface Route {
  type: 'recommended' | 'shortest';
  geometry: LineString;
  estimatedMinutes: number;
  hazardCount: number;
}

export interface PanicResult {
  safeStopId: string;
  name: string;
  category: string;
  location: { lat: number; lng: number };
  trustScore: number;
  oneLiner: string;
  route: { type: string; coordinates: number[][] };
  walkTime: string;
  distance?: string;
  hazardCount?: number;
  lighting?: string;
}
