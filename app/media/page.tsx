import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Media & Social',
  alternates: { canonical: 'https://hospitality121.com/media' },
  description: 'Watch, listen, and follow Hospitality121 on YouTube, Spotify, Apple Podcasts, TikTok, Instagram, LinkedIn, and X.',
  openGraph: {
    title: 'Media & Social | Hospitality121',
    description: 'The Hospitality121 media hub — podcasts, video, short clips, live sessions, and conference interviews across all platforms.',
    images: [{ url: 'https://hospitality121.com/images/linkedin-banner.jpg', width: 1200, height: 630 }],
  },
}

const PLATFORMS = [
  {
    name: 'YouTube',
    category: 'Video',
    description: 'Full-length interviews, panel discussions, event coverage, and hospitality leadership conversations.',
    href: 'https://youtube.com/@hospitality121',
    color: '#FF0000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'Spotify',
    category: 'Podcast',
    description: 'Every episode of the Hospitality121 podcast, available on-demand. Perfect for your commute or workout.',
    href: 'https://open.spotify.com/show/hospitality121',
    color: '#1DB954',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    name: 'Apple Podcasts',
    category: 'Podcast',
    description: 'Subscribe on Apple Podcasts to get new episodes delivered automatically to your iPhone or iPad.',
    href: 'https://podcasts.apple.com/hospitality121',
    color: '#9B59F5',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M5.34 0A5.328 5.328 0 0 0 0 5.34v13.32A5.328 5.328 0 0 0 5.34 24h13.32A5.328 5.328 0 0 0 24 18.66V5.34A5.328 5.328 0 0 0 18.66 0zm6.525 2.568c2.336 0 4.448.906 6.023 2.384a.366.366 0 0 1 .012.529l-.611.611a.366.366 0 0 1-.506.012 6.39 6.39 0 0 0-4.918-1.86 6.39 6.39 0 0 0-4.918 1.86.366.366 0 0 1-.506-.012l-.611-.611a.366.366 0 0 1 .012-.529 8.287 8.287 0 0 1 6.023-2.384zm-.006 2.721a5.657 5.657 0 0 1 4.084 1.728.366.366 0 0 1-.006.524l-.618.618a.366.366 0 0 1-.506.006 3.858 3.858 0 0 0-2.954-1.212 3.858 3.858 0 0 0-2.954 1.212.366.366 0 0 1-.506-.006l-.618-.618a.366.366 0 0 1-.006-.524 5.657 5.657 0 0 1 4.084-1.728zm.006 2.721a2.982 2.982 0 0 1 2.14.905.366.366 0 0 1-.012.518l-.611.611a.366.366 0 0 1-.518.012 1.458 1.458 0 0 0-1-.36 1.458 1.458 0 0 0-1 .36.366.366 0 0 1-.518-.012l-.611-.611a.366.366 0 0 1-.012-.518 2.982 2.982 0 0 1 2.142-.905zm0 2.13a.852.852 0 1 1 0 1.704.852.852 0 0 1 0-1.704zm0 2.563c1.861 0 3.368 1.547 3.368 3.457 0 1.91-1.507 3.457-3.368 3.457-1.861 0-3.368-1.547-3.368-3.457s1.507-3.457 3.368-3.457zm0 1.524c-1.03 0-1.844.87-1.844 1.933s.814 1.933 1.844 1.933c1.03 0 1.844-.87 1.844-1.933s-.814-1.933-1.844-1.933z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    category: 'Professional',
    description: 'Industry news, expert commentary, job opportunities, and behind-the-scenes from the hospitality world.',
    href: 'https://linkedin.com/company/hospitality121',
    color: '#0A66C2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    category: 'Social',
    description: 'Visual storytelling from hospitality events, hotel openings, behind-the-scenes moments, and short clips.',
    href: 'https://instagram.com/hospitality121',
    color: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    category: 'Short Video',
    description: 'Short-form hospitality insights, rapid-fire industry news, and quick takes from hotel leaders and innovators.',
    href: 'https://tiktok.com/@hospitality121',
    color: '#010101',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    category: 'Social',
    description: 'Real-time hospitality news, event commentary, industry debate, and links to the latest coverage.',
    href: 'https://x.com/hospitality121',
    color: '#000000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

const CONTENT_TYPES = [
  {
    label: 'Short Clips',
    description: 'Bite-sized insights from podcast episodes, events, and expert interviews. 60 seconds of signal, no noise.',
    platforms: ['YouTube', 'TikTok', 'Instagram'],
  },
  {
    label: 'Conference Interviews',
    description: 'On-location coverage from the world\'s leading hospitality conferences and technology summits.',
    platforms: ['YouTube', 'LinkedIn'],
  },
  {
    label: 'Live Sessions',
    description: 'Real-time conversations with hospitality leaders, Q&A sessions, and panel discussions streamed live.',
    platforms: ['LinkedIn', 'YouTube', 'Instagram'],
  },
  {
    label: 'Full Episodes',
    description: 'Complete podcast conversations with executives, founders, and innovators across the hospitality industry.',
    platforms: ['Spotify', 'Apple Podcasts', 'YouTube'],
  },
]

export default function MediaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">Media & Social</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-5">
          Watch, Listen & Follow
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
          Hospitality121 content across every platform — full podcast episodes, short clips, live sessions, conference interviews, and daily industry updates.
        </p>
      </div>

      {/* Platform grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
        {PLATFORMS.map(p => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-surface rounded-xl p-5 border border-transparent hover:border-gold/30 hover:shadow-md transition-all flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div style={{ color: p.color }} className="opacity-90 group-hover:opacity-100 transition-opacity">
                {p.icon}
              </div>
              <span className="text-xs font-bold tracking-widest text-muted uppercase">{p.category}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-1">{p.name}</p>
              <p className="text-xs text-muted leading-relaxed">{p.description}</p>
            </div>
            <span className="text-xs font-semibold text-gold mt-auto">Follow &rarr;</span>
          </a>
        ))}
      </div>

      {/* Content types */}
      <div className="mb-14">
        <h2 className="font-serif text-2xl font-bold mb-2">What We Publish</h2>
        <p className="text-muted text-sm mb-8">Different formats for different moments — wherever you are and however you like to consume.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CONTENT_TYPES.map(ct => (
            <div key={ct.label} className="bg-surface rounded-xl p-6 border border-gray-100">
              <h3 className="font-serif text-lg font-bold mb-2">{ct.label}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{ct.description}</p>
              <div className="flex flex-wrap gap-2">
                {ct.platforms.map(plat => (
                  <span key={plat} className="text-xs font-semibold bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full">
                    {plat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Podcast CTA */}
      <div className="bg-gray-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-serif text-xl font-bold mb-1 text-gray-50">New episodes every week.</p>
          <p className="text-gray-400 text-sm">Subscribe on your preferred platform so you never miss a conversation.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <a
            href="https://open.spotify.com/show/hospitality121"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1DB954] text-gray-900 font-bold px-5 py-3 rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            Spotify
          </a>
          <Link
            href="/podcasts"
            className="bg-gold text-gray-900 font-bold px-5 py-3 rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            All Episodes
          </Link>
        </div>
      </div>
    </div>
  )
}
