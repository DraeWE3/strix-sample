import { BOOKING_URL } from '../lib/booking';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Nav from '../components/Navbar';
import Footer from '../components/Footer';
import SEO, { PendingSEO } from '../components/SEO';
import BlogCard from '../components/blog/BlogCard';
import BlogContent from '../components/blog/BlogContent';
import BlogSummaryLinks from '../components/blog/BlogSummaryLinks';
import { useSavedBlogs } from '../components/blog/savedBlogs';
import { BLOG_SITE_URL, blogHeadings, blogHref, blogMeta, formatBlogDate, relatedBlogs, useBlogs } from '../lib/blogs';
import '../style/fonts.css';
import '../style/blog-page.css';
import '../style/blog-article.css';
import LinkedInIcon from '../assets/img/blog/figma/4bc62.svg';
import FacebookIcon from '../assets/img/blog/figma/9c714.svg';
import XIcon from '../assets/img/blog/figma/f8920.svg';
import CopyIcon from '../assets/img/blog/figma/a1564.svg';
import AuthorGlowLeft from '../assets/img/blog/figma/ab6e7.svg';
import AuthorGlowRight from '../assets/img/blog/figma/1b34e.svg';
import AuthorLinkedIn from '../assets/img/blog/figma/88da1.svg';
import AuthorEmail from '../assets/img/blog/figma/5e398.svg';
import CtaRim from '../assets/img/blog/figma/1a428.svg';
import CtaArrow from '../assets/img/blog/figma/4acc0.svg';

const PROGRESS_OFFSET = 150;

const useReadingProgress = (targetRef, barRef, active) => {
  useEffect(() => {
    if (!active) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const target = targetRef.current;
      const bar = barRef.current;
      if (!target || !bar) return;
      const rect = target.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight + PROGRESS_OFFSET);
      const progress = Math.min(1, Math.max(0, (PROGRESS_OFFSET - rect.top) / distance));
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
    };
  }, [targetRef, barRef, active]);
};

const useActiveHeading = (headings) => {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    setActiveId(headings[0]?.id || '');
    if (!headings.length || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveId(entry.target.id)),
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );
    headings.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [headings]);
  return [activeId, setActiveId];
};

const ArticleState = ({ title, description, children, pending = false }) => (
  <div>
    {pending ? <PendingSEO title={title} description={description} /> : <SEO title={title} description={description} noindex />}
    <Nav />
    <div className="blog-shell article-shell">
      <main className="article-page article-page--state">
        <Link className="article-return" to="/blog"><span aria-hidden="true">←</span> Return to Blogs</Link>
        {children}
      </main>
    </div>
    <Footer />
  </div>
);

