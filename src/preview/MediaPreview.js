import React, { useState } from 'react';
import './preview.css';
import PreviewBadge from './PreviewBadge';
import { MEDIA } from './previewData';

const ICONS = {
  video: (<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9l5 3-5 3z" /></svg>),
  audio: (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12v0M8 8v8M12 5v14M16 8v8M20 12v0" /></svg>),
  photo: (<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="M4 18l5-5 4 3 3-3 4 4" /></svg>),
  doc: (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9.5 12h6M9.5 15.5h6" /></svg>)
};

const FILTERS = [['all', 'All'], ['video', 'Video'], ['audio', 'Audio'], ['photo', 'Photographs'], ['doc', 'Documents']];

const MediaPreview = () => {
  const [filter, setFilter] = useState('all');
  const items = MEDIA.filter((m) => filter === 'all' || m.type === filter);
  return (
    <div className="pv-wrap">
      <PreviewBadge>Sample items. Every real item shows how it may be accessed.</PreviewBadge>
      <div className="pv-filters">
        {FILTERS.map(([key, label]) => (
          <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>
      <div className="pv-grid">
        {items.map((m) => (
          <div key={`${m.type}-${m.title}`} className="pv-card pv-tile">
            <div className={`pv-thumb ${m.type}`}>{ICONS[m.type]}</div>
            <div className="pv-meta">
              <h4>{m.title}</h4>
              <div className="pv-links">
                <span className={`pv-chip ${m.tier}`}>{m.tier === 'pub' ? 'Public' : 'Onsite at CAHC'}</span>
                <span className="pv-sample">Sample item</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPreview;
