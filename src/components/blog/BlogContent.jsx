import { Fragment } from 'react';

const URL_PATTERN = /(https?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]])/g;

const Linkified = ({ text }) =>
  text.split(URL_PATTERN).map((part, index) =>
    index % 2 ? (
      <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    )
  );

const BlogContent = ({ blocks, headings, title }) => {
  const headingIds = new Map(headings.map((heading) => [heading.key, heading.id]));

  return blocks.map((block) => {
    if (block.type === 'subheading') return <h2 key={block.key} id={headingIds.get(block.key)}>{block.content}</h2>;
    if (block.type === 'keypoints') {
      return (
        <ul key={block.key}>
          {block.content.map((point, index) => <li key={index}><Linkified text={point} /></li>)}
        </ul>
      );
    }
    if (block.type === 'image') {
      return (
        <figure key={block.key}>
          <img src={block.content} alt={`Illustration for ${title}`} loading="lazy" decoding="async" />
        </figure>
      );
    }
    return block.content
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph, index) => <p key={`${block.key}-${index}`}><Linkified text={paragraph} /></p>);
  });
};

export default BlogContent;
