import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'strix:blog:saved:v1';
const EMPTY = [];
const listeners = new Set();
let cache = null;

const read = () => {
  if (cache) return cache;
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    cache = Array.isArray(raw) ? raw.filter((id) => typeof id === 'string') : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
};

const notify = () => listeners.forEach((listener) => listener());

const subscribe = (listener) => {
  listeners.add(listener);
  const onStorage = (event) => {
    if (event.key !== STORAGE_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
};

/** Saved posts live in this visitor's browser only; they are not a public metric. */
export const useSavedBlogs = () => {
  const saved = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggle = useCallback((id) => {
    const next = new Set(read());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    cache = [...next];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      /* storage unavailable: keep the in-memory list for this visit */
    }
    notify();
  }, []);

  return { saved, isSaved: (id) => saved.includes(id), toggle };
};
