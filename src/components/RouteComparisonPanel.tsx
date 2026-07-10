// src/components/RouteComparisonPanel.tsx
import type { Route } from '../types';
import FloatingPanel from './FloatingPanel';
import './RouteComparisonPanel.css';

interface RouteComparisonPanelProps {
  routes: Route[];
  onClose: () => void;
}

export default function RouteComparisonPanel({ routes, onClose }: RouteComparisonPanelProps) {
  // Recommended always listed first, per design doc
  const sorted = [...routes].sort((a) =>
    a.type === 'recommended' ? -1 : 1
  );

  return (
    <div className="route-comparison-wrapper">
      <FloatingPanel>
        <div className="route-comparison__header">
          <span className="route-comparison__title">Routes</span>
          <button className="route-comparison__close" onClick={onClose}>✕</button>
        </div>

        {sorted.map((route) => (
          <div key={route.type} className="route-comparison__row">
            <div className="route-comparison__label">
              {route.type === 'recommended' ? 'Recommended' : 'Shortest'}
            </div>
            <div className="route-comparison__meta">
              {route.estimatedMinutes} min
              {route.hazardCount > 0 && (
                <span className="route-comparison__hazard"> · {route.hazardCount} hazard{route.hazardCount === 1 ? '' : 's'}</span>
              )}
            </div>
          </div>
        ))}
      </FloatingPanel>
    </div>
  );
}