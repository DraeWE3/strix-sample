import { BOOKING_URL } from '../../lib/booking';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { initContinuousCarousels } from '../shared/continuousCarousel';
import BlogSummaryLinks from '../blog/BlogSummaryLinks';
import { TEMPLATES } from '../../lib/caseStudies';
import '../../style/caseStudyTemplates/base.css';
import '../../style/caseStudyTemplates/layout.css';
import '../../style/caseStudyTemplates/production.css';
import '../../style/caseStudyTemplates/mvp.css';
import '../../style/caseStudyTemplates/shipped.css';

const WHATSAPP_URL = 'https://wa.me/919958844094';
const PROJECTS_URL = '/works';

const art = (name) => `/case-study/figma/${name}`;

const TECH_ICONS = {
  Figma: '981e2.svg',
  Illustrator: '06e3a.svg',
  Photoshop: '81d2e.svg',
  CSS3: '45f12.svg',
  HTML5: '11698.svg',
  React: 'f1caf.svg',
  Tailwind: '57343.svg',
  'Next.js': 'nextjs.svg',
  JavaScript: '1c054.svg',
  'After Effects': '655d2.svg',
  Blender: '8562e.svg',
  'Premiere Pro': 'a833b.svg',
};

const STEP_LAYOUTS = {
  1: ['discovery'],
  2: ['discovery', 'launch'],
  3: ['discovery', 'design', 'launch'],
  4: ['discovery', 'design', 'development', 'launch'],
};
const RESULT_CLASSES = ['downloads', 'trending', 'dropoff', 'rating'];
const EXPERIENCE_ANCHORS = {
  [TEMPLATES.DESIGN_DEVELOPMENT]: '#responsive-design',
  [TEMPLATES.PRODUCTION]: '#creative-directions',
  [TEMPLATES.MVP]: '#creative-directions',
};

const lines = (text) =>
  text.split('\n').map((line, index) => (
    <span key={index}>
      {index > 0 && <br />}
      {line}
    </span>
  ));

function ResponsiveGallery({ images }) {
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const el = viewportRef.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 1, end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 1 });
  };

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [images]);

  const step = (direction) => {
    const el = viewportRef.current;
    if (!el) return;
    const card = el.querySelector('.case-phone');
    const gap = parseFloat(getComputedStyle(el.firstElementChild).columnGap) || 0;
    el.scrollBy({ left: direction * ((card?.getBoundingClientRect().width || el.clientWidth * 0.5) + gap), behavior: 'smooth' });
  };

  const onPointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    dragRef.current = { x: event.clientX, left: viewportRef.current.scrollLeft };
    viewportRef.current.classList.add('is-dragging');
    viewportRef.current.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (!dragRef.current) return;
    viewportRef.current.scrollLeft = dragRef.current.left - (event.clientX - dragRef.current.x);
  };
  const endDrag = () => {
    dragRef.current = null;
    viewportRef.current?.classList.remove('is-dragging');
  };

  return (
    <>
      <div
        ref={viewportRef}
        className="case-carousel case-responsive__viewport"
        role="region"
        aria-label="Responsive app screens. Scroll, drag or use the arrow controls to explore."
        tabIndex={0}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
          else if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
        }}
      >
        <div className="case-responsive__track">
          {images.map((image, index) => (
            <article key={`${image.src}-${index}`} className="case-phone">
              <img src={image.src} alt={image.alt} draggable="false" loading="lazy" />
            </article>
          ))}
        </div>
      </div>
      {images.length > 1 ? (
        <div className="case-responsive__controls" aria-label="Responsive gallery controls">
          <button className="case-carousel-arrow" type="button" disabled={edge.start} onClick={() => step(-1)} aria-label="Previous app screen">
            <span className="case-carousel-arrow__left">
              <img src={art('c175d.svg')} alt="" aria-hidden="true" loading="lazy" />
            </span>
          </button>
          <button className="case-carousel-arrow" type="button" disabled={edge.end} onClick={() => step(1)} aria-label="Next app screen">
            <span>
              <img src={art('a8ad6.svg')} alt="" aria-hidden="true" loading="lazy" />
            </span>
          </button>
        </div>
      ) : null}
    </>
  );
}

const Rule = () => (
  <div className="case-section-rule" aria-hidden="true">
    <span>
      <img src={art('b334d.svg')} alt="" loading="lazy" />
    </span>
  </div>
);

