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
        "I’m Rabea Bader. I write about building Quidkey, shipping software faster, and the engineering/product tradeoffs behind real decisions.",
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
            I’m Rabea. I build at Quidkey and write about engineering decisions, product tradeoffs, and
            founder lessons from the road.
          </p>
          <p>
            If you’re reading this via search: this site is intentionally small and fast. Posts are
            based on first-hand experience and usually include concrete tactics you can apply.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

