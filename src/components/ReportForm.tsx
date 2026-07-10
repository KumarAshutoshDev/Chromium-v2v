// src/components/ReportForm.tsx
import { useState } from 'react';
import './ReportForm.css';

export type ConditionTag = 'lighting' | 'crowd_density' | 'harassment_risk';

interface ReportFormProps {
  onSubmit: (data: { tags: ConditionTag[]; text: string }) => void;
  onCancel: () => void;
}

const ALL_TAGS: ConditionTag[] = ['lighting', 'crowd_density', 'harassment_risk'];

export default function ReportForm({ onSubmit, onCancel }: ReportFormProps) {
  const [selectedTags, setSelectedTags] = useState<ConditionTag[]>([]);
  const [text, setText] = useState('');

  const toggleTag = (tag: ConditionTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    onSubmit({ tags: selectedTags, text });
    setSelectedTags([]);
    setText('');
  };

  return (
    <div className="report-form">
      <div className="report-form__chips">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            className={`report-form__chip ${selectedTags.includes(tag) ? 'report-form__chip--active' : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {tag.replace('_', ' ')}
          </button>
        ))}
      </div>

      <textarea
        className="report-form__textarea"
        placeholder="describe what you saw"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />

      <div className="report-form__actions">
        <button className="report-form__cancel" onClick={onCancel}>Cancel</button>
        <button className="report-form__submit" onClick={handleSubmit}>Submit report</button>
      </div>
    </div>
  );
}