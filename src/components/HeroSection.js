import React from 'react';
import heroBackgroundImage from '../assets/images/hero-background.jpg';

const HeroSection = React.memo(({
  setActiveSection,
  globalSearch,
  handleSearchChange,
  setShowSearchOverlay
}) => {
  return (
    <section className="hero">
      {/* Background Image Container */}
      <div className="hero-background">
        <div className="hero-image-container">
          {/* Historical photo of Little Rock School Integration */}
          <img
            src={heroBackgroundImage}
            alt="Little Rock School Integration - Historical photograph showing integration events"
            className="hero-background-image"
          />
          {/* Dark overlay for text readability */}
          <div className="hero-overlay"></div>
        </div>
      </div>

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          Preserving the <span className="highlight">Untold Stories</span>
        </h1>
        <p className="hero-description">
          Discover the hidden histories of children and families impacted by Little Rock School Integration through personal stories, photographs, documents, and interactive experiences.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => setActiveSection('families')}>
            Explore Stories
          </button>
          <button
            className="btn-secondary"
            onClick={() => window.open('https://www.youtube.com/watch?v=PLACEHOLDER_VIDEO_ID', '_blank')}
          >
            Watch Introduction
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search stories, families, or historical events..."
            className="search-input"
            value={globalSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowSearchOverlay(globalSearch.length > 0)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;