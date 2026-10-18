import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config.js';

const DEFAULT_APP = '[DEFAULT]';

export const app = getApps().some((existing) => existing.name === DEFAULT_APP) ? getApp() : initializeApp(firebaseConfig);

// Public visitors only read published content; nothing is persisted in their browser.
export const db = initializeFirestore(app, { localCache: memoryLocalCache() });
