'use client'
import { useEffect } from 'react'
import DOMPurify from 'isomorphic-dompurify'

type Zone = 'hero-banner' | 'mid-grid' | 'footer-banner'

const ADSENSE_SLOTS: Record<Zone, string> = {
  'hero-banner': 'XXXXXXXXXXXXXXX',
  'mid-grid': 'XXXXXXXXXXXXXXX',
  'footer-banner': 'XXXXXXXXXXXXXXX',
}

const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'

type Props = {
  zone: Zone
  sponsorHtml?: string
  className?: string
}

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

export default function AdSlot({ zone, sponsorHtml, className = '' }: Props) {
  useEffect(() => {
    if (!sponsorHtml) {
      try {
        window.adsbygoogle.push({})
      } catch {}
    }
  }, [sponsorHtml])

  if (sponsorHtml) {
    const clean = DOMPurify.sanitize(sponsorHtml, {
      ALLOWED_TAGS: ['a', 'img', 'picture', 'source', 'p', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'rel', 'class', 'width', 'height', 'srcset', 'media'],
    })
    return (
      <div
        className={`flex justify-center my-4 ${className}`}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    )
  }

  return (
    <div className={`flex justify-center my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOTS[zone]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
