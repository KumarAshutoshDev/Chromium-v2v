// src/lib/mockData.ts
import type { SafeStop, Segment, Route, PanicResult } from '../types';

export const mockSafeStops: SafeStop[] = [
  { id: '1', name: 'Café Amara', category: 'cafe', location: { lat: 28.6145, lng: 77.2090 }, trustScore: 0.8 },
  { id: '2', name: 'Campus Security Booth', category: 'security', location: { lat: 28.6130, lng: 77.2105 }, trustScore: 0.95 },
  { id: '3', name: '24hr Pharmacy', category: 'pharmacy', location: { lat: 28.6150, lng: 77.2070 }, trustScore: 0.6 },
];

export const mockSegments: Segment[] = [
  { id: 's1', aggregatedSeverity: 0.7, geometry: { type: 'LineString', coordinates: [[77.2085, 28.6140], [77.2095, 28.6135]] } },
  { id: 's2', aggregatedSeverity: 0.3, geometry: { type: 'LineString', coordinates: [[77.2070, 28.6120], [77.2080, 28.6125]] } },
];

export const mockRoutes: Route[] = [
  {
    type: 'recommended',
    estimatedMinutes: 8,
    hazardCount: 0,
    geometry: { type: 'LineString', coordinates: [[77.209, 28.6139], [77.2100, 28.6142], [77.2110, 28.6148]] },
  },
  {
    type: 'shortest',
    estimatedMinutes: 6,
    hazardCount: 2,
    geometry: { type: 'LineString', coordinates: [[77.209, 28.6139], [77.2095, 28.6135], [77.2110, 28.6148]] },
  },
];

export const mockPanicResults: PanicResult[] = [
  {
    stop: mockSafeStops[0],
    summary: 'Café Amara — 3 min, lit main road, 5 confirmations.',
    estimatedMinutes: 3,
    route: { type: 'LineString', coordinates: [[77.209, 28.6139], [77.2090, 28.6145]] },
  },
  {
    stop: mockSafeStops[1],
    summary: 'Campus Security Booth — 5 min, lit main road, 8 confirmations.',
    estimatedMinutes: 5,
    route: { type: 'LineString', coordinates: [[77.209, 28.6139], [77.2105, 28.6130]] },
  },
  {
    stop: mockSafeStops[2],
    summary: '24hr Pharmacy — 6 min, moderate lighting, 3 confirmations.',
    estimatedMinutes: 6,
    route: { type: 'LineString', coordinates: [[77.209, 28.6139], [77.2070, 28.6150]] },
  },
];