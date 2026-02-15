import { createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/about')({
  component: AboutPage,
  head: () =>
    buildSeo({
      title: 'About Rabea Bader — engineering + founder notes | rabea.sh',
      description:
        "I’m the CTO and co-founder of Quidkey. I share our journey building global payment infrastructure—architecture, challenges, tradeoffs, and lessons learned.",
      path: '/about',
    }),
})

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col pt-14">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight sm:text-3xl">About</h1>
        <div className="prose prose-neutral max-w-none">
          <p>
            I’m the CTO and co-founder of Quidkey, and I’ll be sharing our journey building a global
            payment infrastructure: architecture, challenges, tradeoffs, and lessons learned.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

