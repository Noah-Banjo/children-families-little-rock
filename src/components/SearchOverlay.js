import React from 'react';

const SearchOverlay = React.memo(({
  showSearchOverlay,
  setShowSearchOverlay,
  debouncedSearch,
  searchResults,
  handleSearchResultClick
}) => {
  if (!showSearchOverlay) return null;

  return (
    <div className="search-overlay" onClick={() => setShowSearchOverlay(false)}>
      <div className="search-results" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <h3>Search Results for "{debouncedSearch}"</h3>
          <button className="close-search" onClick={() => setShowSearchOverlay(false)}>×</button>
        </div>

        {debouncedSearch && (
          <div className="search-content">
            {/* Families Results */}
            {searchResults.families.length > 0 && (
              <div className="search-section">
                <h4>👨‍👩‍👧‍👦 Families ({searchResults.families.length})</h4>
                <div className="search-items">
                  {searchResults.families.slice(0, 3).map(family => (
                    <div
                      key={family.id}
                      className="search-item"
                      onClick={() => handleSearchResultClick('family', family)}
                    >
                      <h5>{family.familyName}</h5>
                      <p>{family.description?.substring(0, 100)}...</p>
                      <span className="search-meta">{family.location} • {family.timePeriod}</span>
                    </div>
                  ))}
                  {searchResults.families.length > 3 && (
                    <button className="view-all-btn" onClick={() => handleSearchResultClick('family', null)}>
                      View all {searchResults.families.length} families
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Stories Results */}
            {searchResults.stories.length > 0 && (
              <div className="search-section">
                <h4>📖 Stories ({searchResults.stories.length})</h4>
                <div className="search-items">
                  {searchResults.stories.slice(0, 3).map(story => (
                    <div
                      key={story.id}
                      className="search-item"
                      onClick={() => handleSearchResultClick('story', story)}
                    >
                      <h5>{story.title}</h5>
                      <p>{story.content?.substring(0, 100)}...</p>
                      <span className="search-meta">{story.storyType} • {story.timePeriod}</span>
                    </div>
                  ))}
                  {searchResults.stories.length > 3 && (
                    <button className="view-all-btn" onClick={() => handleSearchResultClick('story', null)}>
                      View all {searchResults.stories.length} stories
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Timeline Results */}
            {searchResults.timeline.length > 0 && (
              <div className="search-section">
                <h4>⏰ Timeline Events ({searchResults.timeline.length})</h4>
                <div className="search-items">
                  {searchResults.timeline.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className="search-item"
                      onClick={() => handleSearchResultClick('timeline', event)}
                    >
                      <h5>{event.title}</h5>
                      <p>{event.description?.substring(0, 100)}...</p>
                      <span className="search-meta">{event.year} • {event.category}</span>
                    </div>
                  ))}
                  {searchResults.timeline.length > 3 && (
                    <button className="view-all-btn" onClick={() => handleSearchResultClick('timeline', null)}>
                      View all {searchResults.timeline.length} events
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults.families.length === 0 &&
             searchResults.stories.length === 0 &&
             searchResults.timeline.length === 0 &&
             debouncedSearch.trim() && (
              <div className="no-search-results">
                <h4>No results found</h4>
                <p>Try searching for family names, children's names, locations, or historical events.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

SearchOverlay.displayName = 'SearchOverlay';

export default SearchOverlay;