#!/usr/bin/env node
/**
 * One-off copy of the exported Firestore content into the Neon tables from
 * db/schema.sql. Reads the export's projects.json, caseStudies.json and
 * blogs.json (each an array of `{ id, data }`, case studies also with
 * `chunks: [{ id, data }]`). Document ids are kept, so every existing
 * /blog/:id and /case-study/:id URL keeps working. Case-study chunks are folded
 * back into their case study (Postgres has no 1 MB document limit). Rows are
 * upserted in one transaction, so the script can be re-run; it never deletes.
 *
 *   node --env-file=.env scripts/migrate-firestore-to-neon.mjs [--from ../data] [--dry-run]
 *
 * Needs DATABASE_URL (Neon connection string of the table owner) unless --dry-run.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Pool } from '@neondatabase/serverless';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fromIndex = args.indexOf('--from');
const exportDir = resolve(fromIndex >= 0 ? args[fromIndex + 1] : '../data');

if (!dryRun && !process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set (Neon Console → Connect, the owner role).');
  process.exit(1);
}

const asArray = (value) => (Array.isArray(value) ? value : []);
const SAFE_ID = /^[A-Za-z0-9_-]{1,128}$/;

/** Firestore Timestamps (exported as { seconds, nanoseconds } or { _seconds, … }) become ISO strings. */
const plain = (value) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const seconds = value.seconds ?? value._seconds;
    const keys = Object.keys(value).sort().join(',');
    if (Number.isFinite(seconds) && /^_?nanoseconds,_?seconds$/.test(keys)) return new Date(seconds * 1000).toISOString();
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, plain(item)]));
  }
  if (Array.isArray(value)) return value.map(plain);
  return value;
};

const chunkOrder = (a, b) =>
  String(a.createdAt || '').localeCompare(String(b.createdAt || '')) || String(a.id || '').localeCompare(String(b.id || ''));

/** The rules the public site used to read chunks with: oldest first, so the newest write of a section wins. */
const foldChunks = (main, chunks) => {
  const result = {
    ...main,
    aboutProject: { ...main.aboutProject, images: asArray(main.aboutProject?.images).slice() },
    client: { ...main.client },
    processCards: asArray(main.processCards).slice(),
    conceptSlides: asArray(main.conceptSlides).slice(),
    responsiveImages: asArray(main.responsiveImages).slice(),
  };
  chunks.slice().sort(chunkOrder).forEach(({ sectionName, data }) => {
    if (!sectionName || !data) return;
    const hasIndex = data.index !== undefined;
    if (sectionName === 'hero_thumbnail') result.heroThumbnail = data.heroThumbnail;
    else if (sectionName === 'client_logo') result.client.logo = data.logo;
    else if (sectionName === 'design_image') result.designSystemImage = data.designSystemImage;
    else if (sectionName.startsWith('about_image_') && hasIndex && data.image) result.aboutProject.images[data.index] = data.image;
    else if (sectionName.startsWith('process_card_') && hasIndex && data.card) result.processCards[data.index] = data.card;
    else if (sectionName.startsWith('concept_slide_') && hasIndex && data.slide) result.conceptSlides[data.index] = data.slide;
    else if (sectionName.startsWith('responsive_image_') && hasIndex && data.image) result.responsiveImages[data.index] = data.image;
  });
  return result;
};

const readExport = async (name) => {
  const rows = JSON.parse(await readFile(resolve(exportDir, `${name}.json`), 'utf8'));
  if (!Array.isArray(rows)) throw new Error(`${name}.json is not an array of { id, data } records.`);
  for (const row of rows) {
    if (!SAFE_ID.test(String(row?.id)) || !row.data || typeof row.data !== 'object') {
      throw new Error(`${name}.json has a record without a plain id and a data object: ${JSON.stringify(row?.id)}`);
    }
  }
  if (new Set(rows.map((row) => row.id)).size !== rows.length) throw new Error(`${name}.json has duplicate ids.`);
  return rows;
};

let pool = null;
try {
  const projects = (await readExport('projects')).map(({ id, data }) => ({ id, data: plain(data) }));
  const blogs = (await readExport('blogs')).map(({ id, data }) => ({ id, data: plain(data) }));
  let chunkCount = 0;
  const caseStudies = (await readExport('caseStudies')).map(({ id, data, chunks }) => {
    const parts = asArray(chunks).map((chunk) => ({ id: chunk.id, ...plain(chunk.data) }));
    chunkCount += parts.length;
    return { id, data: foldChunks(plain(data), parts) };
  });

  const projectIds = new Set(projects.map((project) => project.id));
  const orphans = caseStudies.filter((caseStudy) => !projectIds.has(caseStudy.data.projectId));
  if (orphans.length) console.warn(`Note: ${orphans.length} case studies have no project card: ${orphans.map((c) => c.id).join(', ')}`);

  const status = (rows) => `${rows.length} (${rows.filter((row) => row.data.status === 'published').length} published)`;
  console.log(`Export in ${exportDir}: ${status(projects)} projects, ${status(caseStudies)} case studies (${chunkCount} chunks folded in), ${status(blogs)} blogs.`);

  if (dryRun) {
    console.log('Dry run: nothing was written to Neon.');
  } else {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const sql = await pool.connect();
    try {
      await sql.query('begin');
      for (const [table, rows] of [['projects', projects], ['case_studies', caseStudies], ['blogs', blogs]]) {
        for (const row of rows) {
          await sql.query(`insert into ${table} (id, data) values ($1, $2) on conflict (id) do update set data = excluded.data`, [row.id, row.data]);
        }
      }
      await sql.query('commit');
    } catch (error) {
      await sql.query('rollback').catch(() => {});
      throw error;
    } finally {
      sql.release();
    }
    const { rows } = await pool.query(
      'select (select count(*) from projects) as projects, (select count(*) from case_studies) as case_studies, (select count(*) from blogs) as blogs'
    );
    console.log(`Neon now holds ${rows[0].projects} projects, ${rows[0].case_studies} case studies, ${rows[0].blogs} blogs.`);
  }
} catch (error) {
  console.error(`Migration failed, nothing was committed: ${error.code || ''} ${error.message}`);
  process.exitCode = 1;
} finally {
  await pool?.end();
}
