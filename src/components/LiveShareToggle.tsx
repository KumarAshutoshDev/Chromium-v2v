// src/components/LiveShareToggle.tsx
import { useState } from 'react';
import { createLiveShare } from '../lib/api';
import PrimaryButton from './PrimaryButton';
import './LiveShareToggle.css';

interface LiveShareToggleProps {
  uid: string;
}

export default function LiveShareToggle({ uid }: LiveShareToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const [contact, setContact] = useState('');
  const [shareLink, setShareLink] = useState<string | null>(null);

  const handleEnable = async () => {
    if (!contact.trim()) return;
    const { shareId } = await createLiveShare(uid, contact.trim());
    setShareLink(`${window.location.origin}/share/${shareId}`);
    setEnabled(true);
  };

  const handleDisable = () => {
    setEnabled(false);
    setShareLink(null);
    setContact('');
  };

  return (
    <div className="live-share">
      {!enabled ? (
        <>
          <input
            className="live-share__input"
            type="text"
            placeholder="Contact to notify (email or phone)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <PrimaryButton onClick={handleEnable}>Enable live-share</PrimaryButton>
        </>
      ) : (
        <div className="live-share__active">
          <div className="live-share__label">Live-share active · expires in 30 min</div>
          <div className="live-share__link">{shareLink}</div>
          <button className="live-share__disable" onClick={handleDisable}>Stop sharing</button>
        </div>
      )}
    </div>
  );
}