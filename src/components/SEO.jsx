import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, canonical, ogImage }) => {
    const fullTitle = title ? `${title} | Strix Production` : 'Strix Production';
    const fullDescription = description || "Strix Production - Premium Digital Design & Development Agency. We build MVPs, SaaS products, and high-end websites.";
    const canonicalUrl = canonical || `https://www.strixproduction.com${window.location.pathname}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={fullDescription} />
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDescription} />
            <meta property="og:url" content={canonicalUrl} />
            {ogImage && <meta property="og:image" content={ogImage} />}
        </Helmet>
    );
};

export default SEO;
