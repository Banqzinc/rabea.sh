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

const DEFAULT_OG_IMAGE = 'https://rabea.sh/images/og-default.png'

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
  const image = imageUrl ?? DEFAULT_OG_IMAGE
  const meta = [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:site_name', content: 'rabea.sh' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
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
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl ?? DEFAULT_OG_IMAGE,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Person',
      name: 'Rabea Bader',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}
