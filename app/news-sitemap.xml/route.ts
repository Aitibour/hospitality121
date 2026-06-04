import { buildGoogleNewsSitemap } from '@/lib/syndication'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildGoogleNewsSitemap(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800',
    },
  })
}
