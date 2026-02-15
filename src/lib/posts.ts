type Frontmatter = {
  title: string
  description?: string
  date: string
  author?: string
  tags?: string[]
  canonical?: string
  draft?: boolean
  coverImage?: string
}

export type Post = {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  canonical?: string
  coverImage?: string
  content: string
}

const markdownModules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function filePathToSlug(filePath: string) {
  return filePath.split('/').at(-1)?.replace(/\.md$/, '') ?? ''
}

function toPlainText(markdown: string) {
  return (
    markdown
      // Remove fenced code blocks
      .replace(/```[\s\S]*?```/g, ' ')
      // Remove inline code
      .replace(/`[^`]*`/g, ' ')
      // Convert links/images to their visible text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Drop headings/blockquote markers/list bullets
      .replace(/^[ \t]*#{1,6}[ \t]+/gm, '')
      .replace(/^[ \t]*>[ \t]?/gm, '')
      .replace(/^[ \t]*[-*+][ \t]+/gm, '')
      .replace(/^[ \t]*\d+\.[ \t]+/gm, '')
      // Remove emphasis markers
      .replace(/[*_~]+/g, '')
      // Collapse whitespace
      .replace(/\s+/g, ' ')
      .trim()
  )
}

function buildDescriptionFromContent(content: string, maxLength = 160) {
  const plain = toPlainText(content)
  if (!plain) return 'Read the full post on rabea.sh.'

  if (plain.length <= maxLength) return plain

  // Trim to a word boundary where possible.
  const truncated = plain.slice(0, maxLength + 1)
  const lastSpace = truncated.lastIndexOf(' ')
  return (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated.slice(0, maxLength)).trim()
}

function parseFrontmatter(raw: string): { frontmatter: Frontmatter; content: string } {
  const trimmed = raw.trimStart()
  if (!trimmed.startsWith('---\n')) {
    throw new Error('Post is missing frontmatter')
  }

  const endIndex = trimmed.indexOf('\n---\n', 4)
  if (endIndex === -1) {
    throw new Error('Frontmatter is not closed with ---')
  }

  const block = trimmed.slice(4, endIndex)
  const content = trimmed.slice(endIndex + 5).trim()
  const lines = block.split('\n')
  const data: Record<string, unknown> = {}
  let currentArrayKey: string | null = null

  for (const line of lines) {
    const arrayItemMatch = line.match(/^\s*-\s+(.*)$/)
    if (arrayItemMatch && currentArrayKey) {
      const rawValue = arrayItemMatch[1].trim()
      const value = rawValue.replace(/^['"]|['"]$/g, '')
      const current = data[currentArrayKey]
      if (!Array.isArray(current)) {
        data[currentArrayKey] = [value]
      } else {
        current.push(value)
      }
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
    if (value === 'true') {
      data[key] = true
    } else if (value === 'false') {
      data[key] = false
    } else {
      data[key] = value
    }
    currentArrayKey = null
  }

  return { frontmatter: data as Frontmatter, content }
}

function parseMarkdown(filePath: string, raw: string): Post {
  const slug = filePathToSlug(filePath)
  const { frontmatter: fm, content } = parseFrontmatter(raw)

  if (!fm.title || !fm.date) {
    throw new Error(`Missing required frontmatter in ${filePath}`)
  }

  const description =
    typeof fm.description === 'string' && fm.description.trim().length > 0
      ? fm.description.trim()
      : buildDescriptionFromContent(content)

  return {
    slug,
    title: fm.title,
    description,
    date: fm.date,
    author: fm.author ?? 'Rabea Bader',
    tags: fm.tags ?? [],
    canonical: fm.canonical,
    coverImage: fm.coverImage,
    content,
  }
}

function byDateDesc(a: Post, b: Post) {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
}

export function getAllPosts() {
  return Object.entries(markdownModules)
    .map(([filePath, raw]) => parseMarkdown(filePath, raw))
    .sort(byDateDesc)
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((post) => post.slug === slug)
}
