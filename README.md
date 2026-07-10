```markdown
# HerPath — AI-Guided Safe Commuting Network

**Tagline:** "Know which streets to avoid — and exactly where to go if you can't."

HerPath is a women-safety commuting platform that combines live hazard avoidance and safe haven navigation. It provides pre-trip route planning that avoids unsafe areas, a mid-commute panic reroute to the nearest verified safe stops, and a community-driven trust system for reporting and confirming hazards.

---

## Team

| Role | Owner | Responsibilities |
|------|-------|------------------|
| **Frontend (FE)** | [Frontend Dev Name] | React app, MapLibre, UI components, client-side flows |
| **Backend (BE)** | Ashutosh | Express API, Firebase Admin, A* route engine, auth middleware, deployment |
| **AI + Data (AI)** | [AI Dev Name] | Gemini integration, Firestore schema & seed data, trust/decay logic, validation |

---

## Architecture

- **Frontend:** React 18 + TypeScript + Vite
- **Map:** MapLibre GL JS v5 + OpenFreeMap (keyless tiles)
- **Backend:** Node.js + Express + TypeScript
- **Database:** Firebase Firestore
- **Auth:** Firebase Anonymous Auth
- **AI:** Gemini 2.5 Flash (JSON mode) for moderation, tag extraction, and explanations
- **Hosting:** Vercel (frontend), Render (backend)

The backend loads a preprocessed zone graph for A* routing. All AI moderation is server-side; the Gemini API key is never exposed to the client.

---

## Project Structure

```
HerPath/
├── server/                    # Backend (Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.ts    # Firebase Admin initialization
│   │   ├── middleware/
│   │   │   └── auth.ts        # Auth middleware (verify Firebase token)
│   │   ├── routes/
│   │   │   ├── safestops.ts   # GET /api/safestops
│   │   │   ├── reports.ts     # POST /api/reports
│   │   │   ├── confirm.ts     # POST /api/reports/:id/confirm
│   │   │   ├── segments.ts    # GET /api/segments
│   │   │   ├── route.ts       # POST /api/route
│   │   │   ├── panic.ts       # POST /api/panic-reroute
│   │   │   └── liveshare.ts   # POST /api/live-share, GET /api/live-share/:id
│   │   └── index.ts           # Server entry point
│   ├── .env                   # Environment variables (gitignored)
│   ├── .env.example           # Template for .env
│   ├── package.json
│   └── tsconfig.json
├── src/                       # (If frontend exists, else future)
│   └── ...
├── scripts/
│   └── get-test-token.ts      # Utility to generate test auth tokens
├── package.json               # Root package.json (for workspace or frontend)
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v20 LTS or later
- npm
- Firebase project with Firestore and Anonymous Auth enabled
- Google Cloud project with Gemini API enabled
- A service account JSON key from Firebase

### Backend Setup

1. **Clone the repository and navigate to the server folder:**
   ```bash
   git clone https://github.com/KumarAshutoshDev/Chromium-v2v.git
   cd Chromium-v2v/server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the example env file and fill in your keys:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual values:
   ```env
   PORT=4000
   FIREBASE_SERVICE_ACCOUNT=<paste your entire service account JSON here, compressed to one line>
   GEMINI_API_KEY=<your Gemini API key>
   ```

   **Important:** Never commit `.env` to Git. It is already in `.gitignore`.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:4000` with hot-reload enabled.

5. **Verify the server is running:**
   - Test Firestore connection: `http://localhost:4000/test-db` → `{"collections":[]}`
   - Test Gemini key: `http://localhost:4000/gemini-test` → `{"status":"LOADED",...}`

### Generating Test Auth Tokens

If you need to test authenticated endpoints manually, use the helper script:
```bash
cd server
npx ts-node ../scripts/get-test-token.ts
```
It prints a fresh ID token. Use it as:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:4000/protected-test
```

### Frontend Setup (for FE developer)

```bash
# Inside the project root (if frontend is set up)
npm install
npm run dev   # starts on localhost:5173
```
Set `VITE_API_URL=http://localhost:4000` in frontend `.env`.

---

## API Documentation

All endpoints return JSON. Auth-required endpoints expect an `Authorization: Bearer <Firebase ID token>` header.

### Public Endpoints

#### `GET /api/safestops`
Returns a list of safe stops (currently stubbed).

