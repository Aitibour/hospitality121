import { getAllContent } from '@/lib/content'
import { selectPublishedHeroItems } from '@/scripts/lib/published-hero.mjs'

export const dynamic = 'force-static'

export function GET() {
  return Response.json({ updatedAt: new Date().toISOString(), items: selectPublishedHeroItems(getAllContent()) })
}
