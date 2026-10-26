const RETRY_BASE_MS = 2000;
const RETRY_MAX_MS = 60000;
const REFRESH_MS = 5 * 60 * 1000;

/**
 * A `listen` function for createLiveCollection over a one-shot read. The Data
 * API has no real-time feed, so the read is repeated when the tab becomes
 * visible again and every few minutes while it stays open. A failed read stops
 * the poller and reports the error, so the collection's backoff takes over.
 * @template T
 * @param {() => Promise<T>} read
 * @param {{ every?: number }} [options]
 * @returns {(next: (data: T) => void, fail: (error: Error) => void) => () => void}
 */
export const pollingListener = (read, { every = REFRESH_MS } = {}) => (next, fail) => {
  let stopped = false;
  let timer = null;
  const visible = () => typeof document === 'undefined' || document.visibilityState !== 'hidden';
  const stop = () => {
    stopped = true;
    clearInterval(timer);
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisible);
  };
  const refresh = () =>
    read().then(
      (data) => {
        if (!stopped) next(data);
      },
      (error) => {
        if (stopped) return;
        stop();
        fail(error);
      }
    );
  function onVisible() {
    if (visible()) refresh();
  }
  refresh();
  timer = setInterval(() => {
    if (visible()) refresh();
  }, every);
  timer.unref?.();
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisible);
  return stop;
};

/**
 * One shared listener per collection for the lifetime of the app. A listener
 * stops after an error, so it is restarted with exponential backoff while
 * anything is still subscribed.
 * @template T
 * @param {{
 *   name: string,
 *   initial: T,
 *   listen: (next: (data: Partial<T>) => void, fail: (error: Error) => void) => () => void,
 *   schedule?: typeof setTimeout,
 * }} options
 */
export const createLiveCollection = ({ name, initial, listen, schedule = setTimeout }) => {
  let state = { ...initial, loading: true, error: null };
  const listeners = new Set();
  let unsubscribe = null;
  let retryTimer = null;
  let attempts = 0;

  const emit = (patch) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener(state));
  };

  const start = () => {
    if (unsubscribe || retryTimer) return;
    let failed = false;
    const stop = listen(
      (data) => {
        attempts = 0;
        emit({ ...data, loading: false, error: null });
      },
      (error) => {
        console.error(`Error loading ${name}:`, error);
        failed = true;
        unsubscribe = null;
        emit({ loading: false, error });
        if (!listeners.size) return;
        const delay = Math.min(RETRY_MAX_MS, RETRY_BASE_MS * 2 ** attempts);
        attempts += 1;
        retryTimer = schedule(() => {
          retryTimer = null;
          if (listeners.size) start();
        }, delay);
      }
    );
    if (!failed) unsubscribe = stop;
  };

  return {
    getState: () => state,
    /** @param {(state: T & { loading: boolean, error: Error | null }) => void} listener */
    subscribe(listener) {
      listeners.add(listener);
      start();
      listener(state);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};
