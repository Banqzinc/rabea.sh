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

const DEFAULT_OG_IMAGE_PATH = '/images/og-default.svg'

type BuildSeoInput = {
  title: string
  description: string
  path: `/${string}` | '/'
  ogType?: 'website' | 'article'
  imageUrl?: string
  article?: {
    datePublished: string
    dateModified?: string
    author: string
    headline: string
  }
}

export function buildSeo({
  title,
  description,
  path,
  ogType = 'website',
  imageUrl,
  article,
}: BuildSeoInput) {
  const url = new URL(path, getSiteUrl()).toString()
  const trimmedDescription = description.trim()
  const normalizedDescription =
    trimmedDescription.length > 160 ? `${trimmedDescription.slice(0, 157).trimEnd()}…` : trimmedDescription

  const image = imageUrl
    ? new URL(imageUrl, getSiteUrl()).toString()
    : new URL(DEFAULT_OG_IMAGE_PATH, getSiteUrl()).toString()

  const meta = [
    { title },
    { name: 'description', content: normalizedDescription },
    { property: 'og:title', content: title },
    { property: 'og:description', content: normalizedDescription },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:alt', content: 'rabea.sh — tech blog and founder journey' },
    { property: 'og:site_name', content: 'rabea.sh' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: normalizedDescription },
    { name: 'twitter:image', content: image },
    { name: 'twitter:image:alt', content: 'rabea.sh — tech blog and founder journey' },
  ]

  if (article) {
    meta.push(
      { property: 'article:published_time', content: article.datePublished },
      { property: 'article:author', content: article.author }
    )
    if (article.dateModified) {
      meta.push({ property: 'article:modified_time', content: article.dateModified })
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
  url,
  imageUrl,
}: {
  title: string
  description: string
  datePublished: string
  dateModified?: string
  author: string
  url: string
  imageUrl?: string
}) {
  const siteUrl = getSiteUrl()
  const publisherLogoUrl = new URL('/favicon.svg', siteUrl).toString()

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl ?? new URL(DEFAULT_OG_IMAGE_PATH, siteUrl).toString(),
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'rabea.sh',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogoUrl,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}
