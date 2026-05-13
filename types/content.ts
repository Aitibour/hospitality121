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

export type ContentItem = Article | Podcast
