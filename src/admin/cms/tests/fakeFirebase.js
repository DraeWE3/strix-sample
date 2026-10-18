/**
 * In-memory stand-ins for the parts of firebase/auth, firebase/firestore and the
 * Cloudinary helper that the studio backend and the public data layer use.
 * Test-only: nothing here talks to a real project.
 *
 * Batches and transactions apply all-or-nothing. `failWrites(n)` makes the
 * next n commits or single writes fail (as a dropped connection would), and
 * `setRules(fn)` lets a test refuse reads or writes the way security rules do.
 */
const clone = (value) => (value === undefined ? undefined : structuredClone(value));
const parentOf = (path) => path.split('/').slice(0, -1).join('/');
const firestoreError = (code, message) => Object.assign(new Error(message), { code });

export const createFakeFirebase = ({
  accounts = { 'admin@strix.test': 'correct horse battery' },
  admins = ['admin@strix.test'],
} = {}) => {
  const docs = new Map();
  const writes = [];
  const reads = [];
  let counter = 0;
  let failures = 0;
  let rules = () => true;
  let currentUser = null;
  const claims = new Map();
  const authListeners = new Set();

  const autoId = () => `auto${String(++counter).padStart(3, '0')}`;
  const allowed = (op, path, data) => rules({ op, path, data: clone(data), auth: currentUser ? { uid: currentUser.uid } : null });
  const checkRead = (path) => {
    if (!allowed('read', path)) throw firestoreError('permission-denied', 'Missing or insufficient permissions.');
  };
  const checkWrite = (op, path, data) => {
    if (failures > 0) {
      failures -= 1;
      throw firestoreError('unavailable', 'The connection was lost.');
    }
    if (!allowed(op, path, data)) throw firestoreError('permission-denied', 'Missing or insufficient permissions.');
  };
  const snapshot = (path) => {
    const data = docs.get(path);
    const id = path.split('/').pop();
    return { id, ref: { kind: 'doc', path, id }, exists: () => data !== undefined, data: () => clone(data), metadata: { fromCache: false } };
  };
  const matches = (data, constraints) =>
    constraints.filter((c) => c.type === 'where').every((c) => data[c.field] === c.value);

  // A write plan applied atomically: either every change lands or none does.
  const apply = (changes) => {
    for (const change of changes) checkWrite(change.op, change.path, change.data);
    for (const change of changes) {
      if (change.op === 'update' && !docs.has(change.path)) throw firestoreError('not-found', `No document to update: ${change.path}`);
    }
    for (const change of changes) {
      if (change.op === 'set') docs.set(change.path, clone(change.data));
      else if (change.op === 'update') docs.set(change.path, { ...docs.get(change.path), ...clone(change.data) });
      else docs.delete(change.path);
      writes.push(clone(change));
    }
  };
  const single = async (change) => apply([change]);

  const getDocs = async (ref) => {
    const constraints = ref.constraints || [];
    reads.push(ref.path);
    checkRead(ref.path);
    let list = [...docs.keys()].filter((path) => parentOf(path) === ref.path).sort().map(snapshot)
      .filter((snap) => matches(snap.data(), constraints));
    const max = constraints.find((c) => c.type === 'limit');
    if (max) list = list.slice(0, max.count);
    return { docs: list, empty: list.length === 0, size: list.length, metadata: { fromCache: false } };
  };
  const getDoc = async (ref) => {
    reads.push(ref.path);
    checkRead(ref.path);
    return snapshot(ref.path);
  };

  const firestore = {
    collection: (first, ...segments) => ({ kind: 'collection', path: (first?.kind === 'doc' ? [first.path, ...segments] : segments).join('/') }),
    doc: (first, ...segments) => {
      const path = first?.kind === 'collection' ? [first.path, ...(segments.length ? segments : [autoId()])].join('/') : segments.join('/');
      return { kind: 'doc', path, id: path.split('/').at(-1) };
    },
    query: (ref, ...constraints) => ({ ...ref, constraints }),
    where: (field, op, value) => {
      if (op !== '==') throw new Error(`Unsupported operator ${op}`);
      return { type: 'where', field, value };
    },
    limit: (count) => ({ type: 'limit', count }),
    orderBy: (field, direction = 'asc') => ({ type: 'orderBy', field, direction }),
    getDocs,
    getDocsFromServer: getDocs,
    getDoc,
    getDocFromServer: getDoc,
    onSnapshot(ref, ...args) {
      const [next, error] = args.filter((arg) => typeof arg === 'function');
      getDocs(ref).then(next, (err) => error?.(err));
      return () => {};
    },
    async addDoc(ref, data) {
      const path = `${ref.path}/${autoId()}`;
      await single({ op: 'set', path, data });
      return { id: path.split('/').pop(), path };
    },
    setDoc: (ref, data) => single({ op: 'set', path: ref.path, data }),
    updateDoc: (ref, data) => single({ op: 'update', path: ref.path, data }),
    deleteDoc: (ref) => single({ op: 'delete', path: ref.path }),
    writeBatch() {
      const changes = [];
      const batch = {
        set: (ref, data) => (changes.push({ op: 'set', path: ref.path, data: clone(data) }), batch),
        update: (ref, data) => (changes.push({ op: 'update', path: ref.path, data: clone(data) }), batch),
        delete: (ref) => (changes.push({ op: 'delete', path: ref.path }), batch),
        commit: async () => apply(changes),
      };
      return batch;
    },
    async runTransaction(_db, fn) {
      const changes = [];
      const tx = {
        get: async (ref) => getDoc(ref),
        set: (ref, data) => (changes.push({ op: 'set', path: ref.path, data: clone(data) }), tx),
        update: (ref, data) => (changes.push({ op: 'update', path: ref.path, data: clone(data) }), tx),
        delete: (ref) => (changes.push({ op: 'delete', path: ref.path }), tx),
      };
      const result = await fn(tx);
      apply(changes);
      return result;
    },
    initializeFirestore: () => ({}),
    memoryLocalCache: () => ({}),
    persistentLocalCache: () => ({}),
    persistentMultipleTabManager: () => ({}),
    terminate: async () => {},
    setLogLevel: () => {},
  };

  const emitAuth = () => authListeners.forEach((listener) => listener(currentUser));
  const auth = {
    onAuthStateChanged(_auth, listener) {
      authListeners.add(listener);
      queueMicrotask(() => listener(currentUser));
      return () => authListeners.delete(listener);
    },
    async signInWithEmailAndPassword(_auth, email, password) {
      if (accounts[email] !== password) throw Object.assign(new Error('Firebase: Error (auth/invalid-credential).'), { code: 'auth/invalid-credential' });
      const uid = `uid-${email}`;
      currentUser = {
        uid,
        email,
        displayName: null,
        getIdTokenResult: async () => ({ claims: { ...(claims.get(uid) || {}) } }),
      };
      emitAuth();
      return { user: currentUser };
    },
    async signOut() {
      currentUser = null;
      emitAuth();
    },
  };

  const storage = {
    uploadImage: async (file) => `https://res.cloudinary.com/demo/image/upload/${encodeURIComponent(file.name)}`,
  };

  admins.forEach((email) => docs.set(`admins/uid-${email}`, { email }));

  return {
    firestore,
    auth,
    storage,
    docs,
    writes,
    reads,
    seed(path, data) {
      docs.set(path, clone(data));
    },
    get: (path) => clone(docs.get(path)),
    remove: (path) => docs.delete(path),
    /** The next `count` commits (batch, transaction or single write) fail with `unavailable`. */
    failWrites(count = 1) {
      failures = count;
    },
    /** @param {(request: { op: string, path: string, data?: any, auth: { uid: string } | null }) => boolean} fn */
    setRules(fn) {
      rules = fn;
    },
    setDenyWrites(value) {
      rules = value ? ({ op }) => op === 'read' : () => true;
    },
    setClaims(uid, value) {
      claims.set(uid, value);
    },
  };
};
