import { defineConfig, createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

const SITE_URL = 'https://www.strixproduction.com'
const BRAND = 'Strix Production'

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const headTags = ({ path, title, description, type = 'website', image }) => {
  const fullTitle = escapeHtml(`${title} | ${BRAND}`)
  const desc = escapeHtml(description.replace(/\s+/g, ' ').trim())
  const url = escapeHtml(`${SITE_URL}${path}`)
  return [
    `<title data-prerender>${fullTitle}</title>`,
    `<meta data-prerender name="description" content="${desc}" />`,
    `<link data-prerender rel="canonical" href="${url}" />`,
    `<meta data-prerender property="og:title" content="${fullTitle}" />`,
    `<meta data-prerender property="og:description" content="${desc}" />`,
    `<meta data-prerender property="og:url" content="${url}" />`,
    `<meta data-prerender property="og:type" content="${type}" />`,
    image && `<meta data-prerender property="og:image" content="${escapeHtml(image)}" />`,
    `<meta data-prerender property="twitter:title" content="${fullTitle}" />`,
    `<meta data-prerender property="twitter:description" content="${desc}" />`,
  ].filter(Boolean).join('\n    ')
}

const SAFE_SLUG = /^[\w-]+$/

const dynamicRoutes = async (load, db) => {
  const { collection, getDocs, query, where } = await load('firebase/firestore')
  const { BLOGS_COLLECTION, mapBlog, blogHref } = await load('/src/lib/blogs.js')
  const { PROJECTS_COLLECTION, mapProject, isPublished, projectHref } = await load('/src/lib/projects.js')
  const { loadCaseStudy } = await load('/src/lib/caseStudies.js')

  const blogDocs = await getDocs(query(collection(db, BLOGS_COLLECTION), where('status', '==', 'published')))
  const blogs = blogDocs.docs.map((doc) => mapBlog(doc.id, doc.data())).filter((blog) => blog.title)
  const blogRoutes = blogs
    .filter((blog) => SAFE_SLUG.test(blog.id))
    .map((blog) => ({
      path: blogHref(blog),
      title: blog.title,
      description: blog.excerpt || `Read “${blog.title}” on the Strix Production blog.`,
      type: 'article',
      image: blog.coverImage,
    }))

  const projectDocs = await getDocs(collection(db, PROJECTS_COLLECTION))
  const slugs = projectDocs.docs
    .map((doc) => mapProject(doc.id, doc.data()))
    .filter(isPublished)
    .map(projectHref)
    .filter((href) => href.startsWith('/case-study/'))
    .map((href) => href.slice('/case-study/'.length))
    .filter((slug) => SAFE_SLUG.test(slug))
  const caseRoutes = []
  for (const slug of slugs) {
    const { status, record } = await loadCaseStudy(slug)
    if (status !== 'ready') continue
    caseRoutes.push({
      path: `/case-study/${slug}`,
      title: `${record.title} — Case Study`,
      description:
        record.seo.description ||
        `Explore the ${record.title} case study by Strix Production: the challenge, our design and development approach, and the results delivered.`,
      type: 'article',
      image: record.seo.image,
    })
  }
  return [...blogRoutes, ...caseRoutes]
}

const prerenderMeta = () => {
  let root
  let outDir
  return {
    name: 'prerender-meta',
    apply: 'build',
    configResolved(config) {
      root = config.root
      outDir = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const shell = await readFile(join(outDir, 'index.html'), 'utf8')
      const server = await createServer({
        configFile: false,
        root,
        logLevel: 'error',
        appType: 'custom',
        server: { middlewareMode: true, hmr: false, ws: false },
      })
      const load = (id) => server.ssrLoadModule(id)
      const routes = []
      try {
        const { pageMeta } = await load('/src/data/pageMeta.js')
        const { serviceDetails, serviceRoute } = await load('/src/data/serviceDetails.js')
        routes.push(
          ...Object.entries(pageMeta).map(([path, meta]) => ({ path, ...meta })),
          ...Object.values(serviceDetails).map((service) => ({ path: serviceRoute(service.slug), ...service.seo }))
        )
        const { db } = await load('/src/admin/firebaseconfig.js')
        const { terminate } = await load('firebase/firestore')
        try {
          routes.push(...(await dynamicRoutes(load, db)))
        } catch (error) {
          this.warn(`Skipped blog and case-study metadata: ${error.message}`)
        } finally {
          await terminate(db)
        }
      } finally {
        await server.close()
      }

      await writeFile(join(outDir, 'app.html'), shell)
      for (const route of routes) {
        const file = route.path === '/' ? join(outDir, 'index.html') : join(outDir, `${route.path}.html`)
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, shell.replace(/<title data-prerender>[^<]*<\/title>/, headTags(route)))
      }
      this.info?.(`prerendered metadata for ${routes.length} routes`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), prerenderMeta()],
})
