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
  guestTitle?: string
  guestLinkedIn?: string
  guestBio?: string
  keyTakeaways?: string[]
  showNotes?: string
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
  registrationUrl?: string
}

export type BlogPost = {
  type: 'blog'
  slug: string
  title: string
  titleFr?: string
  excerpt?: string
  excerptFr?: string
  category: string
  author: string
  authorAvatar: string
  date: string
  readTime: string
  image: string
  featured: boolean
  source?: string
  sourceUrl?: string
}

export type ContentItem = (Article | Podcast | NewsItem | EventItem | BlogPost) & {
  status?: 'draft' | 'review' | 'published'
  description?: string
  imageAlt?: string
  imageCredit?: string
  imageSource?: string
  imageLicense?: string
  dateModified?: string
}
