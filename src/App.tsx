// src/App.tsx
import { useEffect, useState } from 'react';
import MapView from './components/MapView';
import PanicButton from './components/PanicButton';
import { initAnonymousAuth } from './lib/firebase';

function App() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    initAnonymousAuth((user) => {
      setUid(user?.uid ?? null);
    });
  }, []);

  const handlePanicClick = () => {
    console.log('Panic Reroute tapped — Chunk E will build this screen');
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <MapView />
      <PanicButton onClick={handlePanicClick} />
      {uid && (
        <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, color: 'var(--ash)' }}>
          UID: {uid.slice(0, 8)}…
        </div>
      )}
    </div>
  );
}

export default App;