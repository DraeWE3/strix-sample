#!/usr/bin/env node
/**
 * Neon housekeeping with the owner connection string (DATABASE_URL).
 *
 *   node --env-file=.env scripts/neon-db.mjs schema              apply db/schema.sql (safe to re-run)
 *   node --env-file=.env scripts/neon-db.mjs add-admin <email>   allow a Neon Auth user into the studio
 *   node --env-file=.env scripts/neon-db.mjs admins              list studio admins
 *   node --env-file=.env scripts/neon-db.mjs set-password <email>
 *        set the sign-in password of a Neon Auth user (asked for, hidden), check
 *        it signs in, and allow the user into the studio. Users added in the
 *        Neon Console get no password, and the studio has no sign-up page.
 */
import { readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { hashPassword } from '@better-auth/utils/password';
import { Pool } from '@neondatabase/serverless';

/** Reads a line from the terminal without echoing it. */
const askHidden = (question) =>
  new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (text) => {
      if (text.includes(question)) process.stdout.write(text);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });

const MIN_PASSWORD = 12;

const setPassword = async (pool, address) => {
  const { rows: users } = await pool.query('select id, email from neon_auth."user" where lower(email) = lower($1)', [address]);
  if (!users.length) throw new Error(`No Neon Auth user with the email ${address}. Add it in Neon Console → Auth → Users first.`);
  const [user] = users;
  const password = await askHidden(`New studio password for ${user.email} (at least ${MIN_PASSWORD} characters): `);
  if (password.length < MIN_PASSWORD) throw new Error(`The password must be at least ${MIN_PASSWORD} characters. Nothing was changed.`);
  if ((await askHidden('Type it again: ')) !== password) throw new Error('The passwords do not match. Nothing was changed.');

  const hash = await hashPassword(password);
  const { rowCount } = await pool.query(
    `update neon_auth.account set password = $2, "updatedAt" = now() where "userId" = $1 and "providerId" = 'credential'`,
    [user.id, hash]
  );
  if (!rowCount) {
    await pool.query(
      `insert into neon_auth.account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
       values (gen_random_uuid()::text, $1, 'credential', $1, $2, now(), now())`,
      [user.id, hash]
    );
  }

  // Prove the password works against Neon Auth itself, then end that test session.
  const authUrl = process.env.VITE_NEON_AUTH_URL?.replace(/\/+$/, '');
  if (authUrl) {
    const headers = { 'Content-Type': 'application/json', Origin: 'http://localhost:5174' };
    const response = await fetch(`${authUrl}/sign-in/email`, { method: 'POST', headers, body: JSON.stringify({ email: user.email, password }) });
    if (!response.ok) throw new Error(`The password was saved, but Neon Auth refused the test sign-in (HTTP ${response.status}): ${(await response.text()).slice(0, 200)}`);
    const { token } = await response.json().catch(() => ({}));
    if (token) await pool.query('delete from neon_auth.session where token = $1', [token]);
    console.log('Test sign-in against Neon Auth succeeded.');
  }

  await pool.query('insert into admins (user_id, email) values ($1, $2) on conflict (user_id) do update set email = excluded.email', [user.id, user.email]);
  console.log(`${user.email} can now sign in to the studio.`);
};

const [command, email] = process.argv.slice(2);
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set (Neon Console → Connect, the owner role).');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  if (command === 'schema') {
    await pool.query(await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8'));
    console.log('Schema applied.');
  } else if (command === 'add-admin' && email) {
    // Neon Auth keeps its users in the neon_auth schema (Better Auth's "user" table).
    const { rows } = await pool.query('select id, email from neon_auth."user" where lower(email) = lower($1)', [email]);
    if (!rows.length) throw new Error(`No Neon Auth user with the email ${email}. Create it in Neon Console → Auth first.`);
    await pool.query('insert into admins (user_id, email) values ($1, $2) on conflict (user_id) do update set email = excluded.email', [rows[0].id, rows[0].email]);
    console.log(`${rows[0].email} can now use the studio.`);
  } else if (command === 'set-password' && email) {
    await setPassword(pool, email);
  } else if (command === 'admins') {
    const { rows } = await pool.query('select email, user_id, created_at from admins order by created_at');
    console.table(rows);
  } else {
    console.error('Usage: neon-db.mjs schema | add-admin <email> | set-password <email> | admins');
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
