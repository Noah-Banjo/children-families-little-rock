import React, { useState, useEffect } from 'react';
import { getStrapiImageUrl } from '../utils/api';

const InfoIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <circle cx="5.5" cy="5.5" r="5" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M5.5 5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="5.5" cy="3.25" r="0.65" fill="currentColor"/>
  </svg>
);

const ImageAttribution = ({ family }) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [isMobile, setIsMobile]   = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const featuredImageUrl = getStrapiImageUrl(family.featuredPhoto);
  if (!featuredImageUrl) return null;

  const hasAttribution = family.imageSource || family.photographer ||
                         family.imageDate   || family.collection   ||
                         family.usageRights;

  const handleMouseEnter = () => { if (!isMobile) setPanelOpen(true);  };
  const handleMouseLeave = () => { if (!isMobile) setPanelOpen(false); };
  const handleClick      = () => { if  (isMobile) setPanelOpen(p => !p); };

  return (
    <div
      className={`family-image-container${panelOpen ? ' panel-open' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <img
        src={featuredImageUrl}
        alt={`${family.familyName || 'Family'} — archival photograph`}
        className="family-photo"
        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
      />

      {hasAttribution && (
        <>
          {/* Always-visible "Source" chip — disappears when panel opens */}
          <div className="attr-chip" aria-hidden="true">
            <InfoIcon />
            <span>Source</span>
          </div>

          {/* Slide-up attribution panel */}
          <div className="attr-panel" role="note" aria-label="Image attribution">
            {family.imageSource && (
              <p className="attr-institution">{family.imageSource}</p>
            )}
            <dl className="attr-rows">
              {family.collection && (
                <div className="attr-row">
                  <dt>Collection</dt>
                  <dd>{family.collection}</dd>
                </div>
              )}
              {family.photographer && (
                <div className="attr-row">
                  <dt>Photographer</dt>
                  <dd>{family.photographer}</dd>
                </div>
              )}
              {family.imageDate && (
                <div className="attr-row">
                  <dt>Date</dt>
                  <dd>{family.imageDate}</dd>
                </div>
              )}
              {family.usageRights && (
                <div className="attr-row attr-row--rights">
                  <dt>Rights</dt>
                  <dd>{family.usageRights}</dd>
                </div>
              )}
            </dl>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageAttribution;
