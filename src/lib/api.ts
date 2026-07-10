// src/lib/api.ts
import type { SafeStop, Segment } from '../types';
import { mockSafeStops, mockSegments } from './mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const USE_MOCK = true; // flip to false once BE's endpoints are confirmed working

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
    console.log(`(mock) confirmed report ${reportId} by ${uid}`);
    return;
  }
  await fetch(`${API_URL}/api/reports/${reportId}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid }),
  });
}