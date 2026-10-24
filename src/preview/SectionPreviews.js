import React from 'react';
import './preview.css';
import PreviewBadge from './PreviewBadge';

const NINE = ['Brown', 'Eckford', 'Green', 'Mothershed', 'Pattillo', 'Ray', 'Roberts', 'Thomas', 'Walls'];

export const FamiliesPreview = () => (
  <div className="pv-wrap pv-block">
    <PreviewBadge>Sample pages. Each family reviews its own page before it goes public.</PreviewBadge>
    <h2 className="pv-h">Where family pages will appear</h2>
    <p>Parents, siblings, grandparents and neighbors stand at the center of the archive. Each family page links to its stories, its map points and its place on the timeline.</p>
    <div className="pv-grid">
      {NINE.map((n) => (
        <div key={n} className="pv-card pv-fam">
          <div className="pv-av" aria-hidden="true">{n[0]}</div>
          <h4>The {n} family</h4>
          <p>Family page in preparation.</p>
          <div className="pv-links">
            <span className="pv-chip">Stories</span>
            <span className="pv-chip">Map points</span>
            <span className="pv-chip">Timeline</span>
          </div>
        </div>
      ))}
      <div className="pv-card pv-fam" style={{ borderStyle: 'dashed' }}>
        <div className="pv-av" aria-hidden="true">+</div>
        <h4>Families screened out</h4>
        <p>Families that were considered and screened out of the formal integration process also get pages.</p>
      </div>
    </div>
  </div>
);

export const ScholarshipPreview = () => (
  <div className="pv-wrap pv-block">
    <PreviewBadge>Sample content. The classroom unit, the code and the codebook are published with the grant.</PreviewBadge>
    <h2 className="pv-h">Scholarship and teaching</h2>
    <div className="pv-two">
      <div className="pv-card pv-pane">
        <h4>K-12 curriculum</h4>
        <p>Units built from the oral histories and the timeline, aligned with Arkansas social studies standards.</p>
        <ul>
          <li>Unit 1. Who prepared the Nine? Family and sibling perspectives</li>
          <li>Unit 2. From a federal ruling to a front door</li>
          <li>Unit 3. The Lost Year on a map</li>
        </ul>
        <div className="pv-links"><span className="pv-chip">Primary sources included</span><span className="pv-chip">Teacher guide</span></div>
      </div>
      <div className="pv-card pv-pane">
        <h4>Open-source repository</h4>
        <p>The timeline, the map and the story pages are published so other community archives can adapt them.</p>
        <pre className="pv-mono">{`children-families-little-rock/
  timeline/   two-track timeline
  map/        MapLibre map and legend
  stories/    narrator page and transcript sync
  codebook/   metadata fields and values
  DMP.md      data management plan`}</pre>
      </div>
    </div>
    <div className="pv-card pv-pane" style={{ marginTop: '1rem' }}>
      <h4>Codebook preview</h4>
      <p>Every field, its permitted values and the community reasoning behind it.</p>
      <div className="pv-tablewrap">
        <table className="pv-table">
          <thead><tr><th>Field</th><th>Permitted values</th><th>Why it exists</th></tr></thead>
          <tbody>
            <tr><td>interview_id</td><td>Sequential ID</td><td>File naming with family name, date and format</td></tr>
            <tr><td>access_tier</td><td>public, onsite, request</td><td>Narrators choose how each portion is shared</td></tr>
            <tr><td>automated_processing</td><td>allowed, declined</td><td>Narrators decide whether transcripts may be processed by machine</td></tr>
            <tr><td>subject_heading</td><td>Library taxonomy and community terms</td><td>Developed with narrators and the community network</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export const AboutPreview = () => (
  <div className="pv-wrap pv-block">
    <PreviewBadge>Planned practice. Narrators are co-creators of the collection and keep their rights.</PreviewBadge>
    <h2 className="pv-h">Consent, access and preservation</h2>
    <div className="pv-two">
      <div className="pv-card pv-pane">
        <h4>How consent works</h4>
        <ol>
          <li>Before recording, the narrator signs a plain-language agreement that says which portions are public and which need institutional access.</li>
          <li>The narrator decides whether any transcript may be used for automated processing.</li>
          <li>After release, the narrator can amend how they are described or restrict portions of the testimony.</li>
          <li>The narrator may withdraw from the archive entirely.</li>
        </ol>
      </div>
      <div className="pv-card pv-pane">
        <h4>Tiered access</h4>
        <p>Short video excerpts and full synchronized transcripts are public. Full recordings stay at the Center for Arkansas History and Culture with onsite access through the University of Houston Digital Humanities Core.</p>
        <div className="pv-links">
          <span className="pv-chip pub">Public excerpt and transcript</span>
          <span className="pv-chip lock">Full recording onsite</span>
        </div>
        <h4 style={{ marginTop: '1rem' }}>Preservation</h4>
        <p>Three copies on two kinds of storage with one offsite. The master sits at CAHC, a working copy at the Digital Humanities Core and a cloud backup elsewhere.</p>
      </div>
    </div>
    <div className="pv-card pv-pane" style={{ marginTop: '1rem' }}>
      <h4>Partners</h4>
      <div className="pv-links">
        <span className="pv-chip">Center for Arkansas History and Culture, UA Little Rock</span>
        <span className="pv-chip">Butler Center for Arkansas Studies</span>
        <span className="pv-chip">Little Rock Central High School National Historic Site</span>
        <span className="pv-chip">University of Houston Digital Humanities Core</span>
      </div>
    </div>
  </div>
);
