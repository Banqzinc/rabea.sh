import { Link } from '@tanstack/react-router'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-4xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 sm:text-sm lg:px-8">
        <nav className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link to="/about" className="no-underline hover:underline">
            About
          </Link>
          <Link to="/contact" className="no-underline hover:underline">
            Contact
          </Link>
          <Link to="/privacy" className="no-underline hover:underline">
            Privacy
          </Link>
        </nav>
        <p>© {new Date().getFullYear()} rabea.sh</p>
      </div>
    </footer>
  )
}
