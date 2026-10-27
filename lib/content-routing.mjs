// Preserve the existing news URL while giving the previously shadowed blog a distinct route.
export function publicContentSlug(type, fileSlug) {
  return type === 'blog' && fileSlug === 'summer-travel-trends' ? 'summer-travel-trends-blog' : fileSlug
}

export function contentFileSlug(type, publicSlug) {
  return type === 'blog' && publicSlug === 'summer-travel-trends-blog' ? 'summer-travel-trends' : publicSlug
}
