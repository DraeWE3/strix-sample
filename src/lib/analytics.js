/**
 * Google Analytics only loads after the visitor accepts it in the cookie
 * banner. The choice is stored per browser; declining later disables the tag
 * and clears the GA cookies.
 */
const GA_ID = 'G-44Y051EWXT';
export const CONSENT_KEY = 'strix:consent:analytics';
export const CONSENT_OPEN_EVENT = 'strix:consent:open';

let loaded = false;

/** @returns {'granted' | 'denied' | null} */
export const readConsent = () => {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
};

export const loadAnalytics = () => {
  window[`ga-disable-${GA_ID}`] = false;
  if (loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
};

const clearAnalyticsCookies = () => {
  const parts = window.location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i += 1) domains.push(`; domain=.${parts.slice(i).join('.')}`);
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (!name.startsWith('_ga')) return;
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    });
  });
};

/** @param {boolean} granted */
export const setConsent = (granted) => {
  try {
    window.localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
  } catch {
    // Blocked storage: the choice applies to this visit only.
  }
  if (granted) {
    loadAnalytics();
  } else {
    window[`ga-disable-${GA_ID}`] = true;
    clearAnalyticsCookies();
  }
};

export const openConsentSettings = () => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
