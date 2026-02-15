export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-4xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 sm:text-sm lg:px-8">
        <p>© {new Date().getFullYear()} rabea.sh</p>
      </div>
    </footer>
  )
}
