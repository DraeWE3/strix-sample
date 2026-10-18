import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { firebaseConfig } from '../lib/firebase-config.js';

const DEFAULT_APP = '[DEFAULT]';

const app = getApps().some((existing) => existing.name === DEFAULT_APP) ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Drafts are read here; keep them out of the browser's IndexedDB on shared machines.
export const db = initializeFirestore(app, { localCache: memoryLocalCache() });
