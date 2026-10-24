import React from 'react';
import './preview.css';

const PreviewBadge = ({ children }) => (
  <p className="pv-badge" role="note">
    <strong>Planned with the grant.</strong> {children || 'Sample content.'}
  </p>
);

export default PreviewBadge;
