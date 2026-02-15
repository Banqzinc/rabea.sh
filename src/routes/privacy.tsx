import { createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
  head: () =>
    buildSeo({
      title: 'Privacy policy for rabea.sh — data, cookies, contact',
      description:
        'Privacy policy for rabea.sh. Learn what data is collected (if any), how it is used, what cookies may be set, and how to contact the site owner.',
      path: '/privacy',
    }),
})

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col pt-14">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight sm:text-3xl">Privacy policy</h1>
        <div className="prose prose-neutral max-w-none">
          <p>
            This is a small, content-focused personal site. I don’t sell your data.
          </p>
          <h2>What I collect</h2>
          <p>
            This site may collect standard, aggregated analytics (for example page views) through the
            hosting provider or analytics tooling. I don’t knowingly collect sensitive personal
            information.
          </p>
          <h2>Cookies</h2>
          <p>
            If analytics are enabled, they may use cookies or similar technologies. You can block
            cookies in your browser settings.
          </p>
          <h2>Contact</h2>
          <p>
            Questions? Email{' '}
            <a href="mailto:hello@rabea.sh">hello@rabea.sh</a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

