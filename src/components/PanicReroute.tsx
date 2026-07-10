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
    // MVP: user's real location comes later via geolocation; placeholder for now
    fetchPanicReroute([77.209, 28.6139])
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

        {!loading && results.map((result) => (
          <div key={result.stop.id} className="panic-reroute__card">
            <SafeStopCard
              name={result.stop.name}
              distance={`${result.estimatedMinutes} min`}
              lighting={result.summary.split(',')[1]?.trim() ?? result.stop.category}
              confirmations={Number(result.summary.match(/(\d+) confirmation/)?.[1] ?? 0)}
              isConfirmed={result.stop.trustScore > 0.7}
            />
            <PrimaryButton onClick={() => onSelect(result)}>Go</PrimaryButton>
          </div>
        ))}
      </div>
    </div>
  );
}