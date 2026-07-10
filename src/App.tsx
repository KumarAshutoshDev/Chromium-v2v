// src/App.tsx
import { useEffect, useState } from 'react';
import MapView from './components/MapView';
import PanicButton from './components/PanicButton';
import PanicReroute from './components/PanicReroute';
import ReportButton from './components/ReportButton';
import ReportForm from './components/ReportForm';
import SafeStopCard from './components/SafeStopCard';
import FloatingPanel from './components/FloatingPanel';
import DestinationInput from './components/DestinationInput';
import RouteComparisonPanel from './components/RouteComparisonPanel';
import { initAnonymousAuth } from './lib/firebase';
import { fetchRoute, confirmReport } from './lib/api';
import type { SafeStop, Route, PanicResult } from './types';
import type { ConditionTag } from './components/ReportForm';
import NominationForm from './components/NominationForm';
import LiveShareToggle from './components/LiveShareToggle';
import type { NominationData } from './components/NominationForm';

function App() {
  const [uid, setUid] = useState<string | null>(null);
  const [selectedStop, setSelectedStop] = useState<SafeStop | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showPanic, setShowPanic] = useState(false);
  const [panicRoute, setPanicRoute] = useState<PanicResult | null>(null);
  const [showNominationForm, setShowNominationForm] = useState(false);

  useEffect(() => {
    initAnonymousAuth((user) => setUid(user?.uid ?? null));
  }, []);

  const handleReportSubmit = (data: { tags: ConditionTag[]; text: string }) => {
    console.log('Report submitted:', { ...data, uid });
    setShowReportForm(false);
  };

  const handleNominationSubmit = (data: NominationData) => {
    console.log('Nomination submitted:', { ...data, uid });
    setShowNominationForm(false);
  };

  const handleSetDestination = async (query: string) => {
    console.log('Destination set:', query);
    const result = await fetchRoute([77.209, 28.6139], [77.2110, 28.6148]);
    setRoutes(result);
  };

  const handlePanicSelect = (result: PanicResult) => {
    setPanicRoute(result);
    setShowPanic(false);
  };

  // Render the panic-selected route as a single "recommended-style" route on the map
  const panicRouteAsRoute: Route[] = panicRoute
    ? [{ type: 'recommended', geometry: panicRoute.route, estimatedMinutes: panicRoute.estimatedMinutes, hazardCount: 0 }]
    : [];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <MapView
        onSafeStopClick={setSelectedStop}
        routes={panicRoute ? panicRouteAsRoute : routes}
      />

      <PanicButton onClick={() => setShowPanic(true)} />

      {showPanic && (
        <PanicReroute onSelect={handlePanicSelect} onDismiss={() => setShowPanic(false)} />
      )}

      {!showPanic && <DestinationInput onSetDestination={handleSetDestination} />}

      {!showPanic && routes.length > 0 && !panicRoute && (
        <RouteComparisonPanel routes={routes} onClose={() => setRoutes([])} />
      )}

      {panicRoute && (
        <div className="panic-directions-banner" style={{
          position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, width: 'min(92vw, 420px)',
        }}>
          <FloatingPanel>
            <div style={{ fontFamily: 'var(--font-body)', color: 'var(--paper)', fontSize: 'var(--text-sm)', marginBottom: 12 }}>
              Heading to <strong>{panicRoute.stop.name}</strong> — {panicRoute.estimatedMinutes} min
            </div>
            {uid && <LiveShareToggle uid={uid} />}
            <button
              onClick={() => setPanicRoute(null)}
              style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--ash)', cursor: 'pointer' }}
            >
              End
            </button>
          </FloatingPanel>
        </div>
      )}

      <div style={{
        position: 'absolute', bottom: 24, left: 24, right: 100,
        display: 'flex', gap: 8, flexWrap: 'wrap',
      }}>
        <ReportButton onClick={() => setShowReportForm(true)}>Report condition</ReportButton>
        <ReportButton onClick={() => setShowNominationForm(true)}>Nominate SafeStop</ReportButton>
      </div>

      {showReportForm && (
        <div style={{ position: 'absolute', bottom: 90, left: 24, width: 'min(85vw, 300px)' }}>
          <FloatingPanel>
            <ReportForm onSubmit={handleReportSubmit} onCancel={() => setShowReportForm(false)} />
          </FloatingPanel>
        </div>
      )}

      {showNominationForm && (
        <div style={{ position: 'absolute', bottom: 90, left: 24, width: 'min(85vw, 300px)' }}>
          <FloatingPanel>
            <NominationForm onSubmit={handleNominationSubmit} onCancel={() => setShowNominationForm(false)} />
          </FloatingPanel>
        </div>
      )}

      {selectedStop && (
        <div style={{ position: 'absolute', top: 16, left: 16, width: 'min(85vw, 280px)', zIndex: 20 }}>
          <FloatingPanel>
            <SafeStopCard
              name={selectedStop.name}
              distance="—"
              lighting={selectedStop.category}
              confirmations={0}
              isConfirmed={selectedStop.trustScore > 0.7}
              onConfirm={() => confirmReport(selectedStop.id, uid ?? 'anon')}
            />
            <button onClick={() => setSelectedStop(null)} style={{ marginTop: 8, background: 'none', border: 'none', color: 'var(--ash)', cursor: 'pointer' }}>
              Close
            </button>
          </FloatingPanel>
        </div>
      )}

      {uid && (
        <div style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 10, color: 'var(--ash)' }}>
          UID: {uid.slice(0, 8)}…
        </div>
      )}
    </div>
  );
}

export default App;