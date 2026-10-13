import { Link } from 'react-router-dom';
import { blogHref, formatBlogDate } from '../../lib/blogs';

const BlogCard = ({ blog, saved, onToggleSave, style }) => (
  <article className="blog-card" style={style}>
    <Link className="blog-card__link" to={blogHref(blog)} aria-label={`Read ${blog.cardTitle}`}>
      <span className="blog-card__visual">
        <span className="blog-card__crop">
          {blog.image && <img src={blog.image} alt={blog.cardTitle} loading="lazy" decoding="async" width="1024" height="683" />}
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
