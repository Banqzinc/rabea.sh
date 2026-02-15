import { createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  head: () =>
    buildSeo({
      title: 'Contact Rabea Bader — posts and speaking | rabea.sh',
      description:
        'Get in touch with Rabea Bader about posts, speaking, or engineering/product discussions. Email is the fastest way to reach me.',
      path: '/contact',
    }),
})

function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col pt-14">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight sm:text-3xl">Contact</h1>
        <div className="prose prose-neutral max-w-none">
          <p>
            The easiest way to reach me is email:{' '}
            <a href="mailto:hello@rabea.sh">hello@rabea.sh</a>.
          </p>
          <p>
            If it’s about a specific post, include the link so I can respond with context.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

