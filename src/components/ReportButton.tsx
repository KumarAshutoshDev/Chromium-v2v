// src/components/ReportButton.tsx
import type { ReactNode } from 'react';
import './ReportButton.css';

interface ReportButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function ReportButton({ children, onClick }: ReportButtonProps) {
  return (
    <button className="report-button" onClick={onClick}>
      {children}
    </button>
  );
}