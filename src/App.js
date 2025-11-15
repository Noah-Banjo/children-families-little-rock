import React, { useState, useCallback } from 'react';
import './App.css';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import SearchOverlay from './components/SearchOverlay';
import HeroSection from './components/HeroSection';
import FamiliesSection from './components/FamiliesSection';
import TimelineSection from './components/TimelineSection';
import AboutSection from './components/AboutSection';
import ChatBot from './components/ChatBot';

// Custom Hooks
import { useArchiveData } from './hooks/useArchiveData';
import { useSearch } from './hooks/useSearch';

const HistoricalArchive = () => {
  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [expandedSection, setExpandedSection] = useState(null);

  // Timeline specific state
  const [selectedYear, setSelectedYear] = useState(null);
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [timelineSearch, setTimelineSearch] = useState('');

  // ChatBot state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: "Hello! I'm Dr. Archives, your personal historian and guide to the untold stories of Little Rock School Integration Crisis. I'm here to help you explore these precious histories, find connections between stories, and discover multimedia content. What would you like to learn about today?",
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');

  // Use custom hooks
  const { families, stories, loading, error, handleRetry, handleRefresh } = useArchiveData();

  // Historical events data for timeline
  const getTimelineData = useCallback(() => {
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
    };

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
              description: family.description || 'Family experience during integration',
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
  }, [families]);

  const {
    globalSearch,
    debouncedSearch,
    searchResults,
    isSearchActive,
    showSearchOverlay,
    setShowSearchOverlay,
    handleSearchChange,
    handleSearchResultClick
  } = useSearch(families, stories, getTimelineData);

  // Handle search result navigation
  const handleSearchResultNavigation = useCallback((type, item) => {
    const result = handleSearchResultClick(type, item);

    if (result.type === 'family') {
      setActiveSection('families');
    } else if (result.type === 'story') {
      setActiveSection('stories');
    } else if (result.type === 'timeline') {
      setActiveSection('timeline');
      setSelectedYear(result.item?.year);
    }
  }, [handleSearchResultClick]);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={() => setActiveSection('home')}>
            <div className="logo-icon">📚</div>
            <div>
              <h1>Children in History</h1>
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

      {/* Search Overlay */}
      <SearchOverlay
        showSearchOverlay={showSearchOverlay}
        setShowSearchOverlay={setShowSearchOverlay}
        debouncedSearch={debouncedSearch}
        searchResults={searchResults}
        handleSearchResultClick={handleSearchResultNavigation}
      />

      {/* Main Content */}
      {activeSection === 'home' && (
        <div>
          {/* Hero Section */}
          <ErrorBoundary fallbackMessage="The hero section encountered an error. Please refresh the page.">
            <HeroSection
              setActiveSection={setActiveSection}
              globalSearch={globalSearch}
              handleSearchChange={handleSearchChange}
              setShowSearchOverlay={setShowSearchOverlay}
            />
          </ErrorBoundary>

          {/* Feature Cards */}
          <section className="features">
            <div className="features-grid">
              <div className="feature-card card-pink">
                <div className="feature-icon">👨‍👩‍👧‍👦</div>
                <h3>Family Stories</h3>
                <p>Personal accounts from families who lived through integration.</p>
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
                <p>Photos, videos, and documents from the era.</p>
                <a href="#" onClick={() => setActiveSection('multimedia')}>Browse Media →</a>
              </div>
            </div>
          </section>

          {/* Featured Families Section - Only show if families exist */}
          {!loading && families.length > 0 && (
            <section className="featured-families">
              <div className="container">
                <h2>Featured Family Stories</h2>
                <p>Real stories from families who experienced the Little Rock School Integration Crisis</p>
                <div className="families-preview">
                  {families.slice(0, 3).map((family) => (
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
                  ))}
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
        <ErrorBoundary fallbackMessage="The families section encountered an error. Please try refreshing the page.">
          <FamiliesSection
            families={families}
            loading={loading}
            error={error}
            handleRetry={handleRetry}
            handleRefresh={handleRefresh}
            isSearchActive={isSearchActive}
            searchResults={searchResults}
          />
        </ErrorBoundary>
      )}

      {/* Stories Section */}
      {activeSection === 'stories' && (
        <ErrorBoundary fallbackMessage="The stories section encountered an error. Please try refreshing the page.">
          <section className="stories-section">
            <div className="container">
              <h1>Individual Stories</h1>
              <p>Detailed accounts and documents from the integration experience</p>

              {loading && (
                <div className="loading">
                  <p>Loading stories from the archive...</p>
                </div>
              )}

              {!loading && stories.length > 0 && (
                <div className="stories-grid">
                  {(isSearchActive ? searchResults.stories : stories).map((story) => (
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
                  ))}
                </div>
              )}

              {!loading && stories.length === 0 && (
                <div className="no-content">
                  <p>Individual stories are being added to the archive. Check back soon.</p>
                </div>
              )}
            </div>
          </section>
        </ErrorBoundary>
      )}

      {/* Interactive Timeline Section */}
      {activeSection === 'timeline' && (
        <ErrorBoundary fallbackMessage="The timeline section encountered an error. Please try refreshing the page.">
          <TimelineSection
            families={families}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            timelineFilter={timelineFilter}
            setTimelineFilter={setTimelineFilter}
            timelineSearch={timelineSearch}
            setTimelineSearch={setTimelineSearch}
            isSearchActive={isSearchActive}
            globalSearch={globalSearch}
            handleSearchChange={handleSearchChange}
            debouncedSearch={debouncedSearch}
            setActiveSection={setActiveSection}
          />
        </ErrorBoundary>
      )}

      {/* Multimedia Section */}
      {activeSection === 'multimedia' && (
        <section className="multimedia-section">
          <div className="container">
            <h1>Multimedia Archive</h1>
            <p>Photos, videos, and documents from the era</p>

            <div className="multimedia-placeholder">
              <p>Multimedia content from family stories will be displayed here.</p>
              <p>Content is being processed and will be available soon.</p>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <AboutSection families={families} stories={stories} />
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
                <button className="btn-primary">Cite This Work</button>
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
                    <p>This research addresses a critical gap in historical documentation: the untold stories of children and families who experienced the Little Rock School Integration Crisis. While major events and figures are well-documented, the intimate, personal experiences of ordinary families often remain hidden in memories, and family stories.</p>

                    <p>By leveraging artificial intelligence and machine learning technologies, this project creates an innovative digital archive that not only preserves these stories but makes them accessible, searchable, and interactive for future generations.</p>

                    <div className="research-question">
                      <h4>Research Question</h4>
                      <p>How did the Little Rock integration crisis affect the families and siblings of students who integrated Little Rock schools, and what do these hidden stories reveal about how children's agency actually operates during moments of historical change? How can emerging technologies enhance the preservation and accessibility of hidden family histories from the Little Rock School Integration Crisis?</p>
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
                        <h4>Children's Agency and Family Networks</h4>
                        <p>How children develop the capacity for historical action within family systems</p>
                        <span>number of sources coming soon</span>
                      </div>
                      <div className="lit-category">
                        <h4>Civil Rights Documentation</h4>
                        <p>How children learn race</p>
                        <span>number of sources coming soon</span>
                      </div>
                      <div className="lit-category">
                        <h4>Oral History Methods </h4>
                        <p>Best practices for recovering family stories and the limitations of memory</p>
                        <span>number of sources coming soon</span>
                      </div>
                      <div className="lit-category">
                        <h4>Digital Preservation Theory</h4>
                        <p>Best practices and How emerging technologies can reclaibrate user experiences for hidden histories</p>
                        <span>number of sources coming soon</span>
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
                    <p>This research uses primary sources like oral interviews, newspaper articles, and memoirs to recover family experiences historians have unwittingly ignored, then builds a digital archive that makes these hidden stories permanently accessible. The methodology addresses both problems: the historiographical gap (families missing from civil rights narratives) and the preservation gap by adding usercentric accesibility using emerging technologies.</p>

                    <div className="methodology-phases">
                      <div className="phase">
                        <h4>Phase 1: Family Identification</h4>
                        <p>Working with existing oral histories from the Butler Center's "Beyond Central, Toward Acceptance" collection, newspaper archives (Arkansas Gazette, State Press, Detroit Tribune), memoirs, and secondary scholarship to identify patterns in how families experienced the integration crisis. This phase focuses on reading sources for what they reveal about siblings, parents, extended family networks, and community support systems - the stories buried in sources that historians have mined primarily for information about the Nine themselves.</p>
                      </div>
                      <div className="phase">
                        <h4>Phase 2: Digital Archive Design Story Collection</h4>
                        <p>Creating a web-based archive that organizes materials by family networks rather than individual students, making visible the connections between siblings' experiences, parents' strategies, and community responses. The platform includes interactive timelines, thematic organization (economic retaliation, security measures, educational disruption), and multimedia integration of photographs and documents.</p>
                      </div>
                      <div className="phase">
                        <h4>Phase 3: AI Integration</h4>
                        <p>Developing an intelligent chatbot for personalized historical engagement. Implementing machine learning to create a chatbot that can answer specific questions about family experiences, identify patterns across multiple family stories, and adapt responses to different users' needs. A middle school student asking "what was it like to be a sibling?" gets age-appropriate answers drawing from multiple families. A researcher asking about protection strategies gets a synthesized analysis across all archived materials. The AI makes these hidden histories truly accessible rather than just digitally stored.</p>
                      </div>
                      <div className="phase">
                        <h4>Phase 4: Analysis & Interpretation</h4>
                        <p>Understanding what family stories reveal about children's agency. Analyzing patterns across family experiences to answer the research question: how did integration affect families, and what does this reveal about how children's historical agency actually works? This phase synthesizes findings about family structure transformations, economic pressures, sibling experiences, security adaptations, and long-term impacts - building the argument that children's agency emerges from and reshapes family networks rather than operating in isolation.</p>
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
                        <div className="stat-number">coming soon</div>
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

      {/* Enhanced AI Chatbot */}
      <ErrorBoundary fallbackMessage="The chatbot encountered an error. Please refresh the page to restore functionality.">
        <ChatBot
          families={families}
          stories={stories}
          timelineData={getTimelineData()}
          activeSection={activeSection}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
        />
      </ErrorBoundary>
    </div>
  );
};

export default HistoricalArchive;
