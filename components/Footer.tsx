import Image from 'next/image'
import Link from 'next/link'

const SECTIONS = [
  {
    title: 'Authority',
    links: [
      { label: 'Hospitality News', href: '/news' },
      { label: 'Hospitality Trends', href: '/hospitality-trends' },
      { label: 'Leadership', href: '/hospitality-leadership' },
      { label: 'Operations', href: '/hotel-operations' },
      { label: 'Recruitment', href: '/hospitality-recruitment' },
    ],
  },
  {
    title: 'Technology',
    links: [
      { label: 'Hotel Technology', href: '/technology' },
      { label: 'Hospitality AI', href: '/technology/ai' },
      { label: 'PMS Solutions', href: '/technology/pms-pos' },
      { label: 'Cybersecurity', href: '/technology/cybersecurity' },
      { label: 'Smart Hotels', href: '/hotel-operations' },
    ],
  },
  {
    title: 'Experience',
    links: [
      { label: 'Guest Experience', href: '/guest-experience' },
      { label: 'Luxury Hospitality', href: '/luxury-hospitality' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Smart Operations', href: '/sustainability/smart-operations' },
    ],
  },
  {
    title: 'Podcasts',
    links: [
      { label: 'All Episodes', href: '/podcasts' },
      { label: 'Executive Interviews', href: '/podcasts' },
      { label: 'Hospitality Leaders', href: '/podcasts' },
      { label: 'Tech Conversations', href: '/podcasts' },
    ],
  },
  {
    title: 'Collaborate',
    links: [
      { label: 'Become a Guest', href: '/collaborate#guest' },
      { label: 'Submit an Article', href: '/collaborate#article' },
      { label: 'Sponsorships', href: '/advertise' },
      { label: 'Partnerships', href: '/collaborate#partnership' },
    ],
  },
]

const LEGAL = [
  { label: 'About', href: '/about' },
  { label: 'Editorial Standards', href: '/editorial-standards' },
  { label: 'Contact', href: '/contact' },
  { label: 'Resources', href: '/resources' },
  { label: 'Subscribe', href: '/subscribe' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      {/* CTA band */}
      <div className="bg-gray-900 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-xl font-bold mb-1 text-gray-50">Stay at the forefront of hospitality.</p>
            <p className="text-gray-400 text-sm">
              Connecting hospitality leadership, technology, innovation, and the future of guest experience.
            </p>
          </div>
          <Link
            href="/subscribe"
            className="shrink-0 bg-gold text-gray-900 font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            Subscribe Free
          </Link>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/images/Logo.png" alt="Hospitality121" width={44} height={44} className="rounded-full" />
              <div className="leading-tight">
                <span className="block font-serif font-bold text-xs tracking-wide text-gray-900">HOSPITALITY</span>
                <span className="block font-serif font-bold text-xs tracking-widest text-gold">ONE 2 ONE</span>
              </div>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed mb-1">
              North American hospitality media — Vancouver, BC, Canada.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Covering technology, AI, sustainability, leadership, and the future of guest experience across the US, Canada, and globally.
            </p>
            <div className="flex gap-3">
              <a href="https://linkedin.com/company/hospitality121" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gold transition-colors font-medium">LinkedIn</a>
              <a href="https://instagram.com/hospitality121" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gold transition-colors font-medium">Instagram</a>
              <a href="https://x.com/hospitality121" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gold transition-colors font-medium">X</a>
            </div>
          </div>

          {/* Nav sections */}
          {SECTIONS.map(section => (
            <div key={section.title}>
              <p className="text-xs font-bold tracking-widest text-gray-900 uppercase mb-3">{section.title}</p>
              <ul className="flex flex-col gap-2">
                {section.links.map(l => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-xs text-gray-500 hover:text-gold transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Hospitality One 2 One. Vancouver, BC, Canada. All rights reserved.
          </p>
          <div className="flex gap-5">
            {LEGAL.map(l => (
              <Link key={l.href} href={l.href} className="text-xs text-gray-400 hover:text-gold transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
