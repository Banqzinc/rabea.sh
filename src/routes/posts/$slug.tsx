import { createFileRoute, Link } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { ShareBar } from '@/components/blog/share-bar'
import { LinkedInIcon } from '@/components/icons'
import { getPostBySlug } from '@/lib/posts'
import { buildArticleSchema, buildSeo, getSiteUrl } from '@/lib/seo'

function buildPostMetaTitle(postTitle: string) {
  const brand = 'rabea.sh'
  const withBrand = `${postTitle} | ${brand}`

  if (withBrand.length >= 30 && withBrand.length <= 60) return withBrand
  if (postTitle.length <= 60) return postTitle
  return `${postTitle.slice(0, 57).trimEnd()}…`
}

export const Route = createFileRoute('/posts/$slug')({
  component: PostPage,
  head: ({ params }) => {
    const post = getPostBySlug(params.slug)

    if (!post) {
      return buildSeo({
        title: 'Post not found | rabea.sh',
        description: 'This post does not exist.',
        path: '/posts',
      })
    }

    const siteUrl = getSiteUrl()
    const postPath = `/posts/${post.slug}` as const

    return buildSeo({
      title: buildPostMetaTitle(post.title),
      description: post.description,
      path: postPath,
      ogType: 'article',
      imageUrl: post.coverImage ? `${siteUrl}${post.coverImage}` : undefined,
      article: {
        datePublished: post.date,
        author: post.author,
        headline: post.title,
      },
    })
  },
})

function PostPage() {
  const { slug } = Route.useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col pt-14">
        <SiteHeader />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="mb-3 text-xl font-semibold sm:text-2xl">Post not found</h1>
          <p className="mb-6 text-sm text-muted-foreground sm:text-base">
            The article you are looking for does not exist yet.
          </p>
          <Link to="/posts" className="text-sm no-underline hover:underline">
            Back to posts
          </Link>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const authorLinkedInUrl =
    post.author === 'Rabea Bader' ? 'https://www.linkedin.com/in/rabea-bader/' : null
  const quidkeyUrl = 'https://quidkey.com'

  const siteUrl = getSiteUrl()
  const canonicalUrl = post.canonical ?? `${siteUrl}/posts/${post.slug}`
  const articleSchema = buildArticleSchema({
    title: post.title,
    description: post.description,
    datePublished: post.date,
    author: post.author,
    url: canonicalUrl,
    imageUrl: post.coverImage ? `${siteUrl}${post.coverImage}` : undefined,
  })

  return (
    <div className="flex min-h-screen flex-col pt-14">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        <article>
          <Link to="/posts" className="text-xs no-underline hover:underline sm:text-sm">
            ← Back to posts
          </Link>
          <h1 className="mb-2 mt-3 text-2xl font-semibold tracking-tight sm:mt-4 sm:text-3xl">
            {post.title}
          </h1>

          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:mb-6 sm:text-sm">
            <span>
              {new Date(post.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <span className="hidden sm:inline">·</span>
            <span>By {post.author}</span>
            {authorLinkedInUrl ? (
              <a
                href={authorLinkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center no-underline hover:underline"
                aria-label={`${post.author} on LinkedIn`}
              >
                <LinkedInIcon className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            ) : null}
            <span className="hidden sm:inline">·</span>
            <a
              href={quidkeyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline hover:underline"
            >
              Quidkey
            </a>
          </div>

          <ShareBar title={post.title} url={canonicalUrl} />

          <p className="mb-6 mt-6 text-base leading-relaxed text-muted-foreground sm:mb-8 sm:text-lg">
            {post.description}
          </p>

          <div className="prose prose-neutral max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
