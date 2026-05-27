import React, { useState, useEffect, useCallback } from 'react';
import ImageAttribution from './ImageAttribution';

/* ── Inline SVG close icon ───────────────────────────────── */
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/* ── Full-story modal ─────────────────────────────────────── */
const StoryModal = ({ family, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="story-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Full story: ${family.familyName}`}
    >
      <div className="story-modal">
        <div className="story-modal-header">
          <div className="story-modal-title">
            <h2>{family.familyName}</h2>
            <span className="time-badge">{family.timePeriod}</span>
          </div>
          <button
            className="story-modal-close"
            onClick={onClose}
            aria-label="Close story"
          >
            <XIcon />
          </button>
        </div>

        <div className="story-modal-body">
          <ImageAttribution family={family} />

          <p className="story-modal-description">
            {family.description || 'No description available.'}
          </p>

          <div className="story-modal-details">
            {family.location && (
              <div className="detail-item">
                <span className="label">Location:</span>
                <span className="value">{family.location}</span>
              </div>
            )}
            {family.childrenNames && (
              <div className="detail-item">
                <span className="label">Children:</span>
                <span className="value">{family.childrenNames}</span>
              </div>
            )}
            {family.collection && (
              <div className="detail-item">
                <span className="label">Collection:</span>
                <span className="value">{family.collection}</span>
              </div>
            )}
            {family.usageRights && (
              <div className="detail-item">
                <span className="label">Usage Rights:</span>
                <span className="value">{family.usageRights}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main section ─────────────────────────────────────────── */
const FamiliesSection = React.memo(({
  families,
  loading,
  error,
  handleRetry,
  handleRefresh,
  isSearchActive,
  searchResults
}) => {
  const displayFamilies = isSearchActive ? searchResults.families : families;
  const [selectedFamily, setSelectedFamily] = useState(null);

  const openModal  = useCallback((family) => setSelectedFamily(family), []);
  const closeModal = useCallback(() => setSelectedFamily(null), []);

  const truncate = (text, max = 200) => {
    if (!text || text.length <= max) return text;
    return text.substring(0, max).trimEnd() + '…';
  };

  return (
    <section className="families-section">
      <div className="container">
        <div className="section-intro">
          <h1>Family Stories</h1>
          <p>Personal accounts from families who lived through the Little Rock School Integration Crisis</p>
        </div>

        {loading && (
          <div className="loading">
            <p>Loading family stories from the archive…</p>
          </div>
        )}

        {error && (
          <div className="error">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>⚠️</span>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Archive Connection Issue</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{error}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleRetry}
                style={{
                  background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.5)',
                  padding: '0.75rem 1.5rem', borderRadius: '0.5rem',
                  cursor: 'pointer', fontWeight: '600'
                }}
              >
                Try Again
              </button>
              <a
                href="https://children-families-cms.onrender.com/admin"
                target="_blank" rel="noopener noreferrer"
                style={{
                  background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  padding: '0.75rem 1.5rem', borderRadius: '0.5rem',
                  textDecoration: 'none', fontWeight: '600'
                }}
              >
                CMS Admin
              </a>
            </div>
          </div>
        )}

        {!loading && !error && families.length === 0 && (
          <div className="no-content">
            <p>No family stories available yet. Stories are being added to the archive.</p>
          </div>
        )}

        {!loading && families.length > 0 && (
          <div className="families-grid">
            {displayFamilies.map((family) => {
              const description = family.description || '';
              const preview = truncate(description);
              const hasMore = description.length > 200;

              return (
                <div key={family.id} className="family-card">
                  <div className="family-header">
                    <h2>{family.familyName || 'Unknown Family'}</h2>
                    <span className="time-badge">{family.timePeriod || 'Unknown Period'}</span>
                  </div>

                  <ImageAttribution family={family} />

                  <div className="family-content">
                    <p className="family-description">
                      {preview}
                      {hasMore && (
                        <button
                          className="read-more-inline"
                          onClick={() => openModal(family)}
                        >
                          {' '}Read full story
                        </button>
                      )}
                    </p>

                    <div className="family-details">
                      {family.location && (
                        <div className="detail-item">
                          <span className="label">Location:</span>
                          <span className="value">{family.location}</span>
                        </div>
                      )}
                      {family.childrenNames && (
                        <div className="detail-item">
                          <span className="label">Children:</span>
                          <span className="value">{family.childrenNames}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="family-actions">
                    <button
                      className="btn-primary"
                      onClick={() => openModal(family)}
                    >
                      View Full Story
                    </button>
                    <button className="btn-secondary">Related Documents</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedFamily && (
        <StoryModal family={selectedFamily} onClose={closeModal} />
      )}
    </section>
  );
});

FamiliesSection.displayName = 'FamiliesSection';

export default FamiliesSection;
