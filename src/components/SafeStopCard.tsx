// src/components/SafeStopCard.tsx
import './SafeStopCard.css';

interface SafeStopCardProps {
  name: string;
  distance: string;     // e.g. "3 min"
  lighting: string;     // e.g. "lit main road"
  confirmations: number;
  isConfirmed?: boolean;
}

export default function SafeStopCard({
  name,
  distance,
  lighting,
  confirmations,
  isConfirmed = false,
}: SafeStopCardProps) {
  return (
    <div className={`safestop-card ${isConfirmed ? 'safestop-card--confirmed' : ''}`}>
      <div className="safestop-card__title">{name}</div>
      <div className="safestop-card__meta">
        {distance} · {lighting} · {confirmations} confirmation{confirmations === 1 ? '' : 's'}
      </div>
    </div>
  );
}