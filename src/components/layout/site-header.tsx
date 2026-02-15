import { Link } from '@tanstack/react-router'

export function SiteHeader() {
  return (
    <header className="header-blur fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="no-underline">
          <span className="text-base font-semibold tracking-tight sm:text-lg">rabea.sh</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            to="/posts"
            className="text-foreground no-underline transition-colors hover:text-muted-foreground"
          >
            Posts
          </Link>
        </nav>
      </div>
    </header>
  )
}
