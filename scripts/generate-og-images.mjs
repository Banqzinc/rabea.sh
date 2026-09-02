/**
 * Generates social sharing images (Open Graph / Twitter cards):
 *   - public/images/og/<slug>.png   one 1200x630 title card per post (unless the post sets coverImage)
 *   - public/images/og-default.png  rasterized fallback for non-post pages
 *   - public/apple-touch-icon.png   180x180 PNG rendered from favicon.svg
 *
 * Existing files are kept unless --force is passed, so the committed PNGs
 * (rendered locally with system fonts) are what ships; CI only fills gaps.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { parseFrontmatter } from './lib/frontmatter.mjs'

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..')
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'posts')
const PUBLIC_DIR = path.join(ROOT, 'public')
const OG_DIR = path.join(PUBLIC_DIR, 'images', 'og')

const WIDTH = 1200
const HEIGHT = 630
const FORCE = process.argv.includes('--force')

const FONT_FAMILY = 'Helvetica Neue, Helvetica, Arial, DejaVu Sans, sans-serif'

function escapeXml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function wrapWords(text, maxChars) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}

/** Pick the largest font size whose wrapped title fits the card. */
function layoutTitle(title) {
  const options = [
    { fontSize: 64, maxChars: 28, maxLines: 3 },
    { fontSize: 54, maxChars: 34, maxLines: 4 },
    { fontSize: 44, maxChars: 42, maxLines: 4 },
  ]
  for (const option of options) {
    const lines = wrapWords(title, option.maxChars)
    if (lines.length <= option.maxLines) return { ...option, lines }
  }
  const last = options.at(-1)
  const lines = wrapWords(title, last.maxChars).slice(0, last.maxLines)
  lines[lines.length - 1] = `${lines.at(-1).replace(/[.,;:]?$/, '')}…`
  return { ...last, lines }
}

function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function buildPostCardSvg({ title, author, date }) {
  const { fontSize, lines } = layoutTitle(title)
  const lineHeight = Math.round(fontSize * 1.2)
  const bandTop = 170
  const bandHeight = 310
  const blockHeight = lines.length * lineHeight
  const firstBaseline = bandTop + (bandHeight - blockHeight) / 2 + fontSize * 0.8

  const titleText = lines
    .map(
      (line, i) =>
        `<text x="96" y="${Math.round(firstBaseline + i * lineHeight)}" font-size="${fontSize}" font-weight="700">${escapeXml(line)}</text>`
    )
    .join('\n    ')

  const footer = [author, formatDate(date)].filter(Boolean).join(' · ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0b0f" />
      <stop offset="1" stop-color="#141427" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <g fill="#ffffff" font-family="${FONT_FAMILY}">
    <text x="96" y="120" font-size="30" font-weight="600" opacity="0.75">rabea.sh</text>
    ${titleText}
    <text x="96" y="540" font-size="28" opacity="0.7">${escapeXml(footer)}</text>
  </g>
</svg>`
}

async function exists(file) {
  try {
    await fs.access(file)
    return true
  } catch {
    return false
  }
}

async function renderSvgToPng(svg, outFile, { width, height }) {
  await sharp(Buffer.from(svg), { density: 144 }).resize(width, height).png().toFile(outFile)
}

async function getPosts() {
  try {
    const files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith('.md'))
    const posts = []
    for (const file of files) {
      const raw = await fs.readFile(path.join(POSTS_DIR, file), 'utf8')
      const { frontmatter } = parseFrontmatter(raw)
      posts.push({ slug: file.replace(/\.md$/, ''), ...frontmatter })
    }
    return posts
  } catch {
    return []
  }
}

async function generate() {
  await fs.mkdir(OG_DIR, { recursive: true })
  const written = []
  const skipped = []

  const defaultPng = path.join(PUBLIC_DIR, 'images', 'og-default.png')
  if (FORCE || !(await exists(defaultPng))) {
    const svg = await fs.readFile(path.join(PUBLIC_DIR, 'images', 'og-default.svg'), 'utf8')
    await renderSvgToPng(svg, defaultPng, { width: WIDTH, height: HEIGHT })
    written.push(path.relative(ROOT, defaultPng))
  } else skipped.push(path.relative(ROOT, defaultPng))

  const touchIcon = path.join(PUBLIC_DIR, 'apple-touch-icon.png')
  if (FORCE || !(await exists(touchIcon))) {
    const svg = await fs.readFile(path.join(PUBLIC_DIR, 'favicon.svg'), 'utf8')
    await renderSvgToPng(svg, touchIcon, { width: 180, height: 180 })
    written.push(path.relative(ROOT, touchIcon))
  } else skipped.push(path.relative(ROOT, touchIcon))

  for (const post of await getPosts()) {
    if (post.draft === true) continue
    if (post.coverImage) continue
    const outFile = path.join(OG_DIR, `${post.slug}.png`)
    if (!FORCE && (await exists(outFile))) {
      skipped.push(path.relative(ROOT, outFile))
      continue
    }
    const svg = buildPostCardSvg({
      title: post.title ?? post.slug,
      author: post.author ?? 'Rabea Bader',
      date: post.date,
    })
    await renderSvgToPng(svg, outFile, { width: WIDTH, height: HEIGHT })
    written.push(path.relative(ROOT, outFile))
  }

  // eslint-disable-next-line no-console
  console.log(
    `[generate-og-images] wrote ${written.length}, kept ${skipped.length}${written.length ? `:\n  ${written.join('\n  ')}` : ''}`
  )
}

await generate()
