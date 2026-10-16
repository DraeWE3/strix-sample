import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// The previous admin stylesheet is bundled with every page and public pages rely on its
// global resets (`*` margins, `.tab`, `.card-title`), so it stays imported here.
import './style/admin.css';
import '../style/fonts.css';

/**
 * /admin: the Strix Content Studio (see ./cms). It renders inside a shadow root so the
 * studio's styles and the public site's global styles cannot affect each other, and its
 * code loads only when this route is opened. The previous panel is in ./legacyAdmin.jsx.
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
