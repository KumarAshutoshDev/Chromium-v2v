// src/components/SafeStopCard.tsx
import { useState } from 'react';
import './SafeStopCard.css';

interface SafeStopCardProps {
  name: string;
  distance: string;
  lighting: string;
  confirmations: number;
  isConfirmed?: boolean;
  onConfirm?: () => void;
  alreadyConfirmedByUser?: boolean;
}

export default function SafeStopCard({
  name,
  distance,
  lighting,
  confirmations,
  isConfirmed = false,
  onConfirm,
  alreadyConfirmedByUser = false,
}: SafeStopCardProps) {
  const [confirmedLocally, setConfirmedLocally] = useState(alreadyConfirmedByUser);

  const handleConfirm = () => {
    if (confirmedLocally) return;
    setConfirmedLocally(true);
    onConfirm?.();
  };

  return (
    <div className={`safestop-card ${isConfirmed ? 'safestop-card--confirmed' : ''}`}>
      <div className="safestop-card__title">{name}</div>
      <div className="safestop-card__meta">
        {distance} · {lighting} · {confirmations + (confirmedLocally && !alreadyConfirmedByUser ? 1 : 0)} confirmation
        {confirmations === 1 ? '' : 's'}
      </div>
      {onConfirm && (
        <button
          className="safestop-card__confirm"
          onClick={handleConfirm}
          disabled={confirmedLocally}
        >
          {confirmedLocally ? '✓ Confirmed' : 'I see this too'}
        </button>
      )}
    </div>
  );
}