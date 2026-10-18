import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Nav from '../components/Navbar';
import Footer from '../components/Footer';
import SEO, { PendingSEO } from '../components/SEO';
import CaseStudyView from '../components/caseStudy/CaseStudyView';
import { caseStudyMeta, loadCaseStudy, nextProjectHref } from '../lib/caseStudies';
import { SITE_URL } from '../lib/seo';
import { breadcrumbSchema } from '../data/structuredData';
import { useProjects } from '../lib/projects';
import '../style/caseStudyState.css';

const StateMessage = ({ title, children, action }) => (
  <main className="case-state" id="main-content">
    <h1>{title}</h1>
    <p>{children}</p>
    {action}
  </main>
);

const CaseStudy = () => {
  const { id } = useParams();
  const [result, setResult] = useState({ slug: id, status: 'loading' });
  const { projects } = useProjects({ shuffle: false });

  useEffect(() => {
    let active = true;
    loadCaseStudy(id)
      .then((next) => active && setResult({ slug: id, ...next }))
      .catch(() => active && setResult({ slug: id, status: 'error' }));
    return () => {
      active = false;
    };
  }, [id]);

  const status = result.slug === id ? result.status : 'loading';
  const { record, project } = result;
  const nextHref = useMemo(
    () => (status === 'ready' ? nextProjectHref(projects, project) : ''),
    [status, projects, project]
  );
  const meta = status === 'ready' ? caseStudyMeta(record) : null;
  const canonical = meta ? `${SITE_URL}${meta.path}` : '';

  return (
    <div className="case-study-page">
      <Nav />
      {status === 'loading' && (
        <>
          <PendingSEO title="Case Study" description="A Strix Production case study covering the client brief, our design and development approach, and the results delivered for the brand." />
          <div className="case-state" role="status" aria-live="polite">
            <p>Loading case study…</p>
          </div>
        </>
      )}
      {status === 'error' && (
        <>
          <PendingSEO title="Case study unavailable" description="This Strix Production case study could not be loaded right now. Please try again or browse our other projects." />
          <StateMessage
            title="We couldn't load this case study"
            action={
              <button type="button" className="case-state__action" onClick={() => window.location.reload()}>
                Try again
              </button>
            }
          >
            Check your connection and try again.
          </StateMessage>
        </>
      )}
      {status === 'not-found' && (
        <>
          <SEO title="Case study not found" description="This Strix Production case study is unavailable. It may have been moved or unpublished. Browse our other projects instead." noindex />
          <StateMessage
            title="Case study not found"
            action={
              <Link className="case-state__action" to="/works">
                Browse our projects
              </Link>
            }
          >
            This project doesn't have a published case study yet.
          </StateMessage>
        </>
      )}
      {status === 'ready' && (
        <>
          <SEO
            title={meta.title}
            description={meta.description}
            canonical={meta.path}
            ogImage={meta.image}
            ogImageAlt={record.title}
            type={meta.type}
            schemas={[
              {
                '@context': 'https://schema.org',
                '@type': 'CreativeWork',
                name: record.title,
                headline: meta.title,
                description: meta.description,
                url: canonical,
                image: /^https:\/\//i.test(meta.image) ? meta.image : undefined,
                creator: { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: 'Strix Production', url: `${SITE_URL}/` },
                keywords: record.services.length ? record.services.join(', ') : undefined,
              },
              breadcrumbSchema([
                { name: 'Home', url: `${SITE_URL}/` },
                { name: 'Works', url: `${SITE_URL}/works` },
                { name: record.title, url: canonical },
              ]),
            ]}
          />
          <CaseStudyView record={record} nextHref={nextHref} canonical={canonical} />
        </>
      )}
      <Footer />
    </div>
  );
};

export default CaseStudy;
