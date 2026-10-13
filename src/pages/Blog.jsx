import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Nav from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import BlogCard from '../components/blog/BlogCard';
import BlogSidebar, { ALL_TOPICS, SAVED_TOPIC } from '../components/blog/BlogSidebar';
import { useSavedBlogs } from '../components/blog/savedBlogs';
import { BLOG_SITE_URL, blogSearchText, useBlogCategories, useBlogs } from '../lib/blogs';
import '../style/fonts.css';
// Not used by this page; kept because other pages' mobile `.mobile-socials` layout relies on it loading globally.
import '../style/blogNav.css';
import '../style/blog-page.css';
import ReturnArrow from '../assets/img/mvp/a9103.svg';
import Atmosphere from '../assets/img/blog/figma/1617b.svg';
import LoadRim from '../assets/img/blog/figma/7c70a.svg';
import LoadGlow from '../assets/img/blog/figma/426e3.svg';

const PAGE_SIZE = 9;

const Blog = () => {
  const { blogs, loading, error } = useBlogs();
  const { saved, isSaved, toggle } = useSavedBlogs();
  const categories = useBlogCategories(blogs);
  const [params, setParams] = useSearchParams();
  const [limit, setLimit] = useState(PAGE_SIZE);

  const search = (params.get('q') || '').slice(0, 200);
  const requestedTopic = params.get('topic') || ALL_TOPICS;
  const topic = loading || [ALL_TOPICS, SAVED_TOPIC, ...categories.pinned, ...categories.rest].includes(requestedTopic) ? requestedTopic : ALL_TOPICS;

  const updateParams = (next) => {
    const merged = { q: search, topic, ...next };
    const query = {};
    if (merged.q) query.q = merged.q;
    if (merged.topic && merged.topic !== ALL_TOPICS) query.topic = merged.topic;
    setParams(query, { replace: true });
    setLimit(PAGE_SIZE);
  };

  const searchIndex = useMemo(() => new Map(blogs.map((blog) => [blog.id, blogSearchText(blog)])), [blogs]);

  const matches = useMemo(() => {
    const term = search.trim().toLowerCase();
    return blogs.filter(
      (blog) =>
        (topic === ALL_TOPICS || (topic === SAVED_TOPIC ? saved.includes(blog.id) : blog.category === topic)) &&
        (!term || searchIndex.get(blog.id).includes(term))
    );
  }, [blogs, topic, search, saved, searchIndex]);

  const shown = matches.slice(0, limit);
  const filtered = topic !== ALL_TOPICS || Boolean(search);
  const savedCount = blogs.filter((blog) => saved.includes(blog.id)).length;

  let status = null;
  if (loading) {
    status = (
      <div className="blog-grid" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="blog-card blog-card--placeholder">
            <span className="blog-card__visual" />
            <span className="blog-card__line" />
            <span className="blog-card__line blog-card__line--short" />
          </div>
        ))}
      </div>
    );
  } else if (error && !blogs.length) {
    status = (
      <div className="blog-empty" role="alert">
        <p>We couldn’t load articles right now.</p>
        <span>Please check your connection and try again.</span>
        <button type="button" onClick={() => window.location.reload()}>Try again ↗</button>
      </div>
    );
  } else if (!blogs.length) {
    status = (
      <div className="blog-empty">
        <p>No articles published yet.</p>
        <span>New stories are on the way. Check back soon.</span>
      </div>
    );
  } else if (!matches.length) {
    status = (
      <div className="blog-empty">
        <p>{topic === SAVED_TOPIC ? 'No saved articles yet.' : 'No articles found.'}</p>
        <span>{topic === SAVED_TOPIC ? 'Save an article to find it here later.' : 'Try another topic or clear your search.'}</span>
        <button type="button" onClick={() => updateParams({ q: '', topic: ALL_TOPICS })}>Show all articles ↗</button>
      </div>
    );
  }

  return (
    <div>
      <SEO
        title="Design, Tech & Creative Strategy Insights"
        description="Read expert articles on UI/UX design, web development, branding, and digital marketing trends from the creative minds at Strix Production."
        canonical={`${BLOG_SITE_URL}/blog`}
      />
      <Nav />
      <div className="blog-shell">
        <Link className="blog-return" to="/">
          <img src={ReturnArrow} alt="" width="13.13" height="8.25" />
          <span>Return to Homepage</span>
        </Link>
        <main className={`blog-main${filtered ? ' is-filtered' : ''}`}>
          <div className="blog-atmosphere" aria-hidden="true">
            <img className="blog-atmosphere__left" src={Atmosphere} alt="" />
            <img className="blog-atmosphere__right" src={Atmosphere} alt="" />
          </div>
          <div className="blog-layout">
            <BlogSidebar
              search={search}
              onSearch={(value) => updateParams({ q: value.slice(0, 200) })}
              topic={topic}
              onTopic={(value) => updateParams({ topic: value })}
              categories={categories}
              savedCount={savedCount}
            />
            <div className="blog-content">
              <header className="blog-hero">
                <div className="blog-hero__glow" aria-hidden="true"><span /></div>
                <h1><span>Our Space to</span><span>Think and Share</span></h1>
                <p>Expert Perspectives on Design, Development &amp; Product Strategy</p>
              </header>
              <section className="blog-results" aria-label="Articles" aria-busy={loading}>
                <p className="sr-only" role="status" aria-live="polite">
                  {loading ? 'Loading articles…' : `Showing ${shown.length} of ${matches.length} articles${topic === ALL_TOPICS ? '' : ` in ${topic}`}.`}
                </p>
                {status || (
                  <div className="blog-grid">
                    {shown.map((blog, index) => (
                      <BlogCard
                        key={blog.id}
                        blog={blog}
                        saved={isSaved(blog.id)}
                        onToggleSave={toggle}
                        style={{ '--delay': `${Math.min(index % PAGE_SIZE, 5) * 45}ms` }}
                      />
                    ))}
                  </div>
                )}
                {!status && shown.length < matches.length && (
                  <button type="button" className="blog-load" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
                    <img className="blog-load__rim" src={LoadRim} alt="" />
                    <span className="blog-load__glow" aria-hidden="true"><img src={LoadGlow} alt="" /></span>
                    <span className="blog-load__label">Load More</span>
                  </button>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
