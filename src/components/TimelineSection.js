import React, { useMemo } from 'react';

const CATEGORY_META = {
  'legal-milestone':      { label: 'Legal Milestone',       color: '#2563eb' },
  'family-experience':    { label: 'Family Experience',      color: '#dc2626' },
  'integration-attempt':  { label: 'Integration Event',      color: '#ea580c' },
  'federal-intervention': { label: 'Federal Action',         color: '#1d4ed8' },
  'government-resistance':{ label: 'Government Resistance',  color: '#7c2d12' },
  'integration-success':  { label: 'Integration Success',    color: '#16a34a' },
  'graduation':           { label: 'Graduation',             color: '#b45309' },
};

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

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
  const historicalEvents = useMemo(() => ({
    1954: [
      {
        id: 'h1',
        date: 'May 17, 1954',
        title: 'Brown v. Board of Education Decision',
        category: 'legal-milestone',
        description: 'Supreme Court declares segregated schools unconstitutional.',
        significance: 'Landmark ruling that set the legal foundation for school integration across the United States.',
      }
    ],
    1955: [
      {
        id: 'h2',
        date: 'May 31, 1955',
        title: 'Brown II Implementation Decision',
        category: 'legal-milestone',
        description: 'Supreme Court orders integration "with all deliberate speed."',
        significance: 'Established a timeline for implementation but left room for systematic delay by resistant states.',
      }
    ],
    1957: [
      {
        id: 'h9',
        date: 'Spring 1957',
        title: 'Little Rock Nine Students Selected',
        category: 'integration-attempt',
        description: 'Nine African American students are chosen from applicants to integrate Central High School.',
        significance: 'Families commit to placing their children at the center of a historic — and dangerous — struggle.',
      },
      {
        id: 'h10',
        date: 'August 1957',
        title: 'Elizabeth Eckford Family Decision',
        category: 'family-experience',
        description: 'Elizabeth engages in a "major battle with her family" over attending Central High School.',
        significance: "Reveals children's agency in family decision-making — the crisis was not only about adults.",
      },
      {
        id: 'h11',
        date: 'August 1957',
        title: 'Thelma Mothershed Family Conference',
        category: 'family-experience',
        description: 'Family holds a conference when Thelma wants to attend Central despite a cardiac condition.',
        significance: 'Illustrates multi-generational family decision-making when health, safety, and principle collide.',
      },
      {
        id: 'h3',
        date: 'September 2, 1957',
        title: 'Governor Faubus Calls National Guard',
        category: 'government-resistance',
        description: 'Arkansas Governor deploys National Guard to prevent integration of Central High School.',
        significance: 'State-level defiance of federal court orders puts nine families on the front line.',
      },
      {
        id: 'h4',
        date: 'September 4, 1957',
        title: 'Little Rock Nine Attempt Entry',
        category: 'integration-attempt',
        description: 'Nine students attempt to enter Central High School; Elizabeth Eckford walks alone into a hostile mob.',
        significance: 'First major test of Brown v. Board implementation. The iconic photograph of Elizabeth becomes a symbol of the era.',
      },
      {
        id: 'h12',
        date: 'September 16, 1957',
        title: 'Families Absorb the Crisis',
        category: 'family-experience',
        description: "Terrence Roberts helps his mother care for six younger siblings while the crisis reshapes family routines.",
        significance: 'Integration crisis reorders family roles — older children become caregivers, siblings bear invisible burdens.',
      },
      {
        id: 'h13',
        date: 'September 20, 1957',
        title: 'Federal Injunction Removes National Guard',
        category: 'federal-intervention',
        description: 'Federal judge orders the Arkansas National Guard to stand down.',
        significance: 'Federal courts override state resistance — but the ruling leaves families exposed without military protection.',
      },
      {
        id: 'h14',
        date: 'September 23, 1957',
        title: 'Mob Violence Forces Evacuation',
        category: 'integration-attempt',
        description: 'Nine students are evacuated after a mob overwhelms police protection.',
        significance: 'Families experience acute terror as their children escape coordinated mob violence.',
      },
      {
        id: 'h5',
        date: 'September 24, 1957',
        title: 'Federal Troops Deployed',
        category: 'federal-intervention',
        description: 'President Eisenhower sends 1,000 paratroopers to Little Rock.',
        significance: 'Federal government enforces integration by military force — the only intervention powerful enough to override the state.',
      },
      {
        id: 'h6',
        date: 'September 25, 1957',
        title: 'Little Rock Nine Enter School',
        category: 'integration-success',
        description: 'Nine students successfully enter Central High under federal escort.',
        significance: 'Historic moment of successful school integration — but daily harassment inside the school will continue for three years.',
      }
    ],
    1958: [
      {
        id: 'h15',
        date: 'February 1958',
        title: 'Minnijean Brown Expelled',
        category: 'integration-attempt',
        description: 'Minnijean Brown is expelled after retaliating against sustained harassment.',
        significance: 'The first of the Nine forced out — her younger sister Phyllis watches the family absorb the consequences at home.',
      },
      {
        id: 'h7',
        date: 'September 1958',
        title: 'Schools Closed — The Lost Year Begins',
        category: 'government-resistance',
        description: 'Governor Faubus closes all Little Rock high schools for the academic year.',
        significance: "Massive resistance escalates to total shutdown. Families scramble to educate children across state lines and abroad.",
      },
      {
        id: 'h16',
        date: '1958–1959',
        title: 'Families Seek Alternative Education',
        category: 'family-experience',
        description: "Families arrange schooling in other states and countries as Little Rock's schools remain shuttered.",
        significance: 'The Lost Year forces family separations, relocations, and financial strain — costs borne invisibly by siblings and parents.',
      }
    ],
    1959: [
      {
        id: 'h8',
        date: 'August 1959',
        title: 'Schools Reopen — Second Wave Begins',
        category: 'integration-success',
        description: 'Federal court orders the reopening of Little Rock schools; a second cohort of students integrates.',
        significance: "Integration resumes after a year's closure — new families, including the Hampton-Jordan and Henderson families, carry the effort forward.",
      }
    ],
    1960: [
      {
        id: 'h17',
        date: 'February 1960',
        title: 'Carlotta Walls Family Home Bombed',
        category: 'government-resistance',
        description: "The Walls family home is bombed three months before Carlotta's scheduled graduation.",
        significance: 'Violence continues even as integration nears completion — five siblings and two parents live under constant threat.',
      },
      {
        id: 'h18',
        date: 'May 1960',
        title: 'Carlotta Walls Graduates',
        category: 'graduation',
        description: 'Carlotta Walls becomes the first Black girl to receive a diploma from Central High School.',
        significance: 'A historic achievement earned at enormous family cost across three years of sustained resistance.',
      }
    ]
  }), []);

  const getTimelineData = useMemo(() => {
    const timelineYears = {};

    Object.keys(historicalEvents).forEach(year => {
      timelineYears[year] = { historical: historicalEvents[year] || [], families: [] };
    });

    if (Array.isArray(families)) {
      families.forEach(family => {
        if (family?.timePeriod) {
          const yearMatch = family.timePeriod.match(/(\d{4})/);
          if (yearMatch) {
            const year = yearMatch[1];
            if (!timelineYears[year]) timelineYears[year] = { historical: [], families: [] };
            timelineYears[year].families.push({
              id: `f${family.id}`,
              family: family.familyName || 'Unknown Family',
              title: `${family.familyName || 'Unknown Family'} — Integration Experience`,
              description: family.description
                ? (family.description.length > 200
                    ? family.description.substring(0, 200).trim() + '…'
                    : family.description)
                : 'Family experience during integration.',
              fullDescription: family.description || '',
              children: family.childrenNames || '',
              location: family.location || '',
              category: 'family-experience',
            });
          }
        }
      });
    }

    return timelineYears;
  }, [historicalEvents, families]);

  const filterTimelineEvents = (events) => {
    if (!Array.isArray(events)) return [];
    if (timelineFilter === 'all' && !timelineSearch) return events;
    return events.filter(event => {
      if (!event) return false;
      const matchesFilter = timelineFilter === 'all'
        ? true
        : timelineFilter === 'integration-events'
        ? event.category === 'integration-attempt' || event.category === 'integration-success'
        : event.category === timelineFilter;
      const matchesSearch = !timelineSearch ||
        event.title?.toLowerCase().includes(timelineSearch.toLowerCase()) ||
        event.description?.toLowerCase().includes(timelineSearch.toLowerCase()) ||
        event.family?.toLowerCase().includes(timelineSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  };

  const timelineData = getTimelineData;
  const years = Object.keys(timelineData).sort();

  return (
    <section className="timeline-section">
      <div className="container">

        {/* Header */}
        <div className="timeline-header">
          <h1>Interactive Timeline</h1>
          <p>Journey through the Little Rock School Integration Crisis chronologically</p>

          {/* Search */}
          <div className="timeline-search-wrap">
            <div className="timeline-search">
              <span className="timeline-search-icon"><SearchIcon /></span>
              <input
                type="text"
                placeholder="Search events, families, or people…"
                value={isSearchActive ? globalSearch : timelineSearch}
                onChange={(e) => isSearchActive
                  ? handleSearchChange(e.target.value)
                  : setTimelineSearch(e.target.value)}
                className="timeline-search-input"
                aria-label="Search timeline events"
              />
            </div>
            <p className="timeline-instruction">Select a year to expand its events</p>
          </div>

          {/* Legend */}
          <div className="timeline-legend">
            <span className="legend-heading">Categories:</span>
            <div className="legend-items">
              {Object.entries(CATEGORY_META).map(([key, { label, color }]) => (
                <div key={key} className="legend-item">
                  <span className="legend-dot" style={{ background: color }}></span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-container">
          <div className="timeline-spine">
            {years.map((year, index) => {
              const yearData = timelineData[year];
              if (!yearData) return null;

              const allEvents = [...(yearData.historical || []), ...(yearData.families || [])];
              const searchQuery = isSearchActive ? debouncedSearch : timelineSearch;
              const filteredEvents = filterTimelineEvents(allEvents).filter(event => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                return event.title?.toLowerCase().includes(q)
                    || event.description?.toLowerCase().includes(q)
                    || event.family?.toLowerCase().includes(q)
                    || event.children?.toLowerCase().includes(q);
              });

              if (filteredEvents.length === 0 && timelineFilter !== 'all') return null;

              return (
                <div key={year} className="timeline-year" id={`year-${year}`}>
                  <div className="timeline-year-node">
                    <button
                      className={`year-button${selectedYear === year ? ' active' : ''}`}
                      onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                      aria-expanded={selectedYear === year}
                      aria-controls={`events-${year}`}
                    >
                      <span className="year-number">{year}</span>
                      <span className="event-count">{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}</span>
                    </button>
                    {index < years.length - 1 && <div className="timeline-line"></div>}
                  </div>

                  <div
                    id={`events-${year}`}
                    className={`timeline-events${selectedYear === year ? ' expanded' : ''}`}
                  >
                    <div className="timeline-events-container">
                      {filteredEvents.map((event) => {
                        const meta = CATEGORY_META[event.category] || { label: event.category, color: '#64748b' };
                        return (
                          <div
                            key={event.id}
                            className={`timeline-event ${event.category}`}
                            style={{ '--cat-color': meta.color }}
                          >
                            <div className="event-header">
                              <div className="event-header-top">
                                <span
                                  className="event-category-tag"
                                  style={{ background: meta.color + '18', color: meta.color, borderColor: meta.color + '40' }}
                                >
                                  {meta.label}
                                </span>
                                <span className="event-date">{event.date || year}</span>
                              </div>
                              <h4>{event.title}</h4>
                            </div>

                            <p className="event-description">{event.description}</p>

                            {event.significance && (
                              <div className="event-significance">
                                <span className="significance-label">Historical significance</span>
                                <p>{event.significance}</p>
                              </div>
                            )}

                            {event.children && (
                              <p className="event-meta-line">
                                <strong>Children involved:</strong> {event.children}
                              </p>
                            )}

                            {event.family && (
                              <div className="event-actions">
                                <button
                                  className="btn-timeline"
                                  onClick={() => setActiveSection('families')}
                                >
                                  View {event.family} Story →
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="timeline-stats">
          <div className="stat-card">
            <h3>{years.length}</h3>
            <p>Years Documented</p>
          </div>
          <div className="stat-card">
            <h3>{Object.values(timelineData).reduce((acc, y) => acc + (y.historical?.length || 0), 0)}</h3>
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
