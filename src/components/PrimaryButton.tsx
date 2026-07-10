// src/components/PrimaryButton.tsx
import type { ReactNode } from 'react';
import './PrimaryButton.css';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function PrimaryButton({ children, onClick, disabled }: PrimaryButtonProps) {
  return (
    <button className="primary-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}