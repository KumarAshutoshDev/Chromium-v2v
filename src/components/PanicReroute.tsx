// src/components/PanicReroute.tsx
import { useEffect, useState } from 'react';
import type { PanicResult } from '../types';
import { fetchPanicReroute } from '../lib/api';
import SafeStopCard from './SafeStopCard';
import PrimaryButton from './PrimaryButton';
import './PanicReroute.css';

interface PanicRerouteProps {
  onSelect: (result: PanicResult) => void;
  onDismiss: () => void;
}

export default function PanicReroute({ onSelect, onDismiss }: PanicRerouteProps) {
  const [results, setResults] = useState<PanicResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use Bangalore demo coordinates (matches seeded data)
    fetchPanicReroute([12.9716, 77.5946])
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="panic-reroute">
      <div className="panic-reroute__scrim" onClick={onDismiss} />

      <div className="panic-reroute__sheet">
        <div className="panic-reroute__header">
          <span className="panic-reroute__title">Nearby safe stops</span>
          <button className="panic-reroute__close" onClick={onDismiss}>✕</button>
        </div>

        {loading && <div className="panic-reroute__loading">Finding safe stops…</div>}

        {!loading && results.filter(Boolean).map((result: any) => (
          <div key={result.safeStopId || result.name} className="panic-reroute__card">
            <SafeStopCard
              name={result.name}
              distance={result.walkTime || `${result.distance}`}
              lighting={result.lighting || 'unknown'}
              confirmations={Number(result.oneLiner?.match(/(\d+) confirmation/)?.[1] ?? 0)}
              isConfirmed={result.trustScore > 7}
            />
            <PrimaryButton onClick={() => onSelect(result)}>Go</PrimaryButton>
          </div>
        ))}
      </div>
    </div>
  );
}
