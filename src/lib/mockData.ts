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
    safeStopId: '1',
    name: 'Café Amara',
    category: 'cafe',
    location: { lat: 12.9716, lng: 77.5946 },
    trustScore: 8.5,
    oneLiner: 'Café Amara — 3 min, lit main road, 5 confirmations.',
    route: { type: 'LineString', coordinates: [[77.5946, 12.9716], [77.5948, 12.9718]] },
    walkTime: '3 min',
  },
  {
    safeStopId: '2',
    name: 'Campus Security Booth',
    category: 'security',
    location: { lat: 12.9720, lng: 77.5950 },
    trustScore: 9.2,
    oneLiner: 'Campus Security Booth — 5 min, lit main road, 8 confirmations.',
    route: { type: 'LineString', coordinates: [[77.5950, 12.9720], [77.5952, 12.9722]] },
    walkTime: '5 min',
  },
  {
    safeStopId: '3',
    name: '24hr Pharmacy',
    category: 'pharmacy',
    location: { lat: 12.9730, lng: 77.5955 },
    trustScore: 6.8,
    oneLiner: '24hr Pharmacy — 6 min, moderate lighting, 3 confirmations.',
    route: { type: 'LineString', coordinates: [[77.5955, 12.9730], [77.5957, 12.9732]] },
    walkTime: '6 min',
  },
];
