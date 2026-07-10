// src/App.tsx (updated)
import { useEffect, useState } from 'react';
import MapView from './components/MapView';
import PanicButton from './components/PanicButton';
import ReportButton from './components/ReportButton';
import ReportForm from './components/ReportForm';
import SafeStopCard from './components/SafeStopCard';
import FloatingPanel from './components/FloatingPanel';
import { initAnonymousAuth } from './lib/firebase';
import type { SafeStop } from './types';
import type { ConditionTag } from './components/ReportForm';

function App() {
  const [uid, setUid] = useState<string | null>(null);
  const [selectedStop, setSelectedStop] = useState<SafeStop | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    initAnonymousAuth((user) => setUid(user?.uid ?? null));
  }, []);

  const handleReportSubmit = (data: { tags: ConditionTag[]; text: string }) => {
    // TODO: call POST /api/reports here once BE endpoint is live
    console.log('Report submitted:', { ...data, uid });
    setShowReportForm(false);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <MapView onSafeStopClick={setSelectedStop} />
      <PanicButton onClick={() => console.log('Panic — Chunk E builds this')} />

      <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
        <ReportButton onClick={() => setShowReportForm(true)}>Report condition</ReportButton>
      </div>

      {showReportForm && (
        <div style={{ position: 'absolute', bottom: 90, left: 24, width: 300 }}>
          <FloatingPanel>
            <ReportForm onSubmit={handleReportSubmit} onCancel={() => setShowReportForm(false)} />
          </FloatingPanel>
        </div>
      )}

      {selectedStop && (
        <div style={{ position: 'absolute', top: 16, left: 16, width: 280 }}>
          <FloatingPanel>
            <SafeStopCard
              name={selectedStop.name}
              distance="—"
              lighting={selectedStop.category}
              confirmations={0}
              isConfirmed={selectedStop.trustScore > 0.7}
            />
            <button onClick={() => setSelectedStop(null)} style={{ marginTop: 8, background: 'none', border: 'none', color: 'var(--ash)', cursor: 'pointer' }}>
              Close
            </button>
          </FloatingPanel>
        </div>
      )}

      {uid && (
        <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, color: 'var(--ash)' }}>
          UID: {uid.slice(0, 8)}…
        </div>
      )}
    </div>
  );
}

export default App;