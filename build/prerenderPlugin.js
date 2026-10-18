/**
 * Production-build step that writes a prerendered <head> for every public
 * route plus sitemap.xml, llms.txt, the generated .htaccess route rules and a
 * release manifest.
 *
 * Content is read from Firestore in `buildStart`, before Vite empties the
 * output folder, through a build-only Firestore instance with a memory cache
 * and server-only reads. If Firestore cannot be read the build fails and the
 * previous output is left untouched. STRIX_PRERENDER_OFFLINE=1 opts into an
 * explicitly incomplete build (no blogs or case studies) that the release
 * check refuses to ship.
 */
import { createServer } from 'vite';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  droppedRoutes,
  emptiedGroups,
  fillHtaccess,
  htaccessRouteRules,
  llmsTxt,
  releaseManifest,
  renderPage,
  renderShell,
  routeFile,
  sitemapXml,
} from './seoArtifacts.js';

export const MANIFEST = 'release-manifest.json';
export const NOT_FOR_RELEASE = 'NOT-FOR-RELEASE.txt';
const BUILD_APP = 'strix-prerender';
const SAFE_SEGMENT = /^[A-Za-z0-9_-]+$/;

const listFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => (entry.isDirectory() ? listFiles(join(dir, entry.name)) : [join(dir, entry.name)]))
  );
  return nested.flat();
};

const readJson = async (file) => {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return null;
  }
};

const dateOf = (value) => (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : '');

/** Static pages, services and their redirects need no network. */
const staticRoutes = async (load) => {
  const { pageMeta } = await load('/src/data/pageMeta.js');
  const { serviceDetails, serviceRoute } = await load('/src/data/serviceDetails.js');
  return [
    ...Object.entries(pageMeta).map(([path, meta]) => ({ path, group: 'page', ...meta })),
    ...Object.values(serviceDetails).map((service) => ({ path: serviceRoute(service.slug), group: 'service', ...service.seo })),
  ];
};

/** Published blogs and case studies, read from the server only. */
const contentRoutes = async (load, warn) => {
  const { getApp, getApps, initializeApp, deleteApp } = await load('firebase/app');
  const firestore = await load('firebase/firestore');
  const { firebaseConfig } = await load('/src/lib/firebase-config.js');
  const { publishedBlogsQuery, blogsFromDocs, blogMeta } = await load('/src/lib/blogs.js');
  const { publishedProjectsQuery, projectsFromDocs, isPublished, caseStudyPath, isExternalProject } = await load('/src/lib/projects.js');
  const { fetchCaseStudy, caseStudyMeta } = await load('/src/lib/caseStudies.js');
  const { isExcludedBlog } = await load('/src/data/seoExclusions.js');

  if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
    throw new Error('VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_API_KEY are not set (check .env).');
  }
  const app = getApps().some((existing) => existing.name === BUILD_APP) ? getApp(BUILD_APP) : initializeApp(firebaseConfig, BUILD_APP);
  const db = firestore.initializeFirestore(app, { localCache: firestore.memoryLocalCache() });
  try {
    const blogs = blogsFromDocs((await firestore.getDocsFromServer(publishedBlogsQuery(db))).docs);
    const blogRoutes = [];
    for (const blog of blogs) {
      if (!SAFE_SEGMENT.test(blog.id)) {
        warn(`Blog ${JSON.stringify(blog.id)} has an id that can't be a file name; it is served by the app shell.`);
        continue;
      }
      if (isExcludedBlog(blog.id)) {
        warn(`Blog ${blog.id} ("${blog.title}") is published but listed in src/data/seoExclusions.js; it is left out of the sitemap. Unpublish it in the studio.`);
        continue;
      }
      blogRoutes.push({ ...blogMeta(blog), group: 'blog', imageAlt: blog.title, lastmod: dateOf(blog.updatedAt) || blog.date });
    }

    const projects = projectsFromDocs((await firestore.getDocsFromServer(publishedProjectsQuery(db))).docs).filter(
      (project) => isPublished(project) && !isExternalProject(project)
    );
    const source = { db, getDocs: firestore.getDocsFromServer, getDoc: firestore.getDocFromServer };
    const caseRoutes = [];
    const seen = new Set();
    for (const project of projects) {
      const slug = caseStudyPath(project).slice('/case-study/'.length);
      if (seen.has(slug)) {
        warn(`Two published projects use /case-study/${slug}; only the first is prerendered.`);
        continue;
      }
      seen.add(slug);
      if (!SAFE_SEGMENT.test(decodeURIComponent(slug))) continue;
      const result = await fetchCaseStudy(decodeURIComponent(slug), source);
      if (result.status !== 'ready') {
        warn(`Project "${project.title}" is published but has no published case study, so /case-study/${slug} is not prerendered.`);
        continue;
      }
      caseRoutes.push({
        ...caseStudyMeta(result.record),
        group: 'case-study',
        imageAlt: result.record.title,
        lastmod: dateOf(project.updatedAt),
      });
    }
    return [...blogRoutes, ...caseRoutes];
  } finally {
    await firestore.terminate(db);
    await deleteApp(app);
  }
};

