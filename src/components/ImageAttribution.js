import React, { useState, useEffect } from 'react';
import { getStrapiImageUrl } from '../utils/api';

const ImageAttribution = ({ family }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const featuredImageUrl = getStrapiImageUrl(family.featuredPhoto);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!featuredImageUrl) return null;

  const hasAttributionData = family.imageSource || family.photographer || family.imageDate || family.collection || family.usageRights;

  const handleImageClick = () => {
    if (isMobile) {
      setShowOverlay(!showOverlay);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setShowOverlay(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowOverlay(false);
    }
  };

  return (
    <div className="family-image-container">
      <div
        className={`family-image ${showOverlay && isMobile ? 'show-attribution' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleImageClick}
      >
        <img
          src={featuredImageUrl}
          alt={`${family.familyName || 'Family'} featured photo`}
          onError={(e) => {
            console.error('Failed to load image:', featuredImageUrl);
            e.target.style.display = 'none';
          }}
        />

        {hasAttributionData && (
          <div className="attribution-hint">
            <span className="info-icon">ⓘ</span>
          </div>
        )}

        {showOverlay && (
          <div className="attribution-overlay">
            <div className="attribution-content">
              {hasAttributionData ? (
                <>
                  {family.photographer && (
                    <div className="attribution-field">
                      <span className="attribution-label">Photographer:</span>
                      <span className="attribution-value">{family.photographer}</span>
                    </div>
                  )}
                  {family.imageSource && (
                    <div className="attribution-field">
                      <span className="attribution-label">Source:</span>
                      <span className="attribution-value">{family.imageSource}</span>
                    </div>
                  )}
                  {family.imageDate && (
                    <div className="attribution-field">
                      <span className="attribution-label">Date:</span>
                      <span className="attribution-value">{family.imageDate}</span>
                    </div>
                  )}
                  {family.collection && (
                    <div className="attribution-field">
                      <span className="attribution-label">Collection:</span>
                      <span className="attribution-value">{family.collection}</span>
                    </div>
                  )}
                  {family.usageRights && (
                    <div className="attribution-field">
                      <span className="attribution-label">Usage Rights:</span>
                      <span className="attribution-value">{family.usageRights}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="attribution-field">
                  <span className="attribution-value">Attribution pending</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAttribution;