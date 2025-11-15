import React, { useState } from 'react';
import { getStrapiImageUrl } from '../utils/api';
import ImageAttribution from './ImageAttribution';

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
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (familyId) => {
    setExpandedCard(expandedCard === familyId ? null : familyId);
  };

  const truncateText = (text, maxLength = 180) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <section className="families-section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h1>Family Stories</h1>
            <p>Personal accounts from families who lived through the Little Rock School Integration Crisis</p>
          </div>
          {!loading && handleRefresh && (
            <button
              onClick={handleRefresh}
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.5)',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                marginTop: '1rem'
              }}
              title="Refresh data from Strapi CMS"
            >
              🔄 Refresh Data
            </button>
          )}
        </div>

        {loading && (
          <div className="loading">
            <p>Loading family stories from the archive...</p>
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
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.5)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                🔄 Try Again
              </button>

              <a
                href="https://children-families-cms.onrender.com/admin"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                ⚙️ CMS Admin
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
              const featuredImageUrl = getStrapiImageUrl(family.featuredPhoto);
              const isExpanded = expandedCard === family.id;
              const description = family.description || 'No description available.';
              const shouldTruncate = description.length > 180;

              console.log('Family data for', family.familyName, ':', {
                family,
                featuredPhoto: family.featuredPhoto,
                featuredImageUrl
              });

              return (
                <div key={family.id} className={`family-card ${isExpanded ? 'expanded' : ''}`}>
                  <div className="family-header">
                    <h2>{family.familyName || 'Unknown Family'}</h2>
                    <span className="time-badge">{family.timePeriod || 'Unknown Period'}</span>
                  </div>

                  <ImageAttribution family={family} />

                  <div className="family-content">
                    <div className="family-description-container">
                      <p className="family-description">
                        {isExpanded ? description : truncateText(description)}
                      </p>
                      {shouldTruncate && !isExpanded && (
                        <button
                          className="read-more-btn"
                          onClick={() => toggleCard(family.id)}
                        >
                          Read more
                        </button>
                      )}
                    </div>

                  <div className="family-details">
                    <div className="detail-item">
                      <span className="label">Location:</span>
                      <span className="value">{family.location || 'Unknown'}</span>
                    </div>

                    {family.childrenNames && (
                      <div className="detail-item">
                        <span className="label">Children:</span>
                        <span className="value">{family.childrenNames}</span>
                      </div>
                    )}

                    <div className="detail-item">
                      <span className="label">Archived:</span>
                      <span className="value">
                        {family.publishedAt
                          ? new Date(family.publishedAt).toLocaleDateString()
                          : 'Unknown date'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                  <div className="family-actions">
                    <button
                      className="btn-primary"
                      onClick={() => toggleCard(family.id)}
                    >
                      {isExpanded ? '📖 Hide Story' : '📖 View Full Story'}
                    </button>
                    <button className="btn-secondary">Related Documents</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
});

FamiliesSection.displayName = 'FamiliesSection';

export default FamiliesSection;