/**
 * In-memory stand-ins for the parts of firebase/auth, firebase/firestore and the
 * Cloudinary helper that the studio backend and the public data layer use.
 * Test-only: nothing here talks to a real project.
 */
const clone = (value) => (value === undefined ? undefined : structuredClone(value));
const parentOf = (path) => path.split('/').slice(0, -1).join('/');

export const createFakeFirebase = ({ accounts = { 'admin@strix.test': 'correct horse battery' } } = {}) => {
  const docs = new Map();
  const writes = [];
  let counter = 0;
  let deny = false;
  let currentUser = null;
  const authListeners = new Set();

  const guard = () => {
    if (deny) throw Object.assign(new Error('Missing or insufficient permissions.'), { code: 'permission-denied' });
  };
  const snapshot = (path) => {
    const data = docs.get(path);
    const id = path.split('/').pop();
    return { id, ref: { kind: 'doc', path, id }, exists: () => data !== undefined, data: () => clone(data) };
  };
  const matches = (data, constraints) =>
    constraints.filter((c) => c.type === 'where').every((c) => data[c.field] === c.value);

  const firestore = {
    collection: (_db, ...segments) => ({ kind: 'collection', path: segments.join('/') }),
    doc: (_db, ...segments) => ({ kind: 'doc', path: segments.join('/'), id: segments.at(-1) }),
    query: (ref, ...constraints) => ({ ...ref, constraints }),
    where: (field, op, value) => {
      if (op !== '==') throw new Error(`Unsupported operator ${op}`);
      return { type: 'where', field, value };
    },
    limit: (count) => ({ type: 'limit', count }),
    orderBy: (field, direction = 'asc') => ({ type: 'orderBy', field, direction }),
    async getDocs(ref) {
      const constraints = ref.constraints || [];
      let list = [...docs.keys()].filter((path) => parentOf(path) === ref.path).sort().map(snapshot)
        .filter((snap) => matches(snap.data(), constraints));
      const max = constraints.find((c) => c.type === 'limit');
      if (max) list = list.slice(0, max.count);
      return { docs: list, empty: list.length === 0 };
    },
    getDoc: async (ref) => snapshot(ref.path),
    getDocFromServer: async (ref) => snapshot(ref.path),
    onSnapshot(ref, next) {
      firestore.getDocs(ref).then(next);
      return () => {};
    },
    async addDoc(ref, data) {
      guard();
      const id = `auto${String(++counter).padStart(3, '0')}`;
      const path = `${ref.path}/${id}`;
      docs.set(path, clone(data));
      writes.push({ op: 'add', path, data: clone(data) });
      return { id, path };
    },
    async updateDoc(ref, data) {
      guard();
      if (!docs.has(ref.path)) throw Object.assign(new Error('No document to update'), { code: 'not-found' });
      docs.set(ref.path, { ...docs.get(ref.path), ...clone(data) });
      writes.push({ op: 'update', path: ref.path, data: clone(data) });
    },
    async deleteDoc(ref) {
      guard();
      docs.delete(ref.path);
      writes.push({ op: 'delete', path: ref.path });
    },
    initializeFirestore: () => ({}),
    persistentLocalCache: () => ({}),
    persistentMultipleTabManager: () => ({}),
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
      currentUser = { uid: `uid-${email}`, email, displayName: null };
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

  return {
    firestore,
    auth,
    storage,
    docs,
    writes,
    seed(path, data) {
      docs.set(path, clone(data));
    },
    get: (path) => clone(docs.get(path)),
    setDenyWrites(value) {
      deny = value;
    },
  };
};
