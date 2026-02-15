import { createFileRoute, Link } from '@tanstack/react-router'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { getAllPosts } from '@/lib/posts'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () =>
    buildSeo({
      title: 'rabea.sh | Tech blog and founder journey',
      description:
        'Personal notes on building products, shipping software, and the founder journey at Quidkey.',
      path: '/',
    }),
})

function HomePage() {
  const posts = getAllPosts()
  const latestPosts = posts.slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col pt-14">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="mb-10 sm:mb-14">
          <h1 className="mb-3 text-2xl font-semibold tracking-tight sm:mb-4 sm:text-4xl">
            Hi, I'm Rabea.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            I write about how we build at Quidkey: engineering decisions, product tradeoffs, and
            founder lessons from the road.
          </p>
        </section>

        <section className="mb-4 flex items-center justify-between sm:mb-6">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Latest posts</h2>
          <Link to="/posts" className="text-xs no-underline hover:underline sm:text-sm">
            See all posts
          </Link>
        </section>

        <section className="space-y-4 sm:space-y-5">
          {latestPosts.map((post) => (
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
              <h3 className="mb-1 text-lg font-semibold leading-snug sm:mb-2 sm:text-xl">
                <Link to="/posts/$slug" params={{ slug: post.slug }} className="no-underline">
                  {post.title}
                </Link>
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {post.description}
              </p>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
