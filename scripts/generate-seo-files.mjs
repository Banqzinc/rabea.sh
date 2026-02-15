import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..')
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'posts')
const PUBLIC_DIR = path.join(ROOT, 'public')

function normalizeOrigin(input) {
  try {
    return new URL(input).origin
  } catch {
    try {
      return new URL(`https://${input}`).origin
    } catch {
      return 'https://rabea.sh'
    }
  }
}

function resolveSiteOrigin() {
  const raw =
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    process.env.SITE_URL ??
    process.env.VITE_SITE_URL ??
    'https://rabea.sh'
  return normalizeOrigin(raw)
}

function formatDateISO(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function escapeXml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function parseFrontmatter(raw) {
  const trimmed = raw.trimStart()
  if (!trimmed.startsWith('---\n')) return { frontmatter: {}, content: trimmed }

  const endIndex = trimmed.indexOf('\n---\n', 4)
  if (endIndex === -1) return { frontmatter: {}, content: trimmed }

  const block = trimmed.slice(4, endIndex)
  const content = trimmed.slice(endIndex + 5).trim()
  const lines = block.split('\n')
  const data = {}
  let currentArrayKey = null

  for (const line of lines) {
    const arrayItemMatch = line.match(/^\s*-\s+(.*)$/)
    if (arrayItemMatch && currentArrayKey) {
      const value = arrayItemMatch[1].trim().replace(/^['"]|['"]$/g, '')
      const current = data[currentArrayKey]
      if (!Array.isArray(current)) data[currentArrayKey] = [value]
      else current.push(value)
      continue
    }

    const keyValueMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/)
    if (!keyValueMatch) continue
    const key = keyValueMatch[1]
    const rawValue = keyValueMatch[2].trim()

    if (rawValue === '') {
      data[key] = []
      currentArrayKey = key
      continue
    }

    const value = rawValue.replace(/^['"]|['"]$/g, '')
    data[key] = value === 'true' ? true : value === 'false' ? false : value
    currentArrayKey = null
  }

  return { frontmatter: data, content }
}

async function getPosts() {
  try {
    const files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith('.md'))
    const posts = []
    for (const file of files) {
      const raw = await fs.readFile(path.join(POSTS_DIR, file), 'utf8')
      const { frontmatter } = parseFrontmatter(raw)
      const slug = file.replace(/\.md$/, '')
      const date = typeof frontmatter.date === 'string' ? frontmatter.date : null
      const draft = frontmatter.draft === true || frontmatter.draft === 'true'
      if (draft) continue
      posts.push({ slug, date })
    }
    return posts
  } catch {
    return []
  }
}

async function generate() {
  const siteOrigin = resolveSiteOrigin()
  const today = formatDateISO()

  const posts = await getPosts()
  const staticRoutes = [
    { path: '/', lastmod: today },
    { path: '/posts', lastmod: today },
    { path: '/about', lastmod: today },
    { path: '/contact', lastmod: today },
    { path: '/privacy', lastmod: today },
  ]

  const postRoutes = posts.map((p) => ({
    path: `/posts/${p.slug}`,
    lastmod: p.date ?? today,
  }))

  const entries = [...staticRoutes, ...postRoutes].sort((a, b) => {
    if (a.path === '/') return -1
    if (b.path === '/') return 1
    return a.path.localeCompare(b.path)
  })

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(({ path: routePath, lastmod }) => {
      const loc = `${siteOrigin}${routePath === '/' ? '/' : routePath}`
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n  </url>`
    }),
    '</urlset>',
    '',
  ].join('\n')

  const robots = [
    '# https://www.robotstxt.org/robotstxt.html',
    'User-agent: *',
    'Disallow:',
    '',
    `Sitemap: ${siteOrigin}/sitemap.xml`,
    '',
  ].join('\n')

  await fs.mkdir(PUBLIC_DIR, { recursive: true })
  await fs.writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8')
  await fs.writeFile(path.join(PUBLIC_DIR, 'robots.txt'), robots, 'utf8')

  // eslint-disable-next-line no-console
  console.log(`[generate-seo-files] Wrote sitemap.xml + robots.txt for ${siteOrigin} (${entries.length} URLs)`)
}

await generate()
