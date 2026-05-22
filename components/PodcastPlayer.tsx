type Props = {
  title: string
  guest: string
  duration: string
  embedUrl?: string
  showNotes?: string
}

const PLATFORMS = [
  {
    name: 'Spotify',
    href: 'https://open.spotify.com',
    color: '#1DB954',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    name: 'Apple Podcasts',
    href: 'https://podcasts.apple.com',
    color: '#A020F0',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.003 0C5.376 0 0 5.376 0 12.003 0 18.629 5.376 24 12.003 24 18.629 24 24 18.629 24 12.003 24 5.376 18.629 0 12.003 0zm0 4.286c2.67 0 4.84 2.17 4.84 4.84 0 2.067-1.307 3.84-3.16 4.527.013.173.026.347.026.52 0 .773-.28 1.48-.72 2.04l1.2 4.494a.643.643 0 01-.626.8H10.44a.643.643 0 01-.626-.8l1.2-4.493a3.178 3.178 0 01-.72-2.04c0-.174.013-.348.026-.52-1.853-.688-3.16-2.46-3.16-4.528 0-2.67 2.17-4.84 4.84-4.84z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@hospitality121',
    color: '#FF0000',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
]

export default function PodcastPlayer({ title, guest, duration, embedUrl, showNotes }: Props) {
  if (embedUrl) {
    return (
      <div className="mb-10 rounded-xl overflow-hidden">
        <iframe
          src={embedUrl}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      </div>
    )
  }

  return (
    <div className="mb-10 bg-surface rounded-xl overflow-hidden border border-muted/10">
      {/* Player header */}
      <div className="flex items-center gap-4 p-5 border-b border-muted/10">
        <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8922E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold tracking-widest text-gold uppercase mb-0.5">Hospitality121 Podcast</p>
          <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
          <p className="text-xs text-muted">{guest} · {duration}</p>
        </div>
      </div>

      {/* Listen on */}
      <div className="px-5 py-4">
        <p className="text-xs font-bold tracking-widest text-muted uppercase mb-3">Listen on</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(p => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg border border-muted/20 hover:border-gold/40 hover:text-gold transition-colors"
            >
              <span style={{ color: p.color }}>{p.icon}</span>
              {p.name}
            </a>
          ))}
        </div>
      </div>

      {showNotes && (
        <div className="px-5 pb-5">
          <p className="text-xs font-bold tracking-widest text-muted uppercase mb-2">Episode notes</p>
          <p className="text-sm text-muted leading-relaxed">{showNotes}</p>
        </div>
      )}
    </div>
  )
}
