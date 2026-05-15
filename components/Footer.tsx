import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-navy mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image src="/images/Logo.png" alt="Hospitality121" width={48} height={48} />
          <div>
            <p className="font-serif font-bold text-sm">
              <span className="text-white">HOSPITALITY </span>
              <span className="text-gold">ONE 2 ONE</span>
            </p>
            <p className="text-muted text-xs">Real Leaders. Real Conversations. Real Impact.</p>
          </div>
        </div>
        <nav aria-label="Footer">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted">
            {['Podcasts', 'Insights', 'Events', 'About', 'Contact'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="hover:text-gold transition-colors">{l}</Link>
            ))}
          </div>
        </nav>
        <div className="flex gap-4">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
            className="text-muted hover:text-gold transition-colors text-sm font-medium">LinkedIn</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
            className="text-muted hover:text-gold transition-colors text-sm font-medium">Instagram</a>
          <a href="https://spotify.com" target="_blank" rel="noopener noreferrer"
            className="text-muted hover:text-gold transition-colors text-sm font-medium">Spotify</a>
        </div>
      </div>
      <p className="max-w-7xl mx-auto px-4 text-center text-muted text-xs pb-6">
        © {new Date().getFullYear()} Hospitality One 2 One. All rights reserved.
      </p>
    </footer>
  )
}
