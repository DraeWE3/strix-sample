import { Link } from 'react-router-dom';
import BrandMark from '../../assets/img/blog/figma/da6fe.svg';
import Upwork from '../../assets/img/blog/figma/ebfa0.svg';
import Behance from '../../assets/img/blog/figma/81cc2.svg';
import Instagram from '../../assets/img/blog/figma/39972.svg';
import XIcon from '../../assets/img/blog/figma/0e2f9.svg';
import LinkedIn from '../../assets/img/blog/figma/d9378.svg';
import Rule from '../../assets/img/blog/figma/0ea57.png';
import SearchIcon from '../../assets/img/blog/figma/22fae.svg';

const SOCIALS = [
  { href: 'https://www.upwork.com/agencies/1799430219619033088/', label: 'Strix on Upwork', icon: Upwork },
  { href: 'https://www.behance.net/strixproductions', label: 'Strix on Behance', icon: Behance },
  { href: 'https://www.instagram.com/strix_productions', label: 'Strix on Instagram', icon: Instagram },
  { href: 'https://x.com/strixproduction', label: 'Strix on X', icon: XIcon },
  { href: 'https://www.linkedin.com/company/strix-production/', label: 'Strix on LinkedIn', icon: LinkedIn },
];

export const ALL_TOPICS = 'All Topics';
export const SAVED_TOPIC = 'Saved';

const BlogSidebar = ({ search, onSearch, topic, onTopic, categories, savedCount }) => {
  const topics = [ALL_TOPICS, ...categories.pinned, SAVED_TOPIC, ...categories.rest];

  return (
    <aside className="blog-sidebar" aria-label="Explore the blog">
      <div className="blog-sidebar__inner">
        <Link className="blog-brand" to="/blog" aria-label="Strix Production blog">
          <span className="blog-brand__mark"><img src={BrandMark} alt="" /></span>
          <span>Strix<br />Production</span>
        </Link>
        <p className="blog-sidebar__intro">
          Here’s where we let you in — the sketches, the sparks, the lessons, &amp; the late-night thoughts that shape the work you see.
        </p>
        <div className="blog-socials" aria-label="Strix social links">
          {SOCIALS.map(({ href, label, icon }) => (
            <a key={href} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"><img src={icon} alt="" /></a>
          ))}
        </div>
        <img className="blog-sidebar__rule" src={Rule} alt="" />
        <form className="blog-search" role="search" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="blog-search-input">Search articles</label>
          <img src={SearchIcon} alt="" />
          <input
            id="blog-search-input"
            type="search"
            placeholder="Search Topic"
            autoComplete="off"
            value={search}
            maxLength={200}
            onChange={(event) => onSearch(event.target.value)}
          />
          {search && <button type="button" className="blog-search__clear" aria-label="Clear search" onClick={() => onSearch('')}>×</button>}
        </form>
        <h2 className="blog-sidebar__heading">Categories</h2>
        <nav className="blog-categories" aria-label="Blog categories">
          {topics.map((name) => (
            <button key={name} type="button" data-topic={name} aria-current={name === topic} onClick={() => onTopic(name)}>
              {name}
              {name === SAVED_TOPIC && savedCount > 0 && <span className="blog-saved-count">{savedCount}</span>}
            </button>
          ))}
        </nav>
        <img className="blog-sidebar__rule" src={Rule} alt="" />
        <h2 className="blog-sidebar__heading">Explore More</h2>
        <div className="blog-explore">
          <Link to="/about">About Us</Link>
          <span aria-hidden="true">|</span>
          <Link to="/works">Our Work</Link>
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
