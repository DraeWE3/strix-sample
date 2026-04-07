import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, canonical, ogImage }) => {
    const fullTitle = title ? `${title} | Strix Production` : 'Strix Production';
    const fullDescription = description || "Strix Production - Premium Digital Design & Development Agency. We build MVPs, SaaS products, and high-end websites.";
    const canonicalUrl = canonical || `https://www.strixproduction.com${window.location.pathname}`;
    const ogImageUrl = ogImage || './src/assets/img/link.webp';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={fullDescription} />
            <meta name="keywords" content="web design agency, web development, MVP development, UI/UX design, brand design, digital agency, scalable technology, startup MVP, full-stack development, creative agency, production services" />
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDescription} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={ogImageUrl} />
            <meta property="og:type" content="website" />
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={fullDescription} />
            <meta property="twitter:image" content={ogImageUrl} />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
            <meta name="author" content="Strix" />
        </Helmet>
    );
};

export default SEO;
