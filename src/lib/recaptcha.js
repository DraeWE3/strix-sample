import { useEffect, useRef } from 'react';

// Set VITE_RECAPTCHA_SITE_KEY only after enabling reCAPTCHA v2 on the EmailJS template.
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
const CALLBACK = '__strixRecaptchaReady';

let loader = null;

const loadRecaptcha = () => {
  loader ||= new Promise((resolve, reject) => {
    window[CALLBACK] = () => resolve(window.grecaptcha);
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?onload=${CALLBACK}&render=explicit`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      loader = null;
      reject(new Error('reCAPTCHA could not be loaded.'));
    };
    document.head.appendChild(script);
  });
  return loader;
};

export const recaptchaEnabled = Boolean(SITE_KEY);

/**
 * Renders a reCAPTCHA v2 checkbox into `containerRef` while `active`.
 * @param {import('react').RefObject<HTMLElement>} containerRef
 * @param {boolean} active
 */
export const useRecaptcha = (containerRef, active) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!SITE_KEY || !active || !container) return undefined;
    let cancelled = false;
    loadRecaptcha()
      .then((grecaptcha) => {
        if (cancelled || container.childElementCount) return;
        widgetRef.current = grecaptcha.render(container, { sitekey: SITE_KEY, theme: 'dark' });
      })
      .catch((error) => console.error(error));
    return () => {
      cancelled = true;
      widgetRef.current = null;
    };
  }, [containerRef, active]);

  return {
    enabled: recaptchaEnabled,
    token: () => (widgetRef.current === null ? '' : window.grecaptcha.getResponse(widgetRef.current)),
    reset: () => {
      if (widgetRef.current !== null) window.grecaptcha.reset(widgetRef.current);
    },
  };
};
