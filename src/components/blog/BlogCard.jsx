import { Link } from 'react-router-dom';
import { blogHref, formatBlogDate } from '../../lib/blogs';
import { getSharpImage, getSharpSrcSet } from '../../lib/cloudinary';

// Card width per layout in blog-page.css: 1 column under 441px, otherwise 2 columns.
const CARD_SIZES = '(max-width: 440px) calc(100vw - 40px), (max-width: 760px) calc(50vw - 30px), min(40vw, 540px)';

const BlogCard = ({ blog, saved, onToggleSave, style }) => (
  <article className="blog-card" style={style}>
    <Link className="blog-card__link" to={blogHref(blog)} aria-label={`Read ${blog.cardTitle}`}>
      <span className="blog-card__visual">
        <span className="blog-card__crop">
          {blog.image && (
            <img
              src={getSharpImage(blog.image, 800)}
              srcSet={getSharpSrcSet(blog.image, [480, 800, 1200, 1600])}
              sizes={CARD_SIZES}
              alt={blog.cardTitle}
              loading="lazy"
              decoding="async"
              width="1600"
              height="900"
            />
          )}
        </span>
      </span>
      <div className="blog-card__details">
        {blog.category && <span className="blog-tag">{blog.category}</span>}
        {blog.date && <time dateTime={blog.date}>{formatBlogDate(blog.date)}</time>}
        <h2>{blog.cardTitle}</h2>
      </div>
    </Link>
    {onToggleSave && (
      <button
        type="button"
        className="blog-card__save"
        aria-pressed={saved}
        aria-label={`${saved ? 'Unsave' : 'Save'} ${blog.cardTitle}`}
        onClick={() => onToggleSave(blog.id)}
      >
        {saved ? '★' : '☆'}
      </button>
    )}
  </article>
);

export default BlogCard;