const SectionLink = ({ href, children, ...props }) =>
  /^https?:\/\//.test(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  );

const Gallery = ({ name, images, direction, align, speed, label, itemClass }) => (
  <div
    className="case-carousel case-concepts__row"
    data-carousel={name}
    data-direction={direction}
    data-initial-align={align}
    data-speed={speed}
    role="region"
    aria-label={label}
    tabIndex={0}
  >
    <div className="case-concepts__track" data-track>
      {images.map((image, index) => (
        <article key={`${image.src}-${index}`} className={itemClass}>
          <img src={image.src} alt={image.alt} draggable="false" loading="lazy" />
        </article>
      ))}
    </div>
  </div>
);

const VIDEO_FILE = /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)|\/video\/upload\//i;

const HeroMedia = ({ media, title }) => {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const playRef = useRef(null);
  const videoFile = !media.youtubeId && VIDEO_FILE.test(media.videoUrl || '');
  // Only YouTube is embedded in a frame; a direct video file plays natively; anything else just links out.
  const embedUrl = media.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${media.youtubeId}?autoplay=1&playsinline=1&rel=0`
    : videoFile
      ? media.videoUrl
      : '';
  const watchUrl = media.youtubeId ? `https://www.youtube.com/watch?v=${media.youtubeId}` : media.videoUrl;

  const close = () => {
    setPlaying(false);
    setFailed(false);
    requestAnimationFrame(() => playRef.current?.focus({ preventScroll: true }));
  };

  return (
    <div
      className={`case-hero__media${playing ? ' is-playing' : ''}`}
      data-media
      onKeyDown={(event) => {
        if (event.key === 'Escape' && playing) {
          event.preventDefault();
          close();
        }
      }}
    >
      {media.thumbnail && VIDEO_FILE.test(media.thumbnail) ? (
        <video
          className="case-hero__poster"
          src={media.thumbnail}
          aria-label={media.alt}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
      ) : media.thumbnail ? (
        <img
          className="case-hero__poster"
          src={media.thumbnail}
          alt={media.alt}
          width="866"
          height="503"
          fetchPriority="high"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
      ) : null}
      {embedUrl && !playing ? (
        <button ref={playRef} className="case-hero__play" type="button" aria-label={`Play ${title} video`} onClick={() => setPlaying(true)}>
          <span className="case-hero__play-art" aria-hidden="true">
            <img src={art('f3654.svg')} alt="" />
          </span>
        </button>
      ) : null}
      {playing ? (
        <div className="case-hero__video">
          {videoFile ? (
            <video
              className="case-media-player"
              src={embedUrl}
              aria-label={`${title} video`}
              controls
              autoPlay
              playsInline
              onError={() => setFailed(true)}
            />
          ) : (
            <iframe
              className="case-media-player"
              src={embedUrl}
              title={`${title} video`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
              referrerPolicy="strict-origin-when-cross-origin"
              onError={() => setFailed(true)}
            />
          )}
          {failed ? (
            <div className="case-media-status" role="status">
              <p>This video cannot play here.</p>
              <a href={watchUrl} target="_blank" rel="noopener noreferrer">
                Open video ↗
              </a>
            </div>
          ) : null}
        </div>
      ) : null}
      {playing ? (
        // Outside the player, so it never covers YouTube's own controls.
        <button type="button" className="case-media-close" aria-label="Close video" onClick={close}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
};

// Kept short so the prefilled ?q= URL stays well under provider length limits.
const buildSummaryPrompt = (record, canonical) =>
  [
    `Summarize this Strix Production case study in 5 concise points: ${canonical}`,
    '',
    `Project: ${record.title}`,
    record.services.length ? `Services: ${record.services.join(', ')}` : '',
    record.industry ? `Industry: ${record.industry}` : '',
    record.about ? `\n${record.about.slice(0, 1200)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

const ShippedSection = ({ shipped }) => (
  <>
    <section id="what-we-shipped" className="mvp-shipped" aria-labelledby="mvp-shipped-title">
      <h2 className="case-section-title mvp-shipped__title" id="mvp-shipped-title" data-reveal>
        What we shipped
      </h2>
      <div className="mvp-shipped__content">
        <ul className="mvp-shipped__list" data-reveal>
          {shipped.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <figure className="mvp-shipped__card" data-reveal>
          {shipped.image.src ? <img className="mvp-shipped__image" src={shipped.image.src} alt={shipped.image.alt} width="597" height="340" loading="lazy" /> : null}
          <figcaption className="mvp-shipped__caption">
            <h3 className="mvp-shipped__label">{shipped.label}</h3>
            {shipped.outcome ? (
              <div className="mvp-shipped__result">
                <p className="mvp-shipped__eyebrow">Outcome</p>
                <p className="mvp-shipped__outcome">{shipped.outcome}</p>
              </div>
            ) : null}
          </figcaption>
        </figure>
      </div>
    </section>
    <div className="case-section-rule mvp-shipped-rule" aria-hidden="true">
      <span>
        <img src={art('b334d.svg')} alt="" loading="lazy" />
      </span>
    </div>
  </>
);

// Exported styleguide boards often carry a soft transparent margin; measure the opaque
// area so the board can crop to it and the artwork fits the box exactly.
const measureOpaqueBox = (img) => {
  try {
    const scale = Math.min(1, 2000 / img.naturalWidth);
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);
    const opaque = (x, y) => data[(y * w + x) * 4 + 3] >= 250;
    let left = 0;
    let right = w - 1;
    let bottom = h - 1;
    let top = 0;
    const mid = Math.floor(h / 2);
    while (left < w && !opaque(left, mid)) left += 1;
    while (right > left && !opaque(right, mid)) right -= 1;
    const bright = (x, y) => data[(y * w + x) * 4] > 200 && data[(y * w + x) * 4 + 1] > 200 && data[(y * w + x) * 4 + 2] > 200;
    // The artwork can carry a baked-in 1px light rule along its top edge; crop it off.
    while (top < 12 && (!opaque(Math.floor(w / 2), top) || bright(Math.floor(w / 2), top))) top += 1;
    while (bottom > 0 && !opaque(Math.floor(w / 2), bottom)) bottom -= 1;
    const x0 = (left + 1) / scale;
    const x1 = (right - 1) / scale;
    const y0 = (top + 1) / scale;
    const y1 = (bottom - 1) / scale;
    const cropW = x1 - x0;
    if (cropW < img.naturalWidth * 0.8 || y1 - y0 < img.naturalHeight * 0.8) return null;
    return {
      '--sg-img-width': `${(img.naturalWidth / cropW) * 100}%`,
      '--sg-img-left': `${(-x0 / cropW) * 100}%`,
      '--sg-img-top': `${(-y0 / cropW) * 100}%`,
      '--sg-ratio': `${cropW} / ${y1 - y0}`,
    };
  } catch {
    return null;
  }
};

const StyleGuideBoard = ({ image }) => {
  const [crop, setCrop] = useState(null);
  return (
    <div className="case-styleguide__board" data-reveal style={crop || undefined}>
      <img
        className="case-styleguide__custom"
        src={image.src}
        alt={image.alt}
        loading="lazy"
        crossOrigin="anonymous"
        onLoad={(event) => setCrop(measureOpaqueBox(event.currentTarget))}
      />
    </div>
  );
};

const StyleGuide = ({ image }) => (
  <>
    <section className="case-styleguide" id="design-system" aria-labelledby="case-styleguide-title">
      <h2 id="case-styleguide-title" className="case-section-title" data-reveal>
        Styleguide / Design System
      </h2>
      <p className="case-styleguide__sub" data-reveal>
        Typography, colour palette and brand marks that keep the product consistent.
      </p>
      <StyleGuideBoard image={image} />
    </section>
    <Rule />
  </>
);

const Technologies = ({ technologies }) => {
  const groups = [
    ['design', 'Design'],
    ['development', 'Development'],
    ['production', 'Production'],
  ].filter(([key]) => technologies[key].length);
  if (!groups.length) return null;

  return (
    <section className="case-technologies" id="case-technologies" aria-labelledby="case-technologies-heading">
      <h2 id="case-technologies-heading" data-reveal>
        Technologies and tools
      </h2>
      <div className={`case-tech-groups${groups.length === 1 ? ' case-tech-groups--single' : groups.length === 2 ? ' case-tech-groups--double' : ''}`}>
        {groups.map(([key, label]) => (
          <div className="case-tech-group" key={key} data-reveal>
            <h3>{label}</h3>
            <ul className="case-tech-list" aria-label={`${label} tools`}>
              {technologies[key].map((name) => (
                <li key={name}>
                  <span className={`case-tech-icon${name === 'Blender' ? ' case-tech-icon--blender' : ''}${TECH_ICONS[name] ? '' : ' case-tech-icon--text'}`} title={name}>
                    {TECH_ICONS[name] ? <img src={art(TECH_ICONS[name])} alt={name} loading="lazy" /> : name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

const Results = ({ results }) => (
  <section className={`case-results${results.length !== 4 ? ' case-results--custom' : ''}`} id="case-results" aria-labelledby="case-results-heading">
    <div className="case-results-intro" data-reveal>
      <h2 id="case-results-heading">Results</h2>
    </div>
    <div className="case-results-grid">
      {results.map((result, index) => (
        <article key={`${result.title}-${index}`} className={`case-result case-result--${RESULT_CLASSES[index % 4]}`} data-reveal>
          <h3>{lines(result.title)}</h3>
          <p>{lines(result.description)}</p>
        </article>
      ))}
    </div>
  </section>
);

const Connect = () => (
  <section className="case-connect" aria-labelledby="case-connect-heading">
    <h2 id="case-connect-heading" data-reveal>
      Working on
      <br />
      something similar?
    </h2>
    <div className="case-connect-card" data-reveal>
      <div className="case-connect-light case-connect-light--left" aria-hidden="true">
        <span>
          <img src={art('3d22a.svg')} alt="" loading="lazy" />
        </span>
      </div>
      <div className="case-connect-light case-connect-light--right" aria-hidden="true">
        <span>
          <img src={art('e7e25.svg')} alt="" loading="lazy" />
        </span>
      </div>
      <div className="case-connect-body">
        <h3>Book a free call.</h3>
        <p>We will tell you exactly how we would approach your project.</p>
        <div className="case-connect-actions">
          <a className="case-contact-pill case-contact-pill--call" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            <img className="case-pill-border" src={art('6d4be.svg')} alt="" loading="lazy" />
            <span className="case-pill-glow">
              <img src={art('677a9.svg')} alt="" loading="lazy" />
            </span>
            <span className="case-pill-content">
              <span>Book a free call</span>
              <span className="case-pill-arrow">
                <span>
                  <img src={art('e23f5.svg')} alt="" loading="lazy" />
                </span>
              </span>
            </span>
          </a>
          <a className="case-contact-pill case-contact-pill--whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <img className="case-pill-border" src={art('48aa2.svg')} alt="" loading="lazy" />
            <span className="case-pill-glow">
              <img src={art('be393.svg')} alt="" loading="lazy" />
            </span>
            <span className="case-pill-content">
              <span>Whatsapp</span>
              <img src={art('75bd3.svg')} alt="" loading="lazy" />
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
);

const NextProject = ({ href }) => (
  <section className="case-next" aria-label="Explore another project">
    <a className="case-next-link" href={href} aria-label="View next project">
      <span className="case-next-art" aria-hidden="true">
        <span className="case-next-glow case-next-glow--left">
          <span>
            <img src={art('6c527.svg')} alt="" />
          </span>
        </span>
        <span className="case-next-glow case-next-glow--right">
          <span>
            <img src={art('fcdd3.svg')} alt="" />
          </span>
        </span>
        <span className="case-next-ring">
          <span>
            <img src={art('a9b34.svg')} alt="" />
          </span>
        </span>
        <span className="case-next-arrow">
          <img src={art('974ed.svg')} alt="" />
        </span>
      </span>
      <span className="case-next-label">Next Project</span>
    </a>
  </section>
);

const Atmosphere = () => (
  <div className="case-atmosphere" aria-hidden="true">
    <div className="case-hero-arch">
      <div className="case-hero-arch__haze" />
    </div>
    <img className="case-ambient-top--left" src={art('73bb6.svg')} alt="" />
    <img className="case-ambient-top--right" src={art('73bb6.svg')} alt="" />
    <img className="case-ambient-first--left" src={art('8e065.svg')} alt="" />
    <img className="case-ambient-first--right" src={art('8e065.svg')} alt="" />
    <img className="case-ambient-middle--left" src={art('a190f.svg')} alt="" />
    <div className="case-ambient-middle--right">
      <span>
        <img src={art('72dc1.svg')} alt="" />
      </span>
    </div>
    <img className="case-ambient-last" src={art('ea982.svg')} alt="" />
  </div>
);

/**
 * Renders a mapped case study (see `mapCaseStudy`) with the layout for its template.
 * @param {{ record: ReturnType<typeof import('../../lib/caseStudies').mapCaseStudy>, nextHref: string, canonical: string }} props
 */
const CaseStudyView = ({ record, nextHref, canonical }) => {
  const rootRef = useRef(null);
  const { template } = record;
  const isMvp = template === TEMPLATES.MVP;
  const isDesign = template === TEMPLATES.DESIGN_DEVELOPMENT;
  const [rowOne, rowTwo] = record.concepts;
  const conceptCount = rowOne.length + rowTwo.length;
  const conceptsTitle = isDesign ? 'Initial concepts' : 'Creative Directions';
  const hasDesignSystem = Boolean(record.designSystem.image.src);
  const experience = record.experienceUrl || EXPERIENCE_ANCHORS[template];
  const meta = [
    ['Industry', record.industry],
    ['Country', record.country],
    ['Services', record.services.map((s) => ({ 'UI/UX': 'UX/UI', Website: 'Web', Application: 'App' })[s] || s).join(' / ')],
  ].filter(([, value]) => value);
  const bentoImages = record.aboutImages;

  useLayoutEffect(() => initContinuousCarousels(rootRef.current), [record]);

  useEffect(() => {
    const root = rootRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer;
    let frame = 0;

    const reveal = () => {
      observer?.disconnect();
      root.classList.toggle('has-motion', !reduced.matches);
      const elements = [...root.querySelectorAll('[data-reveal]')];
      if (reduced.matches || !('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('is-visible'));
        return;
      }
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach(({ isIntersecting, target }) => {
            if (isIntersecting) {
              target.classList.add('is-visible');
              observer.unobserve(target);
            }
          }),
        { rootMargin: '0px 0px -35px', threshold: 0.08 }
      );
      elements.forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight) {
          el.classList.add('will-reveal');
          observer.observe(el);
        } else el.classList.add('is-visible');
      });
    };

    const progress = () => {
      frame = 0;
      const track = root.querySelector('.case-process__track');
      const marker = track?.querySelector('.case-process__marker');
      const bar = track?.querySelector('.case-process__progress');
      if (!track || !marker || !bar) return;
      const rect = track.getBoundingClientRect();
      const available = rect.height - marker.offsetHeight;
      const y = reduced.matches ? Math.min(80, available) : Math.max(0, Math.min(available, window.innerHeight * 0.55 - rect.top));
      marker.style.top = `${y}px`;
      bar.style.height = `${y + marker.offsetHeight * 0.5}px`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(progress);
    };
    const onMotionChange = () => {
      reveal();
      schedule();
    };

    reveal();
    schedule();
    document.addEventListener('scroll', schedule, { passive: true, capture: true });
    window.addEventListener('resize', schedule, { passive: true });
    reduced.addEventListener('change', onMotionChange);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener('scroll', schedule, { capture: true });
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', onMotionChange);
    };
  }, [record]);

  return (
    <div className="strix-case" data-template={template} ref={rootRef}>
      <Atmosphere />
      <a className="case-return" href={PROJECTS_URL}>
        <img src={art('a9103.svg')} alt="" aria-hidden="true" />
        <span>Return to Projects</span>
      </a>
      <main id="main-content">
        <section className="case-upper" aria-labelledby="case-overview-title">
          <header className="case-hero">
            <h1 id="case-overview-title" className={`case-hero__heading${record.serviceLinks.length ? ' has-tags' : ''}`}>
              Project Overview
            </h1>
            {record.serviceLinks.length ? (
              <ul className="case-hero__tags" aria-label="Project services">
                {record.serviceLinks.map((service) => (
                  <li key={service.slug}><Link className="case-hero__tag" to={service.href}>{service.label}</Link></li>
                ))}
              </ul>
            ) : null}
            <HeroMedia key={record.id} media={record.media} title={record.title} />
            <h2 className="case-hero__title">{record.title}</h2>
            <BlogSummaryLinks subject="case study" prompt={buildSummaryPrompt(record, canonical)} />
          </header>
          <dl className="case-meta" aria-label="Project details" data-reveal>
            <div className="case-meta__item">
              <dt>Client</dt>
              <dd className="case-meta__logo">
                {record.client.logo ? <img src={record.client.logo} alt={record.client.name || record.title} width="182" height="67" loading="lazy" /> : <span>{record.client.name || record.title}</span>}
              </dd>
            </div>
            {meta.map(([label, value]) => (
              <div className="case-meta__item" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {record.about ? (
            <section className="case-about" aria-labelledby="case-about-title" data-reveal>
              <h2 id="case-about-title">About project</h2>
              <p>{record.about}</p>
            </section>
          ) : null}
          {bentoImages.length ? (
            <div className="case-bento" aria-label="Project design highlights">
              {['feature', 'detail', 'mobile'].map((slot, index) =>
                bentoImages[index] ? (
                  <figure key={slot} className={`case-bento__${slot}`} data-reveal>
                    <img src={bentoImages[index].src} alt={bentoImages[index].alt} loading="lazy" />
                  </figure>
                ) : null
              )}
            </div>
          ) : null}
          <SectionLink className="case-experience" href={experience}>
            <img className="case-experience__rim" src={art('3e10a.svg')} alt="" aria-hidden="true" />
            <span className="case-experience__mask" aria-hidden="true">
              <img src={art('51ad2.svg')} alt="" />
            </span>
            <span className="case-experience__content">
              <span>Experience</span>
              <span className="case-experience__arrow" aria-hidden="true">
                <img src={art('e23f5.svg')} alt="" />
              </span>
            </span>
          </SectionLink>
        </section>

        <div className="case-middle">
          {isMvp && record.shipped ? (
            <>
              <Rule />
              <ShippedSection shipped={record.shipped} />
            </>
          ) : null}
          {record.process.length ? (
            <>
              <Rule />
              <section className={`case-process${record.process.length > 4 ? ' case-process--custom' : ''}`} id="process" aria-labelledby="case-process-title">
                <h2 id="case-process-title" className="case-section-title" data-reveal>
                  The Process
                </h2>
                <div className="case-process__timeline">
                  <div className="case-process__track" aria-hidden="true">
                    <span className="case-process__progress" />
                    <span className="case-process__marker" />
                    <span className="case-process__track-end" />
                  </div>
                  <ol className="case-process__steps">
                    {record.process.map((step, index) => (
                      <li key={`${step.title}-${index}`} className={`case-process__step case-process__step--${STEP_LAYOUTS[record.process.length]?.[index] || 'extra'}`} data-process-step={index + 1} data-reveal>
                        <span className="case-process__icon" aria-hidden="true">
                          <span className="case-process__native-icon">
                            <img src={art('ecd12.svg')} alt="" loading="lazy" />
                          </span>
                        </span>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            </>
          ) : null}
          {conceptCount ? (
            <>
              <Rule />
              <section className="case-concepts" id="creative-directions" aria-labelledby="case-concepts-title">
                <header className="case-concepts__header">
                  <h2 id="case-concepts-title" className="case-section-title" data-reveal>
                    {conceptsTitle}
                  </h2>
                </header>
                <div className="case-concepts__rows">
                  {rowOne.length ? <Gallery name="concepts-a" images={rowOne} direction="forward" align="center" speed="24" label={`${conceptsTitle} gallery, row one`} itemClass="case-concept" /> : null}
                  {rowTwo.length ? <Gallery name="concepts-b" images={rowTwo} direction="reverse" align="center" speed="24" label={`${conceptsTitle} gallery, row two`} itemClass="case-concept" /> : null}
                </div>
              </section>
            </>
          ) : null}
          {hasDesignSystem ? (
            <>
              <Rule />
              <StyleGuide image={record.designSystem.image} />
            </>
          ) : null}
          {isDesign && record.responsiveImages.length ? (
            <>
              {!hasDesignSystem ? <Rule /> : null}
              <section className="case-responsive" id="responsive-design" aria-labelledby="case-responsive-title">
                <h2 id="case-responsive-title" className="case-section-title" data-reveal>
                  Responsive
                </h2>
                <ResponsiveGallery images={record.responsiveImages.slice(0, 8)} />
              </section>
              <Rule />
            </>
          ) : null}
        </div>

        <Technologies technologies={record.technologies} />
        {record.results.length ? (
          <>
            <div className="case-lower-separator" aria-hidden="true">
              <span>
                <img src={art('b334d.svg')} alt="" loading="lazy" />
              </span>
            </div>
            <Results results={record.results} />
          </>
        ) : null}
        <Connect />
        {nextHref ? <NextProject href={nextHref} /> : null}
      </main>
    </div>
  );
};

export default CaseStudyView;