export const prerenderPlugin = () => {
  let root;
  let outDir;
  let offline = false;
  let routes = [];
  let previous = null;

  return {
    name: 'prerender-meta',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = resolve(config.root, config.build.outDir);
      offline = process.env.STRIX_PRERENDER_OFFLINE === '1';
    },

    async buildStart() {
      previous = await readJson(join(outDir, MANIFEST));
      const server = await createServer({
        configFile: false,
        root,
        logLevel: 'error',
        appType: 'custom',
        optimizeDeps: { noDiscovery: true, include: [] },
        server: { middlewareMode: true, hmr: false, ws: false },
      });
      const load = (id) => server.ssrLoadModule(id);
      const warnings = [];
      try {
        routes = await staticRoutes(load);
        if (offline) {
          this.warn(
            'STRIX_PRERENDER_OFFLINE=1: blog and case-study pages, sitemap.xml and llms.txt are NOT generated. ' +
              `This output is marked ${NOT_FOR_RELEASE} and must not be deployed.`
          );
        } else {
          try {
            routes.push(...(await contentRoutes(load, (message) => warnings.push(message))));
          } catch (error) {
            this.error(
              `Could not read published blogs and case studies from Firestore (${error.code || 'error'}: ${error.message}). ` +
                'The build was stopped so the previous output and its pages stay intact. Check the network and the VITE_FIREBASE_* settings, ' +
                'or run with STRIX_PRERENDER_OFFLINE=1 for a local, non-release build.'
            );
          }
          const emptied = emptiedGroups(previous, routes);
          if (emptied.length && process.env.STRIX_ALLOW_EMPTY_CONTENT !== '1') {
            this.error(
              `Firestore returned no published ${emptied.join(' or ')} pages, but the previous build in ${relative(root, outDir)} had some. ` +
                'Refusing to drop them all. If everything really was unpublished, rerun with STRIX_ALLOW_EMPTY_CONTENT=1.'
            );
          }
        }
        for (const route of droppedRoutes(previous, routes)) {
          if (offline && (route.group === 'blog' || route.group === 'case-study')) continue;
          warnings.push(`${route.path} was in the previous build and is not in this one (unpublished, deleted or renamed).`);
        }
      } finally {
        const { db } = await load('/src/lib/firebase.js').catch(() => ({}));
        if (db) await (await load('firebase/firestore')).terminate(db).catch(() => {});
        await server.close();
      }
      warnings.forEach((message) => this.warn(message));
      const counts = ['page', 'service', 'blog', 'case-study'].map((group) => `${routes.filter((r) => (r.group || 'page') === group).length} ${group}`);
      this.info?.(`prerender content: ${counts.join(', ')}`);
    },

    // writeBundle runs only after a successful bundle write (closeBundle also runs on failures).
    async writeBundle() {
      const shell = await readFile(join(outDir, 'index.html'), 'utf8');
      const written = [];
      const write = async (file, content) => {
        const target = join(outDir, file);
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, content);
        written.push(file);
      };

      await write('app.html', renderShell(shell, {
        title: '',
        description: 'Strix Production - Premium Digital Design & Development Agency. We build MVPs, SaaS products, and high-end websites.',
      }));
      await write('404.html', renderShell(shell, {
        title: 'Page Not Found',
        description: 'The page you are looking for does not exist or has moved.',
        noindex: true,
      }));
      for (const route of routes) await write(routeFile(route.path), renderPage(shell, route));

      const { LEGACY_REDIRECTS } = await import(pathToFileURL(resolve(root, 'src/data/legacyRoutes.js')).href);
      const template = await readFile(resolve(root, 'public/.htaccess'), 'utf8');
      await write('.htaccess', fillHtaccess(template, htaccessRouteRules({ legacy: LEGACY_REDIRECTS, paths: routes.map((route) => route.path) })));

      if (offline) {
        await Promise.all(['sitemap.xml', 'llms.txt'].map((file) => rm(join(outDir, file), { force: true })));
        await write(NOT_FOR_RELEASE, 'Built with STRIX_PRERENDER_OFFLINE=1: blog and case-study pages, sitemap.xml and llms.txt are missing. Do not deploy.\n');
      } else {
        await rm(join(outDir, NOT_FOR_RELEASE), { force: true });
        await write('sitemap.xml', sitemapXml(routes));
        await write('llms.txt', llmsTxt(routes));
      }

      const files = [];
      for (const file of await listFiles(outDir)) {
        const path = relative(outDir, file).split('\\').join('/');
        if (path === MANIFEST) continue;
        files.push({ path, content: await readFile(file) });
      }
      const manifest = releaseManifest(files, { routes, complete: !offline, builtAt: new Date().toISOString() });
      await writeFile(join(outDir, MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`);
      this.info?.(`prerendered ${routes.length} routes; wrote ${written.length} files and ${MANIFEST}`);
    },
  };
};
