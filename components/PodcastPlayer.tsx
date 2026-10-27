type Props = {
  title: string
  guest: string
  duration: string
  embedUrl?: string
  showNotes?: string
}

function approvedEmbed(value?: string) {
  try {
    const url = new URL(value || '')
    return url.protocol === 'https:' && !url.username && !url.password && !url.port && (
      (url.hostname === 'open.spotify.com' && url.pathname.startsWith('/embed/episode/')) ||
      (url.hostname === 'www.youtube.com' && url.pathname.startsWith('/embed/'))
    ) ? url.href : null
  } catch { return null }
}

export default function PodcastPlayer({ title, guest, duration, embedUrl, showNotes }: Props) {
  const src = approvedEmbed(embedUrl)
  return (
    <section aria-label="Episode audio" className="mb-10 bg-surface rounded-xl overflow-hidden border border-muted/10">
      <div className="p-5">
        <p className="text-xs font-bold tracking-widest text-gold uppercase mb-1">Hospitality121 Podcast</p>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-muted">{guest} · {duration}</p>
      </div>
      {src ? (
        <iframe src={src} title={`Listen to ${title}`} width="100%" height="152" loading="lazy" allow="encrypted-media; fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <p className="px-5 pb-5 text-sm text-muted">Audio is not available on this page. <a href="/contact" className="text-gold underline">Contact the editorial team</a> for episode availability.</p>
      )}
      {showNotes && <div className="px-5 pb-5"><h2 className="text-sm font-bold mb-2">Episode notes</h2><p className="text-sm text-muted leading-relaxed">{showNotes}</p></div>}
    </section>
  )
}
