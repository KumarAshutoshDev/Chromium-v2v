// src/lib/mockData.ts
import type { SafeStop, Segment } from '../types';

// TODO: delete this file once GET /api/safestops and GET /api/segments are live —
// replace calls to these with real fetch() calls (see fetchSafeStops/fetchSegments below)
export const mockSafeStops: SafeStop[] = [
  { id: '1', name: 'Café Amara', category: 'cafe', location: { lat: 28.6145, lng: 77.2090 }, trustScore: 0.8 },
  { id: '2', name: 'Campus Security Booth', category: 'security', location: { lat: 28.6130, lng: 77.2105 }, trustScore: 0.95 },
  { id: '3', name: '24hr Pharmacy', category: 'pharmacy', location: { lat: 28.6150, lng: 77.2070 }, trustScore: 0.6 },
];

export const mockSegments: Segment[] = [
  {
    id: 's1',
    aggregatedSeverity: 0.7,
    geometry: {
      type: 'LineString',
      coordinates: [
        [77.2085, 28.6140],
        [77.2095, 28.6135],
      ],
    },
  },
  {
    id: 's2',
    aggregatedSeverity: 0.3,
    geometry: {
      type: 'LineString',
      coordinates: [
        [77.2070, 28.6120],
        [77.2080, 28.6125],
      ],
    },
  },
];