**Response:**
```json
[
  {
    "id": "stop-1",
    "name": "Café Amara",
    "category": "cafe",
    "location": { "lat": 12.9716, "lng": 77.5946 },
    "trustScore": 8.5
  }
]
```

#### `GET /api/segments`
Returns hazard segments (stubbed GeoJSON).

**Response:**
```json
[
  {
    "id": "seg-1",
    "zoneId": "zone-1",
    "geometry": {
      "type": "LineString",
      "coordinates": [[77.5946, 12.9716], [77.595, 12.972]]
    },
    "aggregatedSeverity": 2,
    "conditionTags": ["lighting"],
    "lastReportAt": "2026-07-09T17:53:48.211Z"
  }
]
```

### Authenticated Endpoints (require `Authorization` header)

#### `POST /api/reports`
Submit a condition report.

**Request:**
```json
{
  "segmentId": "seg-1",
  "type": "harassment",
  "text": "Bad lighting near the alley",
  "tags": ["lighting", "harassment_risk"]
}
```

**Response:** `201 Created`
```json
{
  "reportId": "report-1783619503451",
  "status": "pending",
  "message": "Report submitted (stub — not saved to DB yet)"
}
```

#### `POST /api/reports/:id/confirm`
Confirm an existing report.

**Response:**
```json
{
  "reportId": "report-123",
  "confirmedBy": "anonymous",
  "confirmations": 3,
  "message": "Confirmation recorded (stub)"
}
```

#### `POST /api/route`
Get recommended and shortest routes (stubbed GeoJSON).

**Request:**
```json
{
  "origin": { "lat": 12.9716, "lng": 77.5946 },
  "destination": { "lat": 12.9724, "lng": 77.5954 }
}
```

**Response:**
```json
{
  "recommended": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [[77.5946,12.9716],[77.595,12.972],[77.5954,12.9724]]
        },
        "properties": {
          "name": "Recommended",
          "walkTime": "8 min",
          "hazardCount": 1,
          "safeStopWaypoints": ["stop-1"]
        }
      }
    ]
  },
  "shortest": { /* similar GeoJSON with hazard warning */ }
}
```

#### `POST /api/panic-reroute`
Returns top 3 safe stops with safe routes and one-liner summaries.

**Request:**
```json
{
  "userLocation": { "lat": 12.9716, "lng": 77.5946 }
}
```

**Response:**
```json
[
  {
    "safeStopId": "stop-1",
    "name": "Café Amara",
    "category": "cafe",
    "location": { "lat": 12.9716, "lng": 77.5946 },
    "oneLiner": "Café Amara — 3 min, lit main road, 5 confirmations.",
    "trustScore": 8.5,
    "route": { "type": "LineString", "coordinates": [[...]] },
    "walkTime": "3 min"
  }
]
```

#### `POST /api/live-share` & `GET /api/live-share/:id`
Create and retrieve live location shares (stubbed).

---

## Backend Implementation Status

### Completed ✅

- [x] Express + TypeScript server (port 4000)
- [x] Firebase Admin SDK connected to Firestore
- [x] Anonymous Auth enabled in Firebase Console
- [x] Environment variable management (keys stored in `.env`, gitignored)
- [x] Auth middleware (`verifyIdToken`), tested with real tokens
- [x] API stubs for all planned endpoints (ready for frontend integration)

### Blocked 🔒 (awaiting AI team deliverables)

- Firestore security rules (need final schema)
- Real Firestore queries (need seed data)
- A* route engine (need zone graph JSON)
- Panic reroute ranking (need trust/decay weights)
- Live severity aggregation (need moderation pipeline)

Once the AI teammate provides the Firestore schemas, seed data, and zone graph, the remaining backend tasks (security rules, real queries, A* engine) can be implemented.

---

## Branch Workflow

We follow a feature-branch workflow:

- **`main`** — production-ready code
- **`backend`** — current backend development branch (by Ashutosh)
- **`feature/<owner>-<phase#>-<desc>`** — for new features

Before starting a new task:
```bash
git checkout main
git pull
git checkout -b feature/be-XX-short-desc
```

After completing, open a PR to `main`.

---

## Environment Variables (Backend)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `FIREBASE_SERVICE_ACCOUNT` | Full Firebase service account JSON as a single-line string |
| `GEMINI_API_KEY` | Gemini API key from Google AI Studio |

These are stored in `server/.env` and **never committed**.

---

## License

This project is created for the Vibe2Vision 2026. All rights reserved.
```
