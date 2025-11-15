import React from 'react';

const AboutSection = ({ families, stories }) => {
  return (
    <section className="about-section">
      <div className="container">
        {/* ===== SECTION 1: EXISTING CONTENT ===== */}
        <h1>About This Archive</h1>
        <div className="about-content">
          <p>Many people know the names of the Little Rock Nine. They don't ask about their siblings, their parents who lost jobs, or their grandmothers who stood guard at night. This digital archive recovers those hidden stories - not as background context, but as evidence of how historical change actually happens through family networks.</p>

          <p>The archive organizes materials by families rather than famous individuals, revealing how the integration crisis transformed entire households: siblings who faced harassment at their own schools, parents who developed security protocols for daily survival, extended family members who provided economic support when segregationists cut off credit. These experiences have remained hidden because traditional archives were never designed to capture the intimate, family-centered experiences that shaped children's historical agency.</p>

          <p>An AI-powered chatbot makes these stories accessible through personalized interaction. Ask about protection strategies, and the system synthesizes information across multiple family accounts. Ask what it was like to be a sibling, and you'll get responses drawn from experiences that have never been centered in civil rights history. The technology serves the historical argument: that children's agency emerges from and reshapes family systems, not from isolated individual heroism.</p>

          <p>This archive challenges how we preserve, access and understand history. It makes visible what historians have systematically overlooked, and it provides a methodology for recovering hidden histories in other contexts where children's experiences have been treated as merely supplementary to adult action.</p>
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
              <h3 className="researcher-name">[YOUR_NAME]</h3>
              <p className="researcher-program">Master of Public History</p>
              <p className="researcher-institution">University of Arkansas at Little Rock</p>

              <div className="bio-text">
                {/* USER: Add your bio here */}
                <p>[YOUR_BIO - Please add your biography here. This should describe your background, research interests, and what motivated you to undertake this project. You can discuss your academic journey, previous work, and why preserving these hidden histories matters to you personally.]</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SECTION 3: THESIS INFORMATION ===== */}
        <div className="about-section-divider"></div>
        <h2 className="about-section-title">The Thesis</h2>

        <div className="thesis-card about-card">
          <h3 className="thesis-full-title">
            Preserving the Untold Stories: Leveraging Emerging Technologies (AI and Machine Learning) for Archiving Hidden Histories of Children and Families Impacted by the Little Rock School Integration Crisis
          </h3>

          <div className="thesis-details">
            <div className="thesis-detail-item">
              <span className="detail-label">Completion:</span>
              <span className="detail-value">[DATE - e.g., May 2025]</span>
            </div>
            <div className="thesis-detail-item">
              <span className="detail-label">Institution:</span>
              <span className="detail-value">University of Arkansas at Little Rock</span>
            </div>
            <div className="thesis-detail-item">
              <span className="detail-label">Degree:</span>
              <span className="detail-value">Master of Public History</span>
            </div>
          </div>
        </div>

        {/* ===== SECTION 4: THESIS SUPERVISORS ===== */}
        <div className="about-section-divider"></div>
        <h2 className="about-section-title">Academic Supervisors &amp; Committee</h2>

        <div className="supervisors-grid">
          {/* Committee Chair */}
          <div className="supervisor-card about-card">
            <div className="supervisor-role-badge chair">Committee Chair</div>
            <h3 className="supervisor-name">[CHAIR_NAME]</h3>
            <p className="supervisor-title">[THEIR_TITLE]</p>
            <p className="supervisor-institution">University of Arkansas at Little Rock</p>
          </div>

          {/* Committee Member 1 */}
          <div className="supervisor-card about-card">
            <div className="supervisor-role-badge">Committee Member</div>
            <h3 className="supervisor-name">[MEMBER_1_NAME]</h3>
            <p className="supervisor-title">[THEIR_TITLE]</p>
            <p className="supervisor-institution">University of Arkansas at Little Rock</p>
          </div>

          {/* Committee Member 2 */}
          <div className="supervisor-card about-card">
            <div className="supervisor-role-badge">Committee Member</div>
            <h3 className="supervisor-name">[MEMBER_2_NAME]</h3>
            <p className="supervisor-title">[THEIR_TITLE]</p>
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

        {/* ===== SECTION 6: CONTACT & CITATION ===== */}
        <div className="about-section-divider"></div>
        <h2 className="about-section-title">Contact &amp; How to Cite</h2>

        <div className="contact-card about-card">
          <div className="contact-section">
            <h3 className="card-title">Contact Information</h3>
            <p>For questions about this project or to share family stories for inclusion in the archive:</p>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <span className="contact-value">[YOUR_EMAIL]</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Website:</span>
                <a href="https://childrenandfamilieslr.com" className="contact-link" target="_blank" rel="noopener noreferrer">
                  https://childrenandfamilieslr.com
                </a>
              </div>
            </div>
          </div>

          <div className="citation-section">
            <h3 className="card-title">Suggested Citation</h3>
            <div className="citation-box">
              <p>[Your Name]. (2025). <em>Preserving the Untold Stories: Leveraging Emerging Technologies for Archiving Hidden Histories of Children and Families Impacted by the Little Rock School Integration Crisis</em>. Digital Archive. https://childrenandfamilieslr.com</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
