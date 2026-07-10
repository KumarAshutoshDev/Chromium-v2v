// src/components/RouteComparisonPanel.tsx
import FloatingPanel from './FloatingPanel';
import './RouteComparisonPanel.css';

interface RouteComparisonPanelProps {
  routes: any[];
  onClose: () => void;
}

export default function RouteComparisonPanel({ routes, onClose }: RouteComparisonPanelProps) {
  // Build display items from the GeoJSON features
  const items = routes.map((r, i) => {
    const props = r.features?.[0]?.properties || {};
    return {
      label: i === 0 ? 'Recommended' : 'Shortest',
      walkTime: props.walkTime || '?',
      hazardCount: props.hazardCount || 0,
      key: i,
    };
  });

  return (
    <div className="route-comparison-wrapper">
      <FloatingPanel>
        <div className="route-comparison__header">
          <span className="route-comparison__title">Routes</span>
          <button className="route-comparison__close" onClick={onClose}>✕</button>
        </div>

        {items.map((item) => (
          <div key={item.key} className="route-comparison__row">
            <div className="route-comparison__label">{item.label}</div>
            <div className="route-comparison__meta">
              {item.walkTime}
              {item.hazardCount > 0 && (
                <span className="route-comparison__hazard"> · {item.hazardCount} hazard{item.hazardCount === 1 ? '' : 's'}</span>
              )}
            </div>
          </div>
        ))}
      </FloatingPanel>
    </div>
  );
}
