import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav aria-label="Main" className="bg-navy border-b border-surface sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Hospitality121" width={40} height={40} />
          <div className="leading-tight">
            <span className="block text-white font-serif font-bold text-sm tracking-wide">HOSPITALITY</span>
            <span className="block text-gold font-serif font-bold text-sm tracking-widest">ONE 2 ONE</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {['PODCASTS', 'INSIGHTS', 'EVENTS', 'ABOUT'].map(link => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-white text-sm font-medium tracking-wider hover:text-gold transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
        <Link
          href="/subscribe"
          className="bg-gold text-navy text-sm font-bold px-5 py-2 rounded hover:opacity-90 transition-opacity"
        >
          Subscribe
        </Link>
      </div>
    </nav>
  )
}
