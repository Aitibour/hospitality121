export type Article = {
  type: 'article'
  slug: string
  title: string
  category: string
  author: string
  authorAvatar: string
  date: string
  readTime: string
  image: string
  featured: boolean
}

export type Podcast = {
  type: 'podcast'
  slug: string
  title: string
  category: string
  guest: string
  guestAvatar: string
  date: string
  duration: string
  image: string
  featured: boolean
  embedUrl: string
}

export type NewsItem = {
  type: 'news'
  slug: string
  title: string
  category: string
  author: string
  authorAvatar: string
  date: string
  readTime: string
  image: string
  featured: boolean
}

export type EventItem = {
  type: 'event'
  slug: string
  title: string
  category: string
  organizer: string
  organizerAvatar: string
  date: string
  eventDate: string
  location: string
  image: string
  featured: boolean
}

export type ContentItem = Article | Podcast | NewsItem | EventItem
