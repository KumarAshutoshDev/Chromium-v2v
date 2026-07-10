// src/components/PanicButton.tsx
import './PanicButton.css';

interface PanicButtonProps {
  onClick?: () => void;
}

export default function PanicButton({ onClick }: PanicButtonProps) {
  return (
    <button className="panic-button" onClick={onClick} aria-label="Panic Reroute">
      PANIC
    </button>
  );
}