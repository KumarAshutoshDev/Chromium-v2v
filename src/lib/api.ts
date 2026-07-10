// src/lib/api.ts
import type { SafeStop, Segment, Route, PanicResult } from '../types';
import { mockSafeStops, mockSegments, mockRoutes, mockPanicResults } from './mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const USE_MOCK = true; // flip to false once BE's real endpoints are confirmed working

export async function fetchSafeStops(): Promise<SafeStop[]> {
  if (USE_MOCK) return mockSafeStops;
  const res = await fetch(`${API_URL}/api/safestops`);
  if (!res.ok) throw new Error('Failed to fetch safestops');
  return res.json();
}

export async function fetchSegments(): Promise<Segment[]> {
  if (USE_MOCK) return mockSegments;
  const res = await fetch(`${API_URL}/api/segments`);
  if (!res.ok) throw new Error('Failed to fetch segments');
  return res.json();
}

export async function confirmReport(reportId: string, uid: string): Promise<void> {
  if (USE_MOCK) {
    console.log(`(mock) confirmed ${reportId} by ${uid}`);
    return;
  }
  await fetch(`${API_URL}/api/reports/${reportId}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid }),
  });
}

export async function fetchRoute(
  origin: [number, number],
  destination: [number, number]
): Promise<Route[]> {
  if (USE_MOCK) return mockRoutes;
  const res = await fetch(`${API_URL}/api/route`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination }),
  });
  if (!res.ok) throw new Error('Failed to fetch route');
  return res.json();
}

export async function fetchPanicReroute(userLocation: [number, number]): Promise<PanicResult[]> {
  if (USE_MOCK) return mockPanicResults;
  const res = await fetch(`${API_URL}/api/panic-reroute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userLocation }),
  });
  if (!res.ok) throw new Error('Failed to fetch panic reroute');
  return res.json();
}

export async function createLiveShare(uid: string, contactInfo: string): Promise<{ shareId: string }> {
  if (USE_MOCK) return { shareId: 'mock-share-123' };
  const res = await fetch(`${API_URL}/api/live-share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, contactInfo }),
  });
  if (!res.ok) throw new Error('Failed to create live share');
  return res.json();
}