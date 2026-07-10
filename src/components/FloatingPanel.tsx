// src/components/FloatingPanel.tsx
import type { ReactNode, CSSProperties } from 'react';
import './FloatingPanel.css';

interface FloatingPanelProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export default function FloatingPanel({ children, style, className }: FloatingPanelProps) {
  return (
    <div className={`floating-panel ${className ?? ''}`} style={style}>
      {children}
    </div>
  );
}