function normalizeOrigin(input: string) {
  try {
    const url = new URL(input)
    return url.origin
  } catch {
    try {
      const url = new URL(`https://${input}`)
      return url.origin
    } catch {
      return 'https://rabea.sh'
    }
  }
}

export function getSiteUrl() {
  const envUrl = import.meta.env.VITE_SITE_URL as string | undefined
  if (envUrl) return normalizeOrigin(envUrl)
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin
  return 'https://rabea.sh'
}

const SITE_NAME = 'rabea.sh'
const DEFAULT_OG_IMAGE_PATH = '/images/og-default.png'
const PUBLISHER_LOGO_PATH = '/apple-touch-icon.png'

/** Social cards are rendered at build time by scripts/generate-og-images.mjs. */
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

/**
 * Absolute URL of a post's social image: an explicit coverImage wins,
 * otherwise the generated title card under /images/og/<slug>.png.
 */
export function getPostOgImageUrl(post: { slug: string; coverImage?: string }) {
  const imagePath = post.coverImage ?? `/images/og/${post.slug}.png`
  return new URL(imagePath, getSiteUrl()).toString()
}

function normalizeKeywords(keywords?: string | string[]) {
  if (!keywords) return undefined
  const list = (typeof keywords === 'string' ? keywords.split(',') : keywords)
    .map((k) => k.trim())
    .filter(Boolean)
  return list.length ? list : undefined
}

type BuildSeoInput = {
  title: string
  /** og:title / twitter:title when the share title should differ from the <title> (e.g. no brand suffix). */
  ogTitle?: string
  description: string
  /** Powers meta keywords and article:tag. Low ranking weight, but cheap and mirrors quidkey.com. */
  keywords?: string | string[]
  path: `/${string}` | '/'
  ogType?: 'website' | 'article'
  imageUrl?: string
  imageWidth?: number
  imageHeight?: number
  imageAlt?: string
  article?: {
    datePublished: string
    dateModified?: string
    author: string
    headline: string
  }
}

export function buildSeo({
  title,
  ogTitle,
  description,
  keywords,
  path,
  ogType = 'website',
  imageUrl,
  imageWidth = OG_IMAGE_WIDTH,
  imageHeight = OG_IMAGE_HEIGHT,
  imageAlt,
  article,
}: BuildSeoInput) {
  const url = new URL(path, getSiteUrl()).toString()
  const trimmedDescription = description.trim()
  const normalizedDescription =
    trimmedDescription.length > 160 ? `${trimmedDescription.slice(0, 157).trimEnd()}…` : trimmedDescription

  const image = new URL(imageUrl ?? DEFAULT_OG_IMAGE_PATH, getSiteUrl()).toString()
  const alt = imageAlt ?? `${SITE_NAME} — tech blog and founder journey`
  const keywordList = normalizeKeywords(keywords)
  const sharingTitle = ogTitle ?? title

  const meta: Array<Record<string, string>> = [
    { title },
    { name: 'description', content: normalizedDescription },
    ...(keywordList ? [{ name: 'keywords', content: keywordList.join(', ') }] : []),
    { property: 'og:title', content: sharingTitle },
    { property: 'og:description', content: normalizedDescription },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: String(imageWidth) },
    { property: 'og:image:height', content: String(imageHeight) },
    { property: 'og:image:alt', content: alt },
    { property: 'og:site_name', content: SITE_NAME },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: sharingTitle },
    { name: 'twitter:description', content: normalizedDescription },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: alt },
  ]

  if (article) {
    meta.push(
      { property: 'article:published_time', content: article.datePublished },
      { property: 'article:author', content: article.author }
    )
    if (article.dateModified) {
      meta.push({ property: 'article:modified_time', content: article.dateModified })
    }
    // One tag entry: the router dedupes <meta> by property, so per-tag entries collapse to the last one.
    if (keywordList) {
      meta.push({ property: 'article:tag', content: keywordList.join(', ') })
    }
  }

  return {
    title,
    meta,
    links: [{ rel: 'canonical', href: url }],
  }
}

export function buildArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  author,
  authorUrl,
  url,
  imageUrl,
  keywords,
}: {
  title: string
  description: string
  datePublished: string
  dateModified?: string
  author: string
  authorUrl?: string
  url: string
  imageUrl?: string
  keywords?: string | string[]
}) {
  const siteUrl = getSiteUrl()
  const keywordList = normalizeKeywords(keywords)

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl ?? new URL(DEFAULT_OG_IMAGE_PATH, siteUrl).toString(),
    datePublished,
    dateModified: dateModified ?? datePublished,
    ...(keywordList ? { keywords: keywordList } : {}),
    author: {
      '@type': 'Person',
      name: author,
      ...(authorUrl ? { url: authorUrl } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: new URL(PUBLISHER_LOGO_PATH, siteUrl).toString(),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}
