import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './style/admin.css';
import '../style/fonts.css';

/**
 * The Strix Content Studio (see ./cms), built separately for admin.strixproduction.com
 * (vite.admin.config.js). It renders inside a shadow root so the studio's styles and the
 * site's global styles cannot affect each other.
 */
const AdminPanel = () => {
  const hostRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
    let cancelled = false;
    let teardown = null;
    let backend = null;
    Promise.all([import('./cms/studio.js'), import('./cms/backend.js')])
      .then(([{ mountStudio }, { createBackend }]) => {
        if (cancelled) return;
        backend = createBackend();
        teardown = mountStudio(shadow, backend);
      })
      .catch((error) => {
        console.error('Could not load the content studio:', error);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      teardown?.();
      backend?.dispose();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Strix Studio — Content management</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      {failed && <p style={{ padding: 24 }}>The content studio could not be loaded. Reload the page to try again.</p>}
      <div ref={hostRef} />
    </>
  );
};

export default AdminPanel;
