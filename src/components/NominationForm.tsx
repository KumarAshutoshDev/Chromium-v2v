// src/components/NominationForm.tsx
import { useState } from 'react';
import './NominationForm.css';

const CATEGORIES = ['cafe', 'pharmacy', 'security', 'store', 'restaurant', 'other'];

export interface NominationData {
  name: string;
  category: string;
}

interface NominationFormProps {
  onSubmit: (data: NominationData) => void;
  onCancel: () => void;
}

export default function NominationForm({ onSubmit, onCancel }: NominationFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), category });
    setName('');
  };

  return (
    <div className="nomination-form">
      <input
        className="nomination-form__input"
        type="text"
        placeholder="Place name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="nomination-form__chips">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`nomination-form__chip ${category === cat ? 'nomination-form__chip--active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="nomination-form__hint">
        Tap the map to set location (coming once map-tap picking is wired up)
      </div>

      <div className="nomination-form__actions">
        <button className="nomination-form__cancel" onClick={onCancel}>Cancel</button>
        <button className="nomination-form__submit" onClick={handleSubmit}>Nominate</button>
      </div>
    </div>
  );
}