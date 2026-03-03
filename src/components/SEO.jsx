import { useEffect } from 'react';

const SEO = ({ title, description, canonical, ogImage }) => {
    useEffect(() => {
        // Update Title
        if (title) {
            document.title = `${title} | Strix Production`;
        }

        // Update Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = description || "Strix Production - Premium Digital Design & Development Agency. We build MVPs, SaaS products, and high-end websites.";

        // Update Canonical Tag
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.rel = 'canonical';
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.href = canonical || `https://www.strixproduction.com${window.location.pathname}`;

        // Update Open Graph Tags
        const updateOG = (property, content) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        updateOG('og:title', title ? `${title} | Strix Production` : 'Strix Production');
        updateOG('og:description', description || "Strix Production - Premium Digital Design & Development Agency.");
        updateOG('og:url', `https://www.strixproduction.com${window.location.pathname}`);
        if (ogImage) updateOG('og:image', ogImage);

    }, [title, description, canonical, ogImage]);

    return null;
};

export default SEO;
