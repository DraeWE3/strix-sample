const RETRY_BASE_MS = 2000;
const RETRY_MAX_MS = 60000;

/**
 * One shared real-time listener per collection for the lifetime of the app.
 * Firestore detaches a listener after an error, so it is restarted with
 * exponential backoff while anything is still subscribed.
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
