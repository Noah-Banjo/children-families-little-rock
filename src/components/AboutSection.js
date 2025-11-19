import React from 'react';

const AboutSection = ({ families, stories }) => {
  return (
    <section className="about-section">
      <div className="container">
        {/* ===== SECTION 1: EXISTING CONTENT ===== */}
        <h1>About This Archive</h1>
        <div className="about-content">
          <p>Many people are familiar with the names of the Little Rock Nine, but often the stories of their siblings, parents who faced job losses, or grandmothers who kept watch go unnoticed. This mini digital exhibit aims to bring those lesser-known stories to light, highlighting how real change often happens within family networks rather than through historic events alone.</p>

          <p>The exhibit arranges materials by families rather than by famous individuals, offering a glimpse into how the integration crisis touched entire households: siblings who endured harassment in their schools, parents who developed security measures for daily protection, and extended family members who provided financial support when segregationists cut off credit. These glimpses help us understand the deeply personal, family-centered experiences that contributed to children's sense of agency in history.</p>

          <p>To make these stories even more accessible, an AI-powered chatbot has been introduced. You can ask it questions about protective strategies or what it was like to be a sibling, and it synthesizes information from various family stories to give you thoughtful, personalized responses. This technology aims to reach those who want quick insights or cannot access these stories easily from afar.</p>

          <p>In a gentle way, this exhibit shapes how we access and understand hidden histories.</p>
        </div>

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

        {/* ===== SECTION 2: ABOUT THE RESEARCHER ===== */}
        <div className="about-section-divider"></div>
        <h2 className="about-section-title">About the Researcher</h2>

        <div className="researcher-card about-card">
          <div className="researcher-layout">
            <div className="researcher-photo">
              <div className="photo-placeholder">
                <span className="photo-icon">👤</span>
                <p>Photo Coming Soon</p>
              </div>
            </div>

            <div className="researcher-bio">
              <h3 className="researcher-name">Noah Adebanjo</h3>
              <p className="researcher-program">Master of Public History</p>
              <p className="researcher-institution">University of Arkansas at Little Rock</p>

              <div className="bio-text">
                {/* USER: Add your bio here */}
                <p>[YOUR_BIO - Please add your biography here. This should describe your background, research interests, and what motivated you to undertake this project. You can discuss your academic journey, previous work, and why preserving these hidden histories matters to you personally.]</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SECTION 3: THESIS SUPERVISORS ===== */}
        <div className="about-section-divider"></div>
        <h2 className="about-section-title">Academic Supervisors &amp; Committee</h2>

        <div className="supervisors-grid">
          {/* Committee Chair */}
          <div className="supervisor-card about-card">
            <div className="supervisor-role-badge chair">Committee Chair</div>
            <h3 className="supervisor-name">Dr. Barclay Key</h3>
            <p className="supervisor-institution">University of Arkansas at Little Rock</p>
          </div>

          {/* Committee Member 1 */}
          <div className="supervisor-card about-card">
            <div className="supervisor-role-badge">Committee Member</div>
            <h3 className="supervisor-name">Dr. Charles Romney</h3>
            <p className="supervisor-institution">University of Arkansas at Little Rock</p>
          </div>

          {/* Committee Member 2 */}
          <div className="supervisor-card about-card">
            <div className="supervisor-role-badge">Committee Member</div>
            <h3 className="supervisor-name">Dr. Jess Porter</h3>
            <p className="supervisor-institution">University of Arkansas at Little Rock</p>
          </div>

          {/*
            USER: If you have additional committee members, add more cards here:

            <div className="supervisor-card about-card">
              <div className="supervisor-role-badge">Committee Member</div>
              <h3 className="supervisor-name">[NAME]</h3>
              <p className="supervisor-title">[TITLE]</p>
              <p className="supervisor-institution">University of Arkansas at Little Rock</p>
            </div>
          */}
        </div>

        {/* ===== SECTION 5: CONTRIBUTORS & ACKNOWLEDGMENTS ===== */}
        <div className="about-section-divider"></div>
        <h2 className="about-section-title">Contributors &amp; Acknowledgments</h2>

        <div className="contributors-grid">
          {/* CARD A: Oral History Participants */}
          <div className="contributor-card about-card">
            <h3 className="card-title">Oral History Participants</h3>
            <p className="card-intro">This project would not be possible without the generous participation of individuals who shared their family stories:</p>
            <ul className="contributor-list">
              <li>Phyllis Brown (Sister of Minnijean Brown Trickey)</li>
              <li>Dr. Sybil Hampton Jordan</li>
              {/* USER: Add additional oral history participants here */}
            </ul>
          </div>

          {/* CARD B: Institutional Partners */}
          <div className="contributor-card about-card">
            <h3 className="card-title">Institutional Support</h3>
            <p className="card-intro">Special thanks to the following institutions for their support and for letting me use their archival resources:</p>
            <ul className="contributor-list">
              <li>UA Little Rock Center for Arkansas History and Culture</li>
              <li>Butler Center for Arkansas Studies</li>
              {/* USER: Add additional institutions here */}
            </ul>
          </div>

          {/* CARD C: Primary Sources */}
          <div className="contributor-card about-card">
            <h3 className="card-title">Primary Sources &amp; Memoirs</h3>
            <p className="card-intro">This research draws on memoirs and primary sources. They include:</p>
            <ul className="contributor-list">
              <li>Melba Pattillo Beals - <em>Warriors Don't Cry</em> (1994)</li>
              <li>Carlotta Walls LaNier - <em>A Mighty Long Way</em> (2009)</li>
              <li>Terrence Roberts - <em>Lessons from Little Rock</em> (2009)</li>
              <li>Elizabeth Eckford &amp; Eurydice Stanley - <em>The Worst First Day</em> (2017)</li>
              <li>Daisy Bates - <em>The Long Shadow of Little Rock</em> (1962)</li>
              {/* USER: Add additional primary sources here */}
            </ul>
          </div>

          {/* CARD D: Additional Acknowledgments */}
          <div className="contributor-card about-card">
            <h3 className="card-title">Additional Thanks</h3>
            <p className="card-intro">The researcher would also like to thank:</p>
            <ul className="contributor-list">
              {/* USER: Replace these placeholders with actual names */}
              <li>[FAMILY_MEMBERS - Add family members who supported your work]</li>
              <li>[FRIENDS - Add friends who provided encouragement]</li>
              <li>[MENTORS - Add mentors who guided you]</li>
              <li>[OTHER_SUPPORTERS - Add anyone else who helped make this project possible]</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
