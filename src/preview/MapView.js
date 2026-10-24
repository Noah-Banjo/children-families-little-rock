import React, { useEffect, useRef, useState } from 'react';
import './preview.css';
import PreviewBadge from './PreviewBadge';
import {
  PINS, MAP_STATES, MAP_CATEGORIES, NEIGHBORHOOD_VIEW, NATIONAL_VIEW, US_OUTLINE
} from './previewData';

const JS = 'https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.0/dist/maplibre-gl.js';
const CSS = 'https://cdn.jsdelivr.net/npm/maplibre-gl@5.6.0/dist/maplibre-gl.css';
const STYLE = 'https://tiles.openfreemap.org/styles/positron';

let loader = null;
const loadMapLibre = () => {
  if (window.maplibregl) return Promise.resolve(window.maplibregl);
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS;
    document.head.appendChild(link);
    const s = document.createElement('script');
    s.src = JS;
    s.onload = () => resolve(window.maplibregl);
    s.onerror = () => { loader = null; reject(new Error('maplibre failed to load')); };
    document.head.appendChild(s);
  });
  return loader;
};

const LOST = 2;
const LA = PINS.find((p) => p.id === 'la');
const LR = PINS.find((p) => p.id === 'lr');
const NY = PINS.find((p) => p.id === 'brownny');

const arc = (a, b) => {
  const pts = [];
  for (let i = 0; i <= 40; i += 1) {
    const t = i / 40;
    const lift = Math.sin(Math.PI * t) * 4;
    pts.push([a.lon + (b.lon - a.lon) * t, a.lat + (b.lat - a.lat) * t + lift]);
  }
  return { type: 'Feature', geometry: { type: 'LineString', coordinates: pts }, properties: {} };
};

const MapView = ({ focusId, onOpenStory }) => {
  const box = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [state, setState] = useState(0);
  const [on, setOn] = useState({ family: true, business: true, institution: true, school: true, arc: true });
  const [tilt, setTilt] = useState(false);
  const [globe, setGlobe] = useState(false);
  const [sel, setSel] = useState(focusId || null);
  const national = state === LOST;

  useEffect(() => {
    let dead = false;
    loadMapLibre().then((ml) => {
      if (dead || !box.current) return;
      const m = new ml.Map({
        container: box.current,
        style: STYLE,
        center: NEIGHBORHOOD_VIEW.center,
        zoom: NEIGHBORHOOD_VIEW.zoom,
        attributionControl: { compact: true }
      });
      map.current = m;
      m.addControl(new ml.NavigationControl({ visualizePitch: true }), 'top-right');
      m.on('error', (e) => { if (e && e.error && /style|Failed to fetch/i.test(String(e.error.message))) setError(true); });
      m.on('load', () => {
        try {
          m.addSource('us', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [US_OUTLINE] } } });
          m.addSource('arcs', { type: 'geojson', data: { type: 'FeatureCollection', features: [arc(LR, LA), arc(LR, NY)] } });
          m.addLayer({ id: 'arcs', type: 'line', source: 'arcs', layout: { visibility: 'none' }, paint: { 'line-color': '#DE2D22', 'line-width': 3, 'line-dasharray': [2, 1] } });
          const src = m.getStyle().sources;
          const vec = Object.keys(src).find((k) => src[k].type === 'vector');
          if (vec) {
            m.addLayer({
              id: 'pv-3d', type: 'fill-extrusion', source: vec, 'source-layer': 'building', minzoom: 14,
              paint: { 'fill-extrusion-color': '#c9d1dc', 'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 8], 'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0], 'fill-extrusion-opacity': 0.85 }
            });
          }
        } catch (err) { /* style layers are optional */ }
        setReady(true);
      });
    }).catch(() => setError(true));
    return () => { dead = true; if (map.current) { map.current.remove(); map.current = null; } };
  }, []);

  // markers
  useEffect(() => {
    const ml = window.maplibregl;
    const m = map.current;
    if (!ready || !ml || !m) return;
    markers.current.forEach((x) => x.remove());
    markers.current = [];
    PINS.forEach((p) => {
      if (!p.states.includes(state) || !on[p.type]) return;
      if (national && !p.national) return;
      const el = document.createElement('button');
      el.type = 'button';
      el.className = `pv-mk ${p.type}`;
      el.setAttribute('aria-label', p.title);
      el.addEventListener('click', () => setSel(p.id));
      markers.current.push(new ml.Marker({ element: el }).setLngLat([p.lon, p.lat]).addTo(m));
    });
  }, [ready, state, on, national]);

  // camera and arcs follow the time step
  useEffect(() => {
    const m = map.current;
    if (!ready || !m) return;
    const v = national ? NATIONAL_VIEW : NEIGHBORHOOD_VIEW;
    m.flyTo({ center: v.center, zoom: v.zoom, pitch: tilt && !national ? 62 : 0, bearing: tilt && !national ? -20 : 0, duration: 1400 });
    if (m.getLayer('arcs')) m.setLayoutProperty('arcs', 'visibility', national && on.arc ? 'visible' : 'none');
  }, [ready, national, on.arc]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const m = map.current;
    if (!ready || !m) return;
    m.easeTo({ pitch: tilt && !national ? 62 : 0, bearing: tilt && !national ? -20 : 0, duration: 900 });
  }, [tilt]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const m = map.current;
    if (!ready || !m || !m.setProjection) return;
    m.setProjection({ type: globe ? 'globe' : 'mercator' });
  }, [ready, globe]);

  useEffect(() => {
    const p = PINS.find((x) => x.id === focusId);
    if (p && map.current && ready) {
      setSel(p.id);
      if (!p.states.includes(state)) setState(p.states[0]);
      map.current.flyTo({ center: [p.lon, p.lat], zoom: p.national ? 4 : 16, duration: 1200 });
    }
  }, [focusId, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const pin = PINS.find((p) => p.id === sel);

  return (
    <div className="pv-wrap">
      <PreviewBadge>Sample map. Positions are illustrative until the surveyed addresses are loaded.</PreviewBadge>
      <div className="pv-ctl">
        <div className="pv-steps" role="group" aria-label="Time period">
          {MAP_STATES.map((s, i) => (
            <button key={s.name} type="button" aria-pressed={state === i} onClick={() => setState(i)}>{s.name}</button>
          ))}
        </div>
        <button type="button" aria-pressed={tilt} onClick={() => setTilt((v) => !v)} disabled={national}>3D tilt</button>
        <button type="button" aria-pressed={globe} onClick={() => setGlobe((v) => !v)}>Globe</button>
      </div>
      <p className="pv-cap">{MAP_STATES[state].caption}</p>
      <div className="pv-map-shell">
        <div className="pv-map" ref={box} />
        {!ready && !error && <div className="pv-map-msg">Loading map…</div>}
        {error && <div className="pv-map-msg">The map could not load. Check your connection and reload the page.</div>}
        {pin && (
          <aside className="pv-panel">
            <button type="button" className="x" aria-label="Close" onClick={() => setSel(null)}>×</button>
            <h4>{pin.title}</h4>
            <p>{pin.text}</p>
            {pin.story && (
              <button type="button" className="pv-chip btn" onClick={() => onOpenStory(pin.story)}>Hear the story</button>
            )}
          </aside>
        )}
        <div className="pv-legend">
          <b>Legend</b>
          {Object.entries(MAP_CATEGORIES).map(([k, label]) => (
            <button key={k} type="button" aria-pressed={on[k]} onClick={() => setOn((o) => ({ ...o, [k]: !o[k] }))}>
              <span className={`pv-dot ${k}`} />{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
