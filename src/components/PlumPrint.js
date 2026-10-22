import React, { useEffect } from 'react';

const PLUMX_SRC = '//cdn.plu.mx/widget-popup.js';
const THESIS_URL = 'https://research.ualr.edu/etd/1336';

// The PlumX script only scans the page once on load. Because this site renders
// sections client-side, re-add the script after the link is mounted.
const PlumPrint = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = PLUMX_SRC;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <a
      href={`https://plu.mx/plum/a/?repo_url=${encodeURIComponent(THESIS_URL)}`}
      data-popup="right"
      data-size="large"
      className="plumx-plum-print-popup"
      data-site="plum"
      data-hide-when-empty="true"
    >
      {' '}
    </a>
  );
};

export default PlumPrint;
