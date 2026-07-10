// src/components/DestinationInput.tsx
import { useState } from 'react';
import FloatingPanel from './FloatingPanel';
import PrimaryButton from './PrimaryButton';
import './DestinationInput.css';

interface DestinationInputProps {
  onSetDestination: (query: string) => void | Promise<void>;
}

export default function DestinationInput({ onSetDestination }: DestinationInputProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    await onSetDestination(query.trim());
    setLoading(false);
  };

  return (
    <div className="destination-input-wrapper">
      <FloatingPanel>
        <div className="destination-input">
          <input
            className="destination-input__field"
            type="text"
            placeholder="Where are you headed?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={loading}
          />
          <PrimaryButton onClick={handleSubmit} disabled={loading}>
            {loading ? 'Finding routes…' : 'Set destination'}
          </PrimaryButton>
        </div>
      </FloatingPanel>
    </div>
  );
}