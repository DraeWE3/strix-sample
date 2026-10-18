/**
 * Client-side friction for the contact form. EmailJS can be called directly,
 * so the real limits are the EmailJS template's fixed recipient, its allowed
 * origins, rate limit and reCAPTCHA; this only stops casual bots and repeats.
 */
export const MIN_FILL_MS = 3000;
export const COOLDOWN_MS = 60 * 1000;
export const WINDOW_MS = 60 * 60 * 1000;
export const MAX_PER_WINDOW = 3;
export const HISTORY_KEY = 'strix:inquiries';

/**
 * @param {{ honeypot: string, startedAt: number, now: number, history: number[] }} input
 * @returns {null | 'bot' | 'too-fast' | 'cooldown' | 'limit'}
 */
export const checkSubmission = ({ honeypot, startedAt, now, history }) => {
  if (honeypot) return 'bot';
  if (now - startedAt < MIN_FILL_MS) return 'too-fast';
  const recent = history.filter((at) => now - at < WINDOW_MS);
  if (recent.some((at) => now - at < COOLDOWN_MS)) return 'cooldown';
  if (recent.length >= MAX_PER_WINDOW) return 'limit';
  return null;
};

/** @param {Pick<Storage, 'getItem'> | undefined} storage */
export const readHistory = (storage) => {
  try {
    const parsed = JSON.parse(storage?.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((value) => Number.isFinite(value)) : [];
  } catch {
    return [];
  }
};

/** @param {Pick<Storage, 'setItem'> | undefined} storage */
export const recordSubmission = (storage, history, now) => {
  const next = [...history.filter((at) => now - at < WINDOW_MS), now];
  try {
    storage?.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Private mode or blocked storage: the throttle is best-effort.
  }
  return next;
};

export const GUARD_MESSAGES = {
  'too-fast': 'That was quick! Please take a moment to review your details, then send again.',
  cooldown: 'Your last inquiry was just sent. Please wait a minute before sending another.',
  limit: 'You’ve sent several inquiries in the last hour. Please email us at info@strixproduction.com instead.',
};
