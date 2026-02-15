import { createFileRoute, Link } from '@tanstack/react-router'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { getAllPosts } from '@/lib/posts'
import { buildSeo, getSiteUrl } from '@/lib/seo'

export const Route = createFileRoute('/posts/')({
  component: PostsIndexPage,
  head: () =>
    buildSeo({
      title: 'Posts on shipping software and founder lessons | rabea.sh',
      description:
        'All articles on rabea.sh: software delivery, engineering decisions, product thinking, and founder lessons from building at Quidkey.',
      path: '/posts',
    }),
})

function PostsIndexPage() {
  const posts = getAllPosts()
  const siteUrl = getSiteUrl()
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'rabea.sh — Posts',
    url: `${siteUrl}/posts`,
    author: { '@type': 'Person', name: 'Rabea Bader' },
  }

  return (
    <div className="flex min-h-screen flex-col pt-14">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
        <h1 className="mb-6 text-2xl font-semibold tracking-tight sm:mb-10 sm:text-3xl">Posts</h1>
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mb-10 sm:text-base">
          Essays on software delivery, engineering craft, product thinking, and founder learnings —
          written from first-hand experience building at Quidkey.
        </p>
        <div className="space-y-4 sm:space-y-5">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="post-card rounded-lg border border-border p-4 sm:p-5"
            >
              <p className="mb-1 text-xs text-muted-foreground sm:mb-2 sm:text-sm">
                {new Date(post.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <h2 className="mb-1 text-lg font-semibold leading-snug sm:mb-2 sm:text-xl">
                <Link to="/posts/$slug" params={{ slug: post.slug }} className="no-underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {post.description}
              </p>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
