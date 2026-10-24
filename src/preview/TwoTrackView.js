import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './preview.css';
import PreviewBadge from './PreviewBadge';
import { REACHED_BY } from './previewData';

// Public events sit on the left. Family experience sits on the right.
// Lines show which public event reached which family. Links are sample until each carries a citation.
const TwoTrackView = ({ years, timelineData, categoryMeta }) => {
  const rootRef = useRef(null);
  const refs = useRef({});
  const [paths, setPaths] = useState([]);
  const [hover, setHover] = useState(null);
  const titles = {};

  years.forEach((y) => {
    const d = timelineData[y];
    [...(d.historical || []), ...(d.families || [])].forEach((e) => { titles[e.id] = e.title; });
  });

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const base = root.getBoundingClientRect();
    const next = [];
    Object.entries(REACHED_BY).forEach(([to, { from }]) => {
      const a = refs.current[from];
      const b = refs.current[to];
      if (!a || !b) return;
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      const x1 = ra.right - base.left;
      const y1 = ra.top + ra.height / 2 - base.top;
      const x2 = rb.left - base.left;
      const y2 = rb.top + rb.height / 2 - base.top;
      const mid = (x1 + x2) / 2;
      next.push({ id: to, from, d: `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}` });
    });
    setPaths(next);
  }, []);

  useLayoutEffect(() => { measure(); }, [measure, years, timelineData]);
  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const litIds = new Set();
  if (hover) {
    litIds.add(hover);
    Object.entries(REACHED_BY).forEach(([to, { from }]) => {
      if (to === hover || from === hover) { litIds.add(to); litIds.add(from); }
    });
  }

  const card = (e) => {
    const meta = categoryMeta[e.category] || { label: e.category, color: '#64748b' };
    const reach = REACHED_BY[e.id];
    return (
      <div
        key={e.id}
        ref={(el) => { refs.current[e.id] = el; }}
        className={`pv-ev${litIds.has(e.id) ? ' lit' : ''}${hover && !litIds.has(e.id) ? ' dim' : ''}`}
        style={{ '--c': meta.color }}
        onMouseEnter={() => setHover(e.id)}
        onMouseLeave={() => setHover(null)}
        onFocus={() => setHover(e.id)}
        onBlur={() => setHover(null)}
        tabIndex={0}
      >
        <small>{e.date || ''}</small>
        <b>{e.title}</b>
        {reach && <span className="pv-by">Reached by: {titles[reach.from]}</span>}
      </div>
    );
  };

  return (
    <div className="pv-wrap">
      <PreviewBadge>Sample links. In the funded version each line carries a cited source.</PreviewBadge>
      <div className="pv-tt" ref={rootRef}>
        <div className="pv-tt-head"><span>Public events</span><span>What families lived through</span></div>
        {years.map((y) => {
          const d = timelineData[y];
          const all = [...(d.historical || []), ...(d.families || [])];
          const left = all.filter((e) => e.category !== 'family-experience');
          const right = all.filter((e) => e.category === 'family-experience');
          return (
            <div className="pv-tt-row" key={y}>
              <div className="pv-tt-year">{y}</div>
              <div className="pv-col-l">{left.map(card)}</div>
              <div className="pv-col-r">{right.map(card)}</div>
            </div>
          );
        })}
        <svg className="pv-svg" aria-hidden="true">
          {paths.map((p) => (
            <path key={p.id} d={p.d} className={litIds.has(p.id) ? 'lit' : ''} />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default TwoTrackView;
