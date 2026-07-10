import type { GeoPoint } from "firebase-admin/firestore";

// --- Phase 2 Firestore Schemas (Tasks 13-18) ---

export interface Zone {
  id: string;
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  campusAnchor: GeoPoint;
}

export interface Segment {
  id: string;
  zoneId: string;
  geometry: GeoPoint[]; // array of points forming a line
  aggregatedSeverity: number;
  lastReportAt: string; // ISO timestamp
  conditionTags: {
    lighting?: string;
    crowd?: string;
    harassment_risk?: string;
  };
}

export interface SafeStop {
  id: string;
  zoneId: string;
  location: GeoPoint;
  name: string;
  category: string; // e.g., cafe, pharmacy, transit
  trustScore: number;
  openHoursCached?: string;
  openHoursLastRefreshed?: string;
  osmVerified: boolean;
  confirmations: string[]; // array of UIDs
}

export interface Report {
  id: string;
  segmentId?: string;
  safeStopId?: string;
  type: "condition" | "nomination";
  text: string;
  structuredTags: {
    lighting?: string;
    crowd?: string;
    harassment_risk?: string;
  };
  status: "pending" | "valid" | "duplicate" | "spam";
  severity?: number;
  confirmations: string[]; // array of UIDs
  createdAt: string; // ISO timestamp
  uid: string; // anonymous Firebase UID
  containsPersonalIdentifier?: boolean;
  moderationExplanation?: string;
}

export interface User {
  uid: string;
  role: "commuter" | "admin";
  reportHistory: string[]; // array of reportIds
}

export interface LiveShare {
  id: string;
  uid: string;
  contactInfoEncrypted: string;
  expiresAt: string; // ISO timestamp
  active: boolean;
}
