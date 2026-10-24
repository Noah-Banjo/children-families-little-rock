import React, { useEffect, useRef, useState } from 'react';
import './preview.css';
import PreviewBadge from './PreviewBadge';
import { NARRATORS, TRANSCRIPT_SECONDS as DUR, PINS, EVENT_LABELS } from './previewData';

const STEP = DUR / 8;

const fmt = (s) => {
  const whole = Math.floor(s);
  const m = Math.floor(whole / 60);
  const r = whole % 60;
  return `${m}:${r < 10 ? '0' : ''}${r}`;
};

const StoriesPreview = ({ narratorId, setNarratorId, onOpenMap, onOpenTimeline }) => {
  const narrator = NARRATORS.find((n) => n.id === narratorId && !n.ghost) || NARRATORS[0];
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const transcriptRef = useRef(null);

  useEffect(() => {
    setT(0);
    setPlaying(false);
  }, [narrator.id]);

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setT((prev) => {
        const next = prev + 0.25;
        if (next >= DUR) {
          setPlaying(false);
          return DUR;
        }
        return next;
      });
    }, 250);
    return () => clearInterval(id);
  }, [playing]);

  const active = Math.min(7, Math.floor(t / STEP));

  useEffect(() => {
    if (!playing) return;
    const box = transcriptRef.current;
    const line = box && box.children[active];
    if (line) box.scrollTo({ top: Math.max(0, line.offsetTop - box.clientHeight / 3), behavior: 'smooth' });
  }, [active, playing]);

  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setT(Math.max(0, Math.min(DUR, ((e.clientX - r.left) / r.width) * DUR)));
  };

  const onTrackKey = (e) => {
    if (e.key === 'ArrowRight') setT((v) => Math.min(DUR, v + STEP));
    if (e.key === 'ArrowLeft') setT((v) => Math.max(0, v - STEP));
  };

  const toggle = () => {
    if (!playing && t >= DUR) setT(0);
    setPlaying((p) => !p);
  };

  return (
    <div className="pv-wrap">
      <PreviewBadge>Sample content. Real interview transcripts replace the placeholder lines.</PreviewBadge>
      <div className="pv-stories">
        <div className="pv-nlist">
          {NARRATORS.map((n) => (
            <button
              key={n.id}
              type="button"
              className={`pv-ncard${n.ghost ? ' ghost' : ''}`}
              aria-pressed={n.id === narrator.id}
              disabled={!!n.ghost}
              onClick={() => setNarratorId(n.id)}
            >
              <b>{n.name}</b>
              <span>{n.tag}</span>
            </button>
          ))}
        </div>

        <article className="pv-card pv-sdetail">
          <div>
            <span className="pv-chip">{narrator.tag}</span>
            <h3>{narrator.name}</h3>
          </div>
          <div className="pv-facts">
            {narrator.facts.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>

          <div className="pv-player">
            <div className="pv-screen">
              <div className="pv-screen-label">
                <span>Public excerpt</span>
                <span>{fmt(DUR)} sample video</span>
              </div>
              <button type="button" className="pv-play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {playing ? <path d="M6 5h4v14H6zm8 0h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
                </svg>
              </button>
            </div>
            <div className="pv-bar">
              <div
                className="pv-track"
                role="slider"
                tabIndex={0}
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={DUR}
                aria-valuenow={Math.floor(t)}
                onClick={seek}
                onKeyDown={onTrackKey}
              >
                <i style={{ width: `${(t / DUR) * 100}%` }} />
              </div>
              <span className="pv-time">{fmt(t)} / {fmt(DUR)}</span>
            </div>
          </div>

          <div className="pv-tiers">
            <span className="pv-chip pub">Excerpt and transcript are public</span>
            <span className="pv-chip lock">Full recording held at CAHC, onsite access</span>
          </div>

          <div>
            <div className="pv-trhead">
              <b>Synchronized transcript</b>
              <span className="pv-sample">Sample text</span>
            </div>
            <div className="pv-tr" ref={transcriptRef}>
              {narrator.lines.map((line, i) => (
                <button
                  key={line}
                  type="button"
                  className={i === active ? 'on' : ''}
                  onClick={() => setT(i * STEP + 0.01)}
                >
                  <em>{fmt(i * STEP)}</em>
                  <span>{line}</span>
                </button>
              ))}
            </div>
          </div>

          {(narrator.mapLinks.length > 0 || narrator.timelineLinks.length > 0) && (
            <div>
              <b className="pv-sub">Connected in the archive</b>
              <div className="pv-links">
                {narrator.mapLinks.map((id) => {
                  const pin = PINS.find((p) => p.id === id);
                  return pin ? (
                    <button key={id} type="button" className="pv-chip btn" onClick={() => onOpenMap(id)}>
                      Map: {pin.title}
                    </button>
                  ) : null;
                })}
                {narrator.timelineLinks.map((id) => (
                  <button key={id} type="button" className="pv-chip btn" onClick={() => onOpenTimeline(id)}>
                    Timeline: {EVENT_LABELS[id] || id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default StoriesPreview;
