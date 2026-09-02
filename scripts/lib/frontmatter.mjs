/**
 * Minimal frontmatter parser shared by build scripts.
 * Mirrors the parser in src/lib/posts.ts (keep the two in sync).
 */
export function parseFrontmatter(raw) {
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
