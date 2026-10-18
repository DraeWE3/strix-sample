import { SITE_URL } from '../lib/seo';

const ORG_ID = `${SITE_URL}/#org`;
const LOGO = `${SITE_URL}/brand/strix-logo.png`;
const PHONE = '+91-8851313109';
const SOCIAL = ['https://www.instagram.com/strix_productions', 'https://x.com/strixproduction'];

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Strix Production',
  url: `${SITE_URL}/`,
  logo: LOGO,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: PHONE,
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: 'en',
  },
  sameAs: SOCIAL,
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#localbusiness`,
  name: 'Strix Production',
  image: LOGO,
  url: `${SITE_URL}/`,
  telephone: PHONE,
  parentOrganization: { '@id': ORG_ID },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Sec-62',
    addressLocality: 'Noida',
    postalCode: '201309',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 28.6229,
    longitude: 77.364,
  },
  sameAs: SOCIAL,
};

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What services does Strix Production provide?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Creative and technology services combine branding, design, development, and marketing to build a strong digital presence. Strix Production offers UI/UX design, web and app development, content creation, and marketing for impactful results.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which are the best startup branding agencies for digital-first businesses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Startup branding agencies help new businesses build a clear identity through strategy, design, and messaging. Strix Productions creates cohesive branding systems, visuals, and promotional content to help startups stand out and grow in competitive markets.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the top SaaS platform development company for scalable products?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SaaS platform development involves building cloud-based software accessible online without installation. Strix Production creates secure, scalable, and user-friendly SaaS solutions with strong performance, intuitive design, and reliable architecture for growing businesses.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes Strix Production a reliable digital design and development partner?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Effective digital experiences combine strategy, user-focused design, and modern technology. Strix Production delivers scalable development, strong branding, and engaging solutions to help businesses create impactful products and drive long-term growth.',
      },
    },
  ],
};

export const homeSchemas = [organizationSchema, localBusinessSchema, faqSchema];

/** Service pages: a Service offered by the organization. */
export const serviceSchema = ({ name, description, url }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url,
  provider: { '@id': ORG_ID, '@type': 'Organization', name: 'Strix Production', url: `${SITE_URL}/` },
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
