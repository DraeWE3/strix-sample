/**
 * In-memory stand-in for the Neon Data API (a PostgREST query builder) and
 * Neon Auth, enforcing the row-level security of db/schema.sql: visitors and
 * signed-in non-admins see published rows only, and only admins write.
 */
const TABLES = ['projects', 'case_studies', 'blogs'];

const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));

// Generated columns, as in db/schema.sql.
const column = (row, name) => {
  if (name === 'id') return row.id;
  if (name === 'status') return row.data.status ?? 'draft';
  if (name === 'link') return row.data.link ?? null;
  if (name === 'project_id') return row.data.projectId ?? null;
  const json = /^data->>(\w+)$/.exec(name);
  if (json) return row.data[json[1]] == null ? null : String(row.data[json[1]]);
  throw new Error(`fakeNeon: unknown column ${name}`);
};

export const createFakeNeon = ({ users = { 'admin@strix.test': 'correct horse battery' }, admins = ['admin@strix.test'] } = {}) => {
  const tables = new Map(TABLES.map((name) => [name, new Map()]));
  const adminSet = new Set(admins);
  const writes = [];
  const queries = [];
  let nextId = 1;

  const table = (name) => {
    if (!tables.has(name)) throw new Error(`fakeNeon: unknown table ${name}`);
    return tables.get(name);
  };

  const createClient = (getEmail) => {
    const isAdmin = () => adminSet.has(getEmail());
    const visible = (row) => isAdmin() || column(row, 'status') === 'published';

    const builder = (tableName, op, payload) => {
      const filters = [];
      let order = null;
      let max = Infinity;
      const query = {
        select: () => query,
        eq: (name, value) => (filters.push([name, value]), query),
        is: (name, value) => (filters.push([name, value]), query),
        order: (name) => ((order = name), query),
        limit: (count) => ((max = count), query),
        then: (resolve, reject) => Promise.resolve().then(execute).then(resolve, reject),
      };
      const matches = (row) => visible(row) && filters.every(([name, value]) => column(row, name) === value);
      const shape = (row) => ({ id: row.id, data: clone(row.data) });
      const execute = () => {
        queries.push({ table: tableName, op, filters: filters.slice() });
        const rows = table(tableName);
        if (op === 'insert') {
          if (!isAdmin()) return { data: null, error: { code: '42501', message: 'new row violates row-level security policy' }, status: 403 };
          const id = `row${nextId++}`;
          rows.set(id, { id, data: clone(payload.data) });
          writes.push({ op: 'insert', table: tableName, id, data: clone(payload.data) });
          return { data: [shape(rows.get(id))], error: null, status: 201 };
        }
        let found = [...rows.values()].filter(matches);
        if (order) found.sort((a, b) => String(column(a, order)).localeCompare(String(column(b, order))));
        found = found.slice(0, max);
        if (op === 'select') return { data: found.map(shape), error: null, status: 200 };
        // RLS: rows an admin policy does not cover are silently left out of updates and deletes.
        const allowed = isAdmin() ? found : [];
        for (const row of allowed) {
          if (op === 'update') {
            row.data = clone(payload.data);
            writes.push({ op: 'update', table: tableName, id: row.id, data: clone(payload.data) });
          } else {
            rows.delete(row.id);
            writes.push({ op: 'delete', table: tableName, id: row.id });
          }
        }
        return { data: allowed.map(shape), error: null, status: 200 };
      };
      return query;
    };

    return {
      from: (name) => ({
        select: () => builder(name, 'select'),
        insert: (row) => builder(name, 'insert', row),
        update: (patch) => builder(name, 'update', patch),
        delete: () => builder(name, 'delete'),
      }),
      rpc: async (fn) => {
        if (fn !== 'is_admin') throw new Error(`fakeNeon: unknown function ${fn}`);
        return { data: isAdmin(), error: null, status: 200 };
      },
    };
  };

  let sessionEmail = null;
  const sessionUser = () => (sessionEmail ? { id: `user-${sessionEmail}`, email: sessionEmail, name: '' } : null);
  const admin = createClient(() => sessionEmail);
  admin.auth = {
    getSession: async () => ({ data: sessionEmail ? { session: { token: 't' }, user: sessionUser() } : null, error: null }),
    signIn: {
      email: async ({ email, password }) => {
        if (users[email] !== password) {
          return { data: null, error: { status: 401, code: 'INVALID_EMAIL_OR_PASSWORD', message: 'Invalid email or password' } };
        }
        sessionEmail = email;
        return { data: { user: sessionUser() }, error: null };
      },
    },
    signOut: async () => {
      sessionEmail = null;
      return { data: { success: true }, error: null };
    },
  };

  return {
    /** The studio's client (Neon Auth session + Data API). */
    admin,
    /** A visitor's anonymous Data API client. */
    anonymous: createClient(() => null),
    writes,
    queries,
    storage: {
      uploadImage: async (file) => `https://res.cloudinary.com/demo/image/upload/${encodeURIComponent(file.name)}`,
    },
    seed(tableName, id, data) {
      table(tableName).set(id, { id, data: clone(data) });
    },
    get(tableName, id) {
      return clone(table(tableName).get(id)?.data);
    },
    has(tableName, id) {
      return table(tableName).has(id);
    },
    setAdmin(email, allowed) {
      if (allowed) adminSet.add(email);
      else adminSet.delete(email);
    },
  };
};
