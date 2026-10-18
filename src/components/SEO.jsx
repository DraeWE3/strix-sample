import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import {
  BRAND,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  canonicalPath,
  canonicalUrl,
  cleanDescription,
  fullTitle,
  socialImage,
} from '../lib/seo';

// The build writes each page's head with `data-prerender="<canonical path>"`.
const prerenderedTags = () => document.head.querySelectorAll('[data-prerender]');

const SEO = ({ title, description, canonical, ogImage, ogImageAlt, schema, schemas, type = 'website', noindex = false }) => {
  const { pathname } = useLocation();
  const titleText = fullTitle(title);
  const descriptionText = cleanDescription(description);
  const url = canonical ? canonicalUrl(canonical.replace(/^https?:\/\/[^/]+/i, '')) : canonicalUrl(pathname);
  const image = socialImage(ogImage);
  const imageAlt = image === DEFAULT_OG_IMAGE ? DEFAULT_OG_IMAGE_ALT : ogImageAlt || titleText;
  const schemaList = schemas ? (Array.isArray(schemas) ? schemas : [schemas]) : schema ? [schema] : [];

  // The live tags below replace the build's head only once they are rendered.
  useEffect(() => prerenderedTags().forEach((node) => node.remove()), []);

  return (
    <Helmet>
      <title>{titleText}</title>
      <meta name="description" content={descriptionText} />
      <meta name="keywords" content="web design agency, web development, MVP development, UI/UX design, brand design, digital agency, scalable technology, startup MVP, full-stack development, creative agency, production services" />
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:title" content={titleText} />
      <meta property="og:description" content={descriptionText} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={titleText} />
      <meta name="twitter:description" content={descriptionText} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
      <meta name="language" content="English" />
      <meta name="author" content="Strix" />
      {schemaList.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

/**
 * For loading and temporary-error states: keeps the build's prerendered head
 * for this URL (so crawlers and share previews never see a placeholder or a
 * noindex caused by a network blip), and falls back to `<SEO>` otherwise.
 */
export const PendingSEO = (props) => {
  const { pathname } = useLocation();
  const [hasPrerendered] = useState(() =>
    [...prerenderedTags()].some((node) => node.getAttribute('data-prerender') === canonicalPath(pathname))
  );
  return hasPrerendered ? null : <SEO {...props} />;
};

export default SEO;
