import React, { useMemo } from 'react';

const TimelineSection = React.memo(({
  families,
  selectedYear,
  setSelectedYear,
  timelineFilter,
  setTimelineFilter,
  timelineSearch,
  setTimelineSearch,
  isSearchActive,
  globalSearch,
  handleSearchChange,
  debouncedSearch,
  setActiveSection
}) => {
  // Historical events data - complete version synchronized with App.js
  const historicalEvents = useMemo(() => ({
    1954: [
      {
        id: 'h1',
        date: 'May 17, 1954',
        title: 'Brown v. Board of Education Decision',
        category: 'legal-milestone',
        description: 'Supreme Court declares segregated schools unconstitutional',
        significance: 'Landmark ruling that set the legal foundation for school integration',
        icon: '⚖️'
      }
    ],
    1955: [
      {
        id: 'h2',
        date: 'May 31, 1955',
        title: 'Brown II Implementation Decision',
        category: 'legal-milestone',
        description: 'Supreme Court orders integration "with all deliberate speed"',
        significance: 'Established timeline for implementation but left room for delay',
        icon: '📋'
      }
    ],
    1957: [
      {
        id: 'h9',
        date: 'Spring 1957',
        title: 'Little Rock Nine Students Selected',
        category: 'integration-attempt',
        description: 'Nine African American students chosen from applicants to integrate Central High School',
        significance: 'Families commit to placing their children at the center of a historic struggle',
        icon: '🎓'
      },
      {
        id: 'h10',
        date: 'August 1957',
        title: 'Elizabeth Eckford Family Decision',
        category: 'family-experience',
        description: 'Elizabeth engages in "major battle with her family" over attending Central High School',
        significance: 'Reveals children\'s agency in family decision-making process',
        icon: '👨‍👩‍👧‍👦'
      },
      {
        id: 'h11',
        date: 'August 1957',
        title: 'Thelma Mothershed Family Conference',
        category: 'family-experience',
        description: 'Family holds conference when Thelma wants to attend Central despite cardiac condition',
        significance: 'Multi-generational family decision-making process with health concerns',
        icon: '💬'
      },
      {
        id: 'h3',
        date: 'September 2, 1957',
        title: 'Governor Faubus Calls National Guard',
        category: 'government-resistance',
        description: 'Arkansas Governor prevents integration of Central High School',
        significance: 'State resistance to federal integration orders',
        icon: '🛡️'
      },
      {
        id: 'h4',
        date: 'September 4, 1957',
        title: 'Little Rock Nine Attempt Entry',
        category: 'integration-attempt',
        description: 'Nine children attempt to enter Central High School',
        significance: 'First major test of Brown v. Board implementation',
        icon: '🎒'
      },
      {
        id: 'h12',
        date: 'September 16, 1957',
        title: 'Nine Students "Marking Time"',
        category: 'family-experience',
        description: 'Terrance Roberts helps mother care for six younger siblings during crisis',
        significance: 'Integration crisis reshapes family roles and responsibilities',
        icon: '👶'
      },
      {
        id: 'h13',
        date: 'September 20, 1957',
        title: 'Federal Injunction Removes National Guard',
        category: 'federal-intervention',
        description: 'Federal judge orders removal of Arkansas National Guard',
        significance: 'Federal courts override state resistance but leave families without protection',
        icon: '⚖️'
      },
      {
        id: 'h14',
        date: 'September 23, 1957',
        title: 'Mob Entry Attempt Fails',
        category: 'integration-attempt',
        description: 'Nine students evacuated after mob overwhelms police protection',
        significance: 'Families experience terror as children escape mob violence',
        icon: '🚨'
      },
      {
        id: 'h5',
        date: 'September 24, 1957',
        title: 'Federal Troops Deployed',
        category: 'federal-intervention',
        description: 'President Eisenhower sends 1,000 paratroopers to Little Rock',
        significance: 'Federal government enforces integration by military force',
        icon: '🇺🇸'
      },
      {
        id: 'h6',
        date: 'September 25, 1957',
        title: 'Little Rock Nine Enter School',
        category: 'integration-success',
        description: 'Nine students successfully enter Central High under federal protection',
        significance: 'Historic moment of successful school integration',
        icon: '🏫'
      }
    ],
    1958: [
      {
        id: 'h15',
        date: 'February 1958',
        title: 'Minnie Jean Brown Expelled',
        category: 'integration-attempt',
        description: 'First of the Nine expelled from Central High School',
        significance: 'First family forced to withdraw child despite federal protection',
        icon: '📋'
      },
      {
        id: 'h7',
        date: 'September 1958',
        title: 'Schools Closed by Governor',
        category: 'government-resistance',
        description: 'Faubus closes all Little Rock high schools for the year',
        significance: 'Massive resistance to integration continues',
        icon: '🔒'
      },
      {
        id: 'h16',
        date: '1958-1959',
        title: 'The Lost Year',
        category: 'government-resistance',
        description: 'Families seek alternative education as all high schools remain closed',
        significance: 'Massive educational disruption forces family relocations',
        icon: '🏫'
      }
    ],
    1959: [
      {
        id: 'h8',
        date: 'August 1959',
        title: 'Schools Reopen',
        category: 'integration-success',
        description: 'Federal court orders reopening of Little Rock schools',
        significance: 'Integration resumes after year-long closure',
        icon: '🔓'
      }
    ],
    1960: [
      {
        id: 'h17',
        date: 'February 1960',
        title: 'Carlotta Walls Family Home Bombed',
        category: 'integration-attempt',
        description: 'Walls family home bombed three months before graduation',
        significance: 'Families face extreme violence even as integration nears completion',
        icon: '💥'
      },
      {
        id: 'h18',
        date: 'May 1960',
        title: 'Carlotta Walls Graduates',
        category: 'graduation',
        description: 'First black girl to receive diploma from Central High School',
        significance: 'Historic achievement despite enormous family cost',
        icon: '🎓'
      }
    ]
  }), []);

  // Helper function to truncate family descriptions for timeline
  const truncateDescription = (description, isFamily = false) => {
    if (!isFamily || !description) return description;

    const maxLength = 120;
    if (description.length <= maxLength) return description;

    return description.substring(0, maxLength).trim() + '...';
  };

  // Process timeline data safely
  const getTimelineData = useMemo(() => {
    const timelineYears = {};

    // Add historical events
    Object.keys(historicalEvents).forEach(year => {
      timelineYears[year] = {
        historical: historicalEvents[year] || [],
        families: []
      };
    });

    // Add family events safely
    if (Array.isArray(families)) {
      families.forEach(family => {
        if (family && family.timePeriod) {
          const yearMatch = family.timePeriod.match(/(\d{4})/);
          if (yearMatch) {
            const year = yearMatch[1];
            if (!timelineYears[year]) {
              timelineYears[year] = { historical: [], families: [] };
            }
            timelineYears[year].families.push({
              id: `f${family.id}`,
              family: family.familyName || 'Unknown Family',
              title: `${family.familyName || 'Unknown Family'} Integration Experience`,
              description: truncateDescription(family.description || 'Family experience during integration', true),
              fullDescription: family.description || 'Family experience during integration',
              children: family.childrenNames || '',
              location: family.location || '',
              category: 'family-experience',
              icon: '👨‍👩‍👧‍👦'
            });
          }
        }
      });
    }

    return timelineYears;
  }, [historicalEvents, families]);

  // Filter timeline events safely
  const filterTimelineEvents = (events) => {
    if (!Array.isArray(events)) return [];

    if (timelineFilter === 'all' && !timelineSearch) return events;

    return events.filter(event => {
      if (!event) return false;

      let matchesFilter;
      if (timelineFilter === 'all') {
        matchesFilter = true;
      } else if (timelineFilter === 'integration-events') {
        matchesFilter = event.category === 'integration-attempt' || event.category === 'integration-success';
      } else {
        matchesFilter = event.category === timelineFilter;
      }

      const matchesSearch = !timelineSearch ||
        (event.title && event.title.toLowerCase().includes(timelineSearch.toLowerCase())) ||
        (event.description && event.description.toLowerCase().includes(timelineSearch.toLowerCase())) ||
        (event.family && event.family.toLowerCase().includes(timelineSearch.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  };

  const timelineData = getTimelineData;
  const years = Object.keys(timelineData).sort();

  return (
    <section className="timeline-section">
      <div className="container">
        <div className="timeline-header">
          <h1>Interactive Timeline</h1>
          <p>Journey through the Little Rock School Integration Crisis chronologically</p>

          {/* Timeline Controls */}
          <div className="timeline-controls">
            <div className="timeline-search-container">
              <div className="timeline-search">
                <input
                  type="text"
                  placeholder="Search events, families, or people..."
                  value={isSearchActive ? globalSearch : timelineSearch}
                  onChange={(e) => isSearchActive ? handleSearchChange(e.target.value) : setTimelineSearch(e.target.value)}
                  className="timeline-search-input"
                />
                <span className="timeline-search-icon">🔍</span>
              </div>
              <p className="timeline-instruction">Click on any year below to expand and view detailed events</p>
            </div>


            {/* Timeline Legend */}
            <div className="timeline-legend">
              <h3>Event Categories</h3>
              <div className="legend-items">
                <div className="legend-item">
                  <span className="legend-color legal-milestone"></span>
                  <span>Legal Milestones</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color family-experience"></span>
                  <span>Family Experiences</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color integration-attempt"></span>
                  <span>Integration Events</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color federal-intervention"></span>
                  <span>Federal Actions</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color government-resistance"></span>
                  <span>Government Resistance</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color graduation"></span>
                  <span>Graduation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="timeline-container">
          <div className="timeline-spine">
            {years.map((year, index) => {
              const yearData = timelineData[year];
              if (!yearData) return null;

              const allEvents = [...(yearData.historical || []), ...(yearData.families || [])];
              const searchQuery = isSearchActive ? debouncedSearch : timelineSearch;
              const filteredEvents = filterTimelineEvents(allEvents).filter(event => {
                if (!searchQuery) return true;
                const lowercaseQuery = searchQuery.toLowerCase();
                return (
                  (event.title && event.title.toLowerCase().includes(lowercaseQuery)) ||
                  (event.description && event.description.toLowerCase().includes(lowercaseQuery)) ||
                  (event.family && event.family.toLowerCase().includes(lowercaseQuery)) ||
                  (event.children && event.children.toLowerCase().includes(lowercaseQuery)) ||
                  (event.location && event.location.toLowerCase().includes(lowercaseQuery))
                );
              });

              if (filteredEvents.length === 0 && timelineFilter !== 'all') return null;

              return (
                <div key={year} className="timeline-year" id={`year-${year}`}>
                  {/* Year Node */}
                  <div className="timeline-year-node">
                    <button
                      className={`year-button ${selectedYear === year ? 'active' : ''}`}
                      onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                    >
                      <span className="year-number">{year}</span>
                      <span className="event-count">{filteredEvents.length}</span>
                    </button>

                    {/* Year Line */}
                    {index < years.length - 1 && <div className="timeline-line"></div>}
                  </div>

                  {/* Year Events */}
                  <div className={`timeline-events ${selectedYear === year ? 'expanded' : ''}`}>
                    <div className="timeline-events-container">
                      {filteredEvents.map((event) => (
                        <div key={event.id} className={`timeline-event ${event.category}`}>
                          {event.id === 'h1' && <div className="event-icon">📅</div>}
                          <div className="event-content">
                            <div className="event-header">
                              <h4>{event.title}</h4>
                              <span className="event-date">{event.date || year}</span>
                            </div>
                            <p className="event-description">{event.description}</p>

                            {event.category === 'family-experience' && event.fullDescription && event.fullDescription !== event.description && (
                              <p className="read-more-link">
                                <button
                                  className="btn-timeline-inline"
                                  onClick={() => setActiveSection('families')}
                                >
                                  Read more in Family Stories section →
                                </button>
                              </p>
                            )}

                            {event.children && (
                              <p className="event-children">
                                <strong>Children involved:</strong> {event.children}
                              </p>
                            )}

                            {event.location && (
                              <p className="event-location">
                                <strong>Location:</strong> {event.location}
                              </p>
                            )}

                            {event.significance && (
                              <div className="event-significance">
                                <h5>Historical Significance:</h5>
                                <p>{event.significance}</p>
                              </div>
                            )}

                            <div className="event-actions">
                              {event.family && (
                                <button
                                  className="btn-timeline"
                                  onClick={() => setActiveSection('families')}
                                >
                                  View {event.family} Story
                                </button>
                              )}
                              <button className="btn-timeline-secondary">Learn More</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Statistics */}
        <div className="timeline-stats">
          <div className="stat-card">
            <h3>{years.length}</h3>
            <p>Years Documented</p>
          </div>
          <div className="stat-card">
            <h3>{Object.values(timelineData).reduce((acc, year) => acc + (year.historical?.length || 0), 0)}</h3>
            <p>Historical Events</p>
          </div>
          <div className="stat-card">
            <h3>{families.length}</h3>
            <p>Family Stories</p>
          </div>
        </div>
      </div>
    </section>
  );
});

TimelineSection.displayName = 'TimelineSection';

export default TimelineSection;