const BlogDetails = () => {
  const { id } = useParams();
  const { blogs, loading, error, confirmed } = useBlogs();
  const { isSaved, toggle } = useSavedBlogs();
  const blog = blogs.find((item) => item.id === id);
  const bodyRef = useRef(null);
  const progressRef = useRef(null);
  const [shareStatus, setShareStatus] = useState('');
  const [tocOpen, setTocOpen] = useState(() => !window.matchMedia('(max-width: 960px)').matches);

  const headings = useMemo(() => (blog ? blogHeadings(blog.content) : []), [blog]);
  const [activeId, setActiveId] = useActiveHeading(headings);
  useReadingProgress(bodyRef, progressRef, Boolean(blog));

  useEffect(() => setShareStatus(''), [id]);

  const jumpedFor = useRef('');
  useEffect(() => {
    if (!headings.length || jumpedFor.current === id) return;
    jumpedFor.current = id;
    let fragment = '';
    try {
      fragment = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    if (!headings.some((heading) => heading.id === fragment)) return;
    requestAnimationFrame(() => document.getElementById(fragment)?.scrollIntoView());
    setActiveId(fragment);
  }, [headings, setActiveId, id]);

  if (loading || (!blog && !error && !confirmed)) {
    return (
      <ArticleState pending title="Blog Article" description="An article from the Strix Production blog with insights on UI/UX design, web development, branding and video production for startups and brands.">
        <div className="article-loading" role="status" aria-live="polite">
          <span className="article-loading__title" />
          <span className="article-loading__cover" />
          <span className="sr-only">Loading article…</span>
        </div>
      </ArticleState>
    );
  }

  if (!blog) {
    // Only a published list confirmed by the server proves the article is gone; errors and cached answers are temporary.
    const failed = Boolean(error) || !confirmed;
    return (
      <ArticleState
        pending={failed}
        title={failed ? 'Blog unavailable' : 'Article not found'}
        description={failed ? 'This Strix Production blog article could not be loaded right now. Please try again or explore the latest stories on the blog.' : 'This Strix Production blog article is unavailable. It may have been moved or unpublished. Explore the latest stories on the blog.'}
      >
        <header className="article-hero article-hero--state">
          <h1>{failed ? 'Something went wrong' : 'Article not found'}</h1>
        </header>
        <p className="article-state-message">
          {failed
            ? 'We couldn’t load this article right now. Please check your connection and try again.'
            : 'This article is unavailable. It may have been moved or unpublished.'}
          <br />
          <Link to="/blog">Explore the latest stories</Link>
        </p>
      </ArticleState>
    );
  }

  const meta = blogMeta(blog);
  const canonical = `${BLOG_SITE_URL}${blogHref(blog)}`;
  const summaryPrompt = `Summarize this Strix Production article in 5 concise points: ${canonical}\n\n${[blog.title, blog.excerpt].filter(Boolean).join('\n\n')}`;
  const shareLinks = [
    { key: 'linkedin', label: 'Share on LinkedIn', icon: LinkedInIcon, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}` },
    { key: 'facebook', label: 'Share on Facebook', icon: FacebookIcon, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}` },
    { key: 'x', label: 'Share on X', icon: XIcon, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(blog.title)}` },
  ];
  const related = relatedBlogs(blogs, blog);
  const saved = isSaved(blog.id);
  const { author } = blog;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonical);
      setShareStatus('Link copied');
    } catch {
      setShareStatus('Copy this page URL from your address bar.');
    }
  };

  const jumpTo = (event, headingId) => {
    event.preventDefault();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(headingId)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    window.history.replaceState(null, '', `#${headingId}`);
    setActiveId(headingId);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || undefined,
    image: /^https:\/\//i.test(blog.coverImage) ? blog.coverImage : undefined,
    datePublished: blog.date || undefined,
    dateModified: blog.updatedAt || blog.date || undefined,
    mainEntityOfPage: canonical,
    articleSection: blog.category || undefined,
    author: author ? { '@type': 'Person', name: author.name } : { '@type': 'Organization', name: 'Strix Production' },
    publisher: { '@type': 'Organization', '@id': `${BLOG_SITE_URL}/#org`, name: 'Strix Production', url: BLOG_SITE_URL, logo: { '@type': 'ImageObject', url: `${BLOG_SITE_URL}/brand/strix-logo.png` } },
  };

  return (
    <div>
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={meta.path}
        ogImage={meta.image}
        ogImageAlt={blog.title}
        type={meta.type}
        schema={schema}
      />
      <Nav />
      <div className="blog-shell article-shell">
        <main className="article-page">
          <div className="article-progress" aria-hidden="true"><span ref={progressRef} /></div>
          <Link className="article-return" to="/blog"><span aria-hidden="true">←</span> Return to Blogs</Link>
          <header className="article-hero">
            <h1>{blog.title}</h1>
            <BlogSummaryLinks prompt={summaryPrompt} />
          </header>
          {blog.coverImage && (
            <figure className="article-cover">
              <img src={blog.coverImage} alt={blog.title} width="921" height="519" fetchPriority="high" />
            </figure>
          )}
          <div className="article-layout">
            <aside className="article-share" aria-label="Share this article">
              <span className="article-share__label">Share</span>
              {shareLinks.map(({ key, label, icon, href }) => (
                <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><img src={icon} alt="" /></a>
              ))}
              <button type="button" aria-label="Copy article link" onClick={copyLink}><img src={CopyIcon} alt="" /></button>
              <span className="article-share__status" role="status" aria-live="polite">{shareStatus}</span>
            </aside>
            <article className="article-content" aria-label="Article">
              <div className="article-meta">
                <p>
                  Posted: <time dateTime={blog.date}>{formatBlogDate(blog.date, 'article')}</time>
                  <span aria-hidden="true"> · </span>
                  <span>{blog.readTime} min read</span>
                  {blog.category && <><span aria-hidden="true"> · </span><span>{blog.category}</span></>}
                </p>
                <button className="article-save" type="button" aria-pressed={saved} onClick={() => toggle(blog.id)}>
                  {saved ? 'Saved' : 'Save article'}
                </button>
              </div>
              <div className="article-body" ref={bodyRef}>
                {blog.content.length ? (
                  <BlogContent blocks={blog.content} headings={headings} title={blog.title} />
                ) : (
                  <p className="article-body__empty">This article doesn’t have any content yet.</p>
                )}
              </div>
              {author && (
                <section className="article-author" aria-labelledby="article-author-name">
                  <div className="article-author__glow article-author__glow--left" aria-hidden="true"><img src={AuthorGlowLeft} alt="" /></div>
                  <div className="article-author__glow article-author__glow--right" aria-hidden="true"><img src={AuthorGlowRight} alt="" /></div>
                  {author.avatar && (
                    <div className="article-author__portrait"><img src={author.avatar} alt={author.name} loading="lazy" /></div>
                  )}
                  <div className="article-author__details">
                    <span className="article-author__eyebrow">About the author</span>
                    <h2 id="article-author-name">{author.name}</h2>
                    {author.role && <p className="article-author__role">{author.role}</p>}
                    {author.bio && <p className="article-author__bio">{author.bio}</p>}
                    {(author.linkedin || author.email) && (
                      <div className="article-author__links">
                        {/^https:\/\//.test(author.linkedin) && (
                          <a href={author.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${author.name} on LinkedIn`}><img src={AuthorLinkedIn} alt="" /></a>
                        )}
                        {author.email && (
                          <a href={`mailto:${author.email}`} aria-label={`Email ${author.name}`}><img src={AuthorEmail} alt="" /></a>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </article>
            <aside className="article-toc" aria-label="Table of contents">
              {headings.length > 0 && (
                <details open={tocOpen} onToggle={(event) => setTocOpen(event.currentTarget.open)}>
                  <summary>Table of contents</summary>
                  <nav aria-label="On this page">
                    <ol>
                      {headings.map((heading) => (
                        <li key={heading.id}>
                          <a href={`#${heading.id}`} aria-current={heading.id === activeId ? 'true' : undefined} onClick={(event) => jumpTo(event, heading.id)}>
                            {heading.text.replace(/^\d+\.\s*/, '')}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </details>
              )}
              <a className="article-cta-button" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                <img className="article-cta-button__rim" src={CtaRim} alt="" />
                <span>Book a free call</span>
                <span className="article-cta-button__arrow" aria-hidden="true"><img src={CtaArrow} alt="" /></span>
              </a>
            </aside>
          </div>
          {related.length > 0 && (
            <section className="article-related" aria-labelledby="article-related-title">
              <h2 id="article-related-title">Top Stories</h2>
              <div className="blog-grid article-related__grid">
                {related.map((item) => <BlogCard key={item.id} blog={item} />)}
              </div>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetails;
