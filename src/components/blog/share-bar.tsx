import { useMemo, useState } from 'react'
import { Link, Check } from 'lucide-react'
import { XIcon, WhatsAppIcon, ShareIcon } from '@/components/icons'

type ShareBarProps = {
  title: string
  url: string
}

export function ShareBar({ title, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = useMemo(() => encodeURIComponent(url), [url])
  const encodedText = useMemo(() => encodeURIComponent(`${title} ${url}`), [title, url])
  const encodedTitle = useMemo(() => encodeURIComponent(title), [title])

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
  const whatsappUrl = `https://wa.me/?text=${encodedText}`

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  async function handleNativeShare() {
    if (!navigator.share) return
    await navigator.share({ title, url })
  }

  const buttonClasses =
    'inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-xs no-underline transition-colors hover:border-border-hover hover:bg-muted sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-sm'

  const iconClasses = 'h-4 w-4 sm:h-3.5 sm:w-3.5'

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-0">
      <span className="text-xs text-muted-foreground sm:text-sm">Share:</span>
      {'share' in navigator ? (
        <button
          type="button"
          onClick={handleNativeShare}
          className={buttonClasses}
          aria-label="Share"
        >
          <ShareIcon className={iconClasses} />
        </button>
      ) : null}
      <a
        href={xShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        aria-label="Share on X"
      >
        <XIcon className={iconClasses} />
        <span className="sr-only sm:not-sr-only">X</span>
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        aria-label="Share on WhatsApp"
      >
        <WhatsAppIcon className={iconClasses} />
        <span className="sr-only sm:not-sr-only">WhatsApp</span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className={buttonClasses}
        aria-label={copied ? 'Copied' : 'Copy link'}
      >
        {copied ? <Check className={iconClasses} /> : <Link className={iconClasses} />}
        <span className="sr-only sm:not-sr-only">{copied ? 'Copied!' : 'Copy'}</span>
      </button>
    </div>
  )
}
