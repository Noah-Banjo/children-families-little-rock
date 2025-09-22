import React, { useState, useEffect } from 'react';
import './App.css';

const HistoricalArchive = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: "Hello! I'm Dr. Archives, your personal historian and guide to the untold stories of Little Rock School Integration Crisis. I'm here to help you explore these precious histories, find connections between stories, and discover multimedia content. What would you like to learn about today?",
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [expandedSection, setExpandedSection] = useState(null);
  
  // New state for CMS data
  const [families, setFamilies] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Timeline specific state
  const [selectedYear, setSelectedYear] = useState(null);
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [timelineSearch, setTimelineSearch] = useState('');

  // Historical events data
  const historicalEvents = {
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
        description: 'Nine Black students attempt to enter Central High School',
        significance: 'First major test of Brown v. Board implementation',
        icon: '🎒'
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
        id: 'h7',
        date: 'September 1958',
        title: 'Schools Closed by Governor',
        category: 'government-resistance',
        description: 'Faubus closes all Little Rock high schools for the year',
        significance: 'Massive resistance to integration continues',
        icon: '🔒'
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
    ]
  };

  // Fetch data from CMS
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch families
        const familiesResponse = await fetch('https://children-families-cms.onrender.com/api/families');
        const familiesData = await familiesResponse.json();
        
        // Fetch stories
        const storiesResponse = await fetch('https://children-families-cms.onrender.com/api/stories?populate=*');
        const storiesData = await storiesResponse.json();
        
        console.log('Fetched families:', familiesData);
        console.log('Fetched stories:', storiesData);
        
        // Extract the actual data array
        setFamilies(familiesData.data || []);
        setStories(storiesData.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content from archive');
        setFamilies([]);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process timeline data
  const getTimelineData = () => {
    const timelineYears = {};
    
    // Add historical events
    Object.keys(historicalEvents).forEach(year => {
      timelineYears[year] = {
        historical: historicalEvents[year],
        families: []
      };
    });
    
    // Add family events
    families.forEach(family => {
      if (family.timePeriod) {
        // Extract years from time period (e.g., "1957-1960" or "1957")
        const yearMatch = family.timePeriod.match(/(\d{4})/);
        if (yearMatch) {
          const year = yearMatch[1];
          if (!timelineYears[year]) {
            timelineYears[year] = { historical: [], families: [] };
          }
          timelineYears[year].families.push({
            id: `f${family.id}`,
            family: family.familyName,
            title: `${family.familyName} Integration Experience`,
            description: `${family.familyName} experience during integration`,
            children: family.childrenNames,
            location: family.location,
            category: 'family-experience',
            icon: '👨‍👩‍👧‍👦'
          });
        }
      }
    });
    
    return timelineYears;
  };

  // Filter timeline events
  const filterTimelineEvents = (events) => {
    if (timelineFilter === 'all' && !timelineSearch) return events;
    
    return events.filter(event => {
      const matchesFilter = timelineFilter === 'all' || event.category === timelineFilter;
      const matchesSearch = !timelineSearch || 
        event.title.toLowerCase().includes(timelineSearch.toLowerCase()) ||
        event.description.toLowerCase().includes(timelineSearch.toLowerCase()) ||
        (event.family && event.family.toLowerCase().includes(timelineSearch.toLowerCase()));
      
      return matchesFilter && matchesSearch;
    });
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: currentMessage,
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
    setTimeout(() => {
      const responses = [
        "That's a fascinating question about the Little Rock Nine. Let me share some context and point you to our Family Stories section that directly relates to your question.",
        "I found several resources about that topic! Check out our archived family stories and documents.",
        "What an important question about hidden histories. I recommend exploring the family stories in our Archives section."
      ];
      
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        message: responses[Math.floor(Math.random() * responses.length)],
      }]);
    }, 1000);
  };

  const timelineData = getTimelineData();
  const years = Object.keys(timelineData).sort();

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={() => setActiveSection('home')}>
            <div className="logo-icon">📚</div>
            <div>
              <h1>Hidden Histories</h1>
              <p>Little Rock School Integration Archive</p>
            </div>
          </div>
          
          <nav className="nav">
            <a href="#" onClick={() => setActiveSection('stories')} 
               className={activeSection === 'stories' ? 'active' : ''}>Stories</a>
            <a href="#" onClick={() => setActiveSection('timeline')} 
               className={activeSection === 'timeline' ? 'active' : ''}>Timeline</a>
            <a href="#" onClick={() => setActiveSection('families')} 
               className={activeSection === 'families' ? 'active' : ''}>Families</a>
            <a href="#" onClick={() => setActiveSection('multimedia')} 
               className={activeSection === 'multimedia' ? 'active' : ''}>Multimedia</a>
            <a href="#" onClick={() => setActiveSection('scholarship')} 
               className={activeSection === 'scholarship' ? 'active' : ''}>Scholarship</a>
            <a href="#" onClick={() => setActiveSection('about')} 
               className={activeSection === 'about' ? 'active' : ''}>About</a>
          </nav>

          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <a href="#" onClick={() => {setActiveSection('stories'); setIsMenuOpen(false);}}>Stories</a>
          <a href="#" onClick={() => {setActiveSection('timeline'); setIsMenuOpen(false);}}>Timeline</a>
          <a href="#" onClick={() => {setActiveSection('families'); setIsMenuOpen(false);}}>Families</a>
          <a href="#" onClick={() => {setActiveSection('multimedia'); setIsMenuOpen(false);}}>Multimedia</a>
          <a href="#" onClick={() => {setActiveSection('scholarship'); setIsMenuOpen(false);}}>Scholarship</a>
          <a href="#" onClick={() => {setActiveSection('about'); setIsMenuOpen(false);}}>About</a>
        </div>
      )}

      {/* Main Content */}
      {activeSection === 'home' && (
        <div>
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <h1 className="hero-title">
                Preserving the <span className="highlight">Untold Stories</span>
              </h1>
              <p className="hero-description">
                Discover the hidden histories of children and families impacted by Little Rock School Integration through personal stories, photographs, documents, and interactive experiences.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => setActiveSection('families')}>Explore Stories</button>
                <button className="btn-secondary">Watch Introduction</button>
              </div>
              <div className="search-container">
                <input type="text" placeholder="Search stories, families, or historical events..." className="search-input" />
                <span className="search-icon">🔍</span>
              </div>
            </div>
          </section>

          {/* Feature Cards */}
          <section className="features">
            <div className="features-grid">
              <div className="feature-card card-pink">
                <div className="feature-icon">👨‍👩‍👧‍👦</div>
                <h3>Family Stories</h3>
                <p>Personal accounts and oral histories from families who lived through integration.</p>
                <a href="#" onClick={() => setActiveSection('families')}>Explore Families →</a>
              </div>
              <div className="feature-card card-blue">
                <div className="feature-icon">⏰</div>
                <h3>Interactive Timeline</h3>
                <p>Journey through key moments and personal experiences chronologically.</p>
                <a href="#" onClick={() => setActiveSection('timeline')}>View Timeline →</a>
              </div>
              <div className="feature-card card-green">
                <div className="feature-icon">🎭</div>
                <h3>Multimedia Archive</h3>
                <p>Photos, videos, audio recordings, and documents from the era.</p>
                <a href="#" onClick={() => setActiveSection('multimedia')}>Browse Media →</a>
              </div>
            </div>
          </section>

          {/* Featured Families Section */}
          {!loading && families.length > 0 && (
            <section className="featured-families">
              <div className="container">
                <h2>Featured Family Stories</h2>
                <p>Real stories from families who experienced the Little Rock School Integration Crisis</p>
                <div className="families-preview">
                  {families.slice(0, 3).map((family) => {
                    console.log('Rendering family:', family);
                    return (
                      <div key={family.id} className="family-preview-card">
                        <h3>{family.familyName || 'Unknown Family'}</h3>
                        <p className="time-period">{family.timePeriod || 'Unknown Period'}</p>
                        <p className="description">
                          {family.description 
                            ? `${family.description.substring(0, 150)}...`
                            : 'No description available.'
                          }
                        </p>
                        <p className="location">📍 {family.location || 'Unknown Location'}</p>
                        {family.childrenNames && (
                          <p className="children">Children: {family.childrenNames}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button className="btn-primary" onClick={() => setActiveSection('families')}>
                  View All Families
                </button>
              </div>
            </section>
          )}
        </div>
      )}

      {/* Families Section */}
      {activeSection === 'families' && (
        <section className="families-section">
          <div className="container">
            <h1>Family Stories</h1>
            <p>Personal accounts from families who lived through the Little Rock School Integration Crisis</p>
            
            {loading && (
              <div className="loading">
                <p>Loading family stories from the archive...</p>
              </div>
            )}
            
            {error && (
              <div className="error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
              </div>
            )}
            
            {!loading && !error && families.length === 0 && (
              <div className="no-content">
                <p>No family stories available yet. Stories are being added to the archive.</p>
              </div>
            )}
            
            {!loading && families.length > 0 && (
              <div className="families-grid">
                {families.map((family) => {
                  console.log('Rendering family in grid:', family);
                  return (
                    <div key={family.id} className="family-card">
                      <div className="family-header">
                        <h2>{family.familyName || 'Unknown Family'}</h2>
                        <span className="time-badge">{family.timePeriod || 'Unknown Period'}</span>
                      </div>
                      
                      <div className="family-content">
                        <p className="family-description">
                          {family.description || 'No description available.'}
                        </p>
                        
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
                        <button className="btn-primary">View Full Story</button>
                        <button className="btn-secondary">Related Documents</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stories Section */}
      {activeSection === 'stories' && (
        <section className="stories-section">
          <div className="container">
            <h1>Individual Stories</h1>
            <p>Detailed accounts and documents from the integration experience</p>
            
            {loading && (
              <div className="loading">
                <p>Loading stories from the archive...</p>
              </div>
            )}
            
            {!loading && stories.length === 0 && (
              <div className="no-content">
                <p>Individual stories are being added to the archive. Check back soon.</p>
              </div>
            )}
            
            {!loading && stories.length > 0 && (
              <div className="stories-grid">
                {stories.map((story) => {
                  return (
                    <div key={story.id} className="story-card">
                      <div className="story-header">
                        <h3>{story.title || 'Untitled Story'}</h3>
                        {story.storyType && (
                          <span className="story-type-badge">{story.storyType}</span>
                        )}
                      </div>
                      
                      <div className="story-content">
                        <p>
                          {story.content 
                            ? `${story.content.substring(0, 200)}...`
                            : 'No content available.'
                          }
                        </p>
                        
                        {story.timePeriod && (
                          <p className="story-time">Time Period: {story.timePeriod}</p>
                        )}
                      </div>
                      
                      <div className="story-actions">
                        <button className="btn-primary">Read Full Story</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Interactive Timeline Section */}
      {activeSection === 'timeline' && (
        <section className="timeline-section">
          <div className="container">
            <div className="timeline-header">
              <h1>Interactive Timeline</h1>
              <p>Journey through the Little Rock School Integration Crisis chronologically</p>
              
              {/* Timeline Controls */}
              <div className="timeline-controls">
                <div className="timeline-search">
                  <input
                    type="text"
                    placeholder="Search events, families, or people..."
                    value={timelineSearch}
                    onChange={(e) => setTimelineSearch(e.target.value)}
                    className="timeline-search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
                
                <div className="timeline-filters">
                  <button 
                    className={timelineFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setTimelineFilter('all')}
                  >
                    All Events
                  </button>
                  <button 
                    className={timelineFilter === 'legal-milestone' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setTimelineFilter('legal-milestone')}
                  >
                    Legal Milestones
                  </button>
                  <button 
                    className={timelineFilter === 'family-experience' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setTimelineFilter('family-experience')}
                  >
                    Family Stories
                  </button>
                  <button 
                    className={timelineFilter === 'integration-attempt' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setTimelineFilter('integration-attempt')}
                  >
                    Integration Events
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline Visualization */}
            <div className="timeline-container">
              <div className="timeline-spine">
                {years.map((year, index) => {
                  const yearData = timelineData[year];
                  const allEvents = [...yearData.historical, ...yearData.families];
                  const filteredEvents = filterTimelineEvents(allEvents);
                  
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
                        {filteredEvents.map((event) => (
                          <div key={event.id} className={`timeline-event ${event.category}`}>
                            <div className="event-icon">{event.icon}</div>
                            <div className="event-content">
                              <div className="event-header">
                                <h4>{event.title}</h4>
                                <span className="event-date">{event.date || year}</span>
                              </div>
                              <p className="event-description">{event.description}</p>
                              
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
                  );
                })}
              </div>
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
              </div>
            </div>

            {/* Timeline Statistics */}
            <div className="timeline-stats">
              <div className="stat-card">
                <h3>{years.length}</h3>
                <p>Years Documented</p>
              </div>
              <div className="stat-card">
                <h3>{Object.values(timelineData).reduce((acc, year) => acc + year.historical.length, 0)}</h3>
                <p>Historical Events</p>
              </div>
              <div className="stat-card">
                <h3>{families.length}</h3>
                <p>Family Stories</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Multimedia Section */}
      {activeSection === 'multimedia' && (
        <section className="multimedia-section">
          <div className="container">
            <h1>Multimedia Archive</h1>
            <p>Photos, videos, audio recordings, and documents from the era</p>
            
            <div className="multimedia-placeholder">
              <p>Multimedia content from family stories will be displayed here.</p>
              <p>Content is being processed and will be available soon.</p>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <section className="about-section">
          <div className="container">
            <h1>About This Archive</h1>
            <p>This digital archive preserves the untold stories of children and families impacted by the Little Rock School Integration Crisis through innovative use of AI and machine learning technologies.</p>
            
            <div className="about-stats">
              <div className="stat-card">
                <h3>{families.length}</h3>
                <p>Families Documented</p>
              </div>
              <div className="stat-card">
                <h3>{stories.length}</h3>
                <p>Individual Stories</p>
              </div>
              <div className="stat-card">
                <h3>Live</h3>
                <p>Archive Status</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Scholarship Section */}
      {activeSection === 'scholarship' && (
        <section className="scholarship">
          <div className="scholarship-content">
            {/* Hero Section for Scholarship */}
            <div className="scholarship-hero">
              <div className="scholarship-icon">🎓</div>
              <h1>The Academic Foundation</h1>
              <p>Leveraging Emerging Technologies (AI and Machine Learning) for Archiving Hidden Histories of Children and Families Impacted by the Little Rock School Integration</p>
              <div className="scholarship-buttons">
                <button className="btn-primary">📥 Download Full Thesis</button>
                <button className="btn-secondary">Cite This Work</button>
              </div>
            </div>

            {/* Research Progress */}
            <div className="progress-container">
              <div className="progress-header">
                <h3>Research Progress</h3>
                <span className="progress-percentage">75% Complete</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '75%'}}></div>
              </div>
              <p className="progress-text">{families.length} families documented • Literature review complete • Analysis in progress</p>
            </div>

            {/* Academic Sections */}
            <div className="academic-sections">
              
              {/* Introduction */}
              <div className="academic-card">
                <button 
                  onClick={() => setExpandedSection(expandedSection === 'introduction' ? null : 'introduction')}
                  className="academic-header"
                >
                  <div className="academic-info">
                    <div className="academic-icon blue">📖</div>
                    <div>
                      <h3>Research Introduction</h3>
                      <p>The foundation and purpose of preserving hidden histories</p>
                    </div>
                  </div>
                  <span className="expand-icon">{expandedSection === 'introduction' ? '▲' : '▼'}</span>
                </button>
                
                {expandedSection === 'introduction' && (
                  <div className="academic-content">
                    <p>This research addresses a critical gap in historical documentation: the untold stories of children and families who experienced the Little Rock School Integration Crisis. While major events and figures are well-documented, the intimate, personal experiences of ordinary families often remain hidden in attics, memories, and family stories.</p>
                    
                    <p>By leveraging artificial intelligence and machine learning technologies, this project creates an innovative digital archive that not only preserves these stories but makes them accessible, searchable, and interactive for future generations.</p>
                    
                    <div className="research-question">
                      <h4>Research Question</h4>
                      <p>How can emerging technologies enhance the preservation and accessibility of hidden family histories from the Little Rock School Integration Crisis?</p>
                    </div>
                    
                    <div className="academic-actions">
                      <button className="action-btn blue">Download Section PDF</button>
                      <button className="link-btn" onClick={() => setActiveSection('families')}>View Related Stories →</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Literature Review */}
              <div className="academic-card">
                <button 
                  onClick={() => setExpandedSection(expandedSection === 'literature' ? null : 'literature')}
                  className="academic-header"
                >
                  <div className="academic-info">
                    <div className="academic-icon green">📚</div>
                    <div>
                      <h3>Literature Review</h3>
                      <p>Academic context and scholarly foundations</p>
                    </div>
                  </div>
                  <span className="expand-icon">{expandedSection === 'literature' ? '▲' : '▼'}</span>
                </button>
                
                {expandedSection === 'literature' && (
                  <div className="academic-content">
                    <p>The literature reveals significant gaps in documenting personal experiences during major historical events. While institutional records are preserved, individual family stories often disappear within a generation.</p>
                    
                    <div className="literature-grid">
                      <div className="lit-category">
                        <h4>Digital Archive Theory</h4>
                        <p>Studies on digital preservation and community memory projects</p>
                        <span>15 key sources</span>
                      </div>
                      <div className="lit-category">
                        <h4>AI in Historical Research</h4>
                        <p>Applications of machine learning in cultural heritage</p>
                        <span>12 key sources</span>
                      </div>
                      <div className="lit-category">
                        <h4>Civil Rights Documentation</h4>
                        <p>Existing archives and missing perspectives</p>
                        <span>23 key sources</span>
                      </div>
                      <div className="lit-category">
                        <h4>Oral History Methods</h4>
                        <p>Best practices for collecting family stories</p>
                        <span>18 key sources</span>
                      </div>
                    </div>
                    
                    <div className="academic-actions">
                      <button className="action-btn green">View Bibliography</button>
                      <button className="link-btn">Interactive Citations →</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Methodology */}
              <div className="academic-card">
                <button 
                  onClick={() => setExpandedSection(expandedSection === 'methodology' ? null : 'methodology')}
                  className="academic-header"
                >
                  <div className="academic-info">
                    <div className="academic-icon purple">💡</div>
                    <div>
                      <h3>Methodology</h3>
                      <p>Research approach and data collection methods</p>
                    </div>
                  </div>
                  <span className="expand-icon">{expandedSection === 'methodology' ? '▲' : '▼'}</span>
                </button>
                
                {expandedSection === 'methodology' && (
                  <div className="academic-content">
                    <p>This mixed-methods research combines qualitative oral history techniques with quantitative digital analysis to create a comprehensive archive of family experiences.</p>
                    
                    <div className="methodology-phases">
                      <div className="phase">
                        <h4>Phase 1: Family Identification</h4>
                        <p>Community outreach and snowball sampling to locate families willing to share their stories</p>
                      </div>
                      <div className="phase">
                        <h4>Phase 2: Story Collection</h4>
                        <p>Semi-structured interviews, document scanning, and multimedia gathering</p>
                      </div>
                      <div className="phase">
                        <h4>Phase 3: Digital Archive Creation</h4>
                        <p>AI-powered transcription, tagging, and cross-referencing of materials</p>
                      </div>
                      <div className="phase">
                        <h4>Phase 4: Analysis & Interpretation</h4>
                        <p>Pattern identification and thematic analysis using both human insight and machine learning</p>
                      </div>
                    </div>
                    
                    <div className="academic-actions">
                      <button className="action-btn purple">Download Methodology</button>
                      <button className="link-btn">See Process in Action →</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Analysis & Findings */}
              <div className="academic-card">
                <button 
                  onClick={() => setExpandedSection(expandedSection === 'findings' ? null : 'findings')}
                  className="academic-header"
                >
                  <div className="academic-info">
                    <div className="academic-icon orange">📊</div>
                    <div>
                      <h3>Analysis & Findings</h3>
                      <p>Key insights and patterns discovered</p>
                    </div>
                  </div>
                  <span className="expand-icon">{expandedSection === 'findings' ? '▲' : '▼'}</span>
                </button>
                
                {expandedSection === 'findings' && (
                  <div className="academic-content">
                    <p>Preliminary analysis reveals recurring themes of resilience, community support, and the lasting impact of educational integration on family dynamics across generations.</p>
                    
                    <div className="research-status">
                      <h4>Research in Progress</h4>
                      <p>Final analysis will be available upon completion of data collection from all families.</p>
                    </div>
                    
                    <div className="stats-grid">
                      <div className="stat">
                        <div className="stat-number">{families.length}</div>
                        <div className="stat-label">Families Documented</div>
                      </div>
                      <div className="stat">
                        <div className="stat-number">{stories.length}</div>
                        <div className="stat-label">Stories Archived</div>
                      </div>
                      <div className="stat">
                        <div className="stat-number">127</div>
                        <div className="stat-label">Documents Archived</div>
                      </div>
                    </div>
                    
                    <div className="academic-actions">
                      <button className="action-btn orange">Preliminary Findings</button>
                      <button className="link-btn" onClick={() => setActiveSection('families')}>Explore Connected Stories →</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Citation Information */}
            <div className="citation-container">
              <h3>Cite This Research</h3>
              <div className="citation-box">
                <p>[Noah]. (2025). <em>Preserving the Untold Stories: Leveraging Emerging Technologies (AI and Machine Learning) for Archiving Hidden Histories of Children and Families Impacted by the Little Rock School Integration Crisis</em>. Master's Thesis, [University of Arkansas at Little Rock].</p>
              </div>
              <div className="citation-buttons">
                <button className="citation-btn">Copy APA Citation</button>
                <button className="citation-btn">Copy MLA Citation</button>
                <button className="citation-btn">Export BibTeX</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Chatbot */}
      <div className="chatbot-container">
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="chatbot-toggle"
          >
            💬
          </button>
        )}

        {isChatOpen && (
          <div className="chatbot">
            <div className="chatbot-header">
              <div className="chatbot-info">
                <div className="chatbot-avatar">📚</div>
                <div>
                  <h4>Dr. Archives</h4>
                  <p>Your AI Historian</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="close-btn">×</button>
            </div>
            <div className="chatbot-messages">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`message ${msg.type}`}>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="chatbot-input">
              <input 
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about the stories..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalArchive;