// Owner-requested temporary display override. Set to false to restore live counts.
export const TEMPORARY_SIMULATED_VIEWS = true

// A stable pseudo-random value keeps the same article consistent across the site
// and avoids server/client hydration differences. This never changes real data.
export function simulatedArticleViews(slug: string) {
  let hash = 2166136261
  for (const character of slug) {
    hash = Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0
  }
  return 100 + hash % 3959
}
