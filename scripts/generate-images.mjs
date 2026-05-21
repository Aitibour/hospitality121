/**
 * Download free stock images from Pexels for all 54 content pieces.
 * Get your free API key at: https://www.pexels.com/api/ (instant, no credit card)
 * Usage: node --env-file=.env.local scripts/generate-images.mjs
 * Set PEXELS_API_KEY in .env.local
 */

import fs from 'fs'
import path from 'path'
import https from 'https'

const API_KEY = process.env.PEXELS_API_KEY
const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'content')

if (!API_KEY) {
  console.error('Missing PEXELS_API_KEY in .env.local')
  console.error('Get a free key at: https://www.pexels.com/api/')
  process.exit(1)
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

// Each entry: slug + search keywords relevant to the article
const IMAGES = [
  // ARTICLES
  { slug: 'ai-in-guest-experience',            q: 'luxury hotel lobby technology modern' },
  { slug: 'architecture-guest-experience',     q: 'luxury hotel room interior design modern' },
  { slug: 'art-of-personalisation',            q: 'luxury hotel suite elegant flowers welcome' },
  { slug: 'food-beverage-hotel-revenue',       q: 'fine dining restaurant hotel elegant' },
  { slug: 'future-of-luxury-hospitality',      q: 'luxury resort infinity pool ocean sunset' },
  { slug: 'hiring-retaining-talent-2026',      q: 'hotel hospitality staff professional uniform' },
  { slug: 'hotel-loyalty-evolution',           q: 'luxury hotel welcome champagne amenities' },
  { slug: 'interview-hotel-cio-ai-strategy',   q: 'hotel operations technology digital screens' },
  { slug: 'interview-startup-founder-hotel-tech', q: 'modern workspace hospitality technology startup' },
  { slug: 'revenue-management-strategies',     q: 'boutique hotel exterior architecture evening' },
  { slug: 'sustainable-hotels-2026',           q: 'eco luxury hotel green architecture sustainable' },
  { slug: 'wellness-tourism-billion-market',   q: 'luxury spa hotel pool serene wellness' },
  // BLOG
  { slug: 'designing-for-instagram',           q: 'instagram hotel interior flowers aesthetic design' },
  { slug: 'five-trends-reshaping-hospitality', q: 'luxury hotel atrium modern architecture interior' },
  { slug: 'future-of-hotel-loyalty',           q: 'luxury hotel suite personal welcome gift' },
  { slug: 'gm-morning-routine',                q: 'grand hotel lobby morning light empty elegant' },
  { slug: 'how-to-build-hotel-culture',        q: 'hotel team hospitality professional service' },
  { slug: 'lessons-from-ritz-carlton',         q: 'five star hotel service silver tray elegant' },
  { slug: 'revenue-beyond-rooms',              q: 'luxury hotel resort spa pool restaurant panoramic' },
  { slug: 'what-guests-want-2026',             q: 'luxury hotel room cozy modern city view' },
  // EVENTS
  { slug: 'asia-pacific-hotel-summit-singapore', q: 'singapore conference gala dinner luxury event' },
  { slug: 'food-beverage-expo-milan',           q: 'italian food wine exhibition elegant culinary' },
  { slug: 'hospitality-industry-summit-london', q: 'london conference centre hospitality event' },
  { slug: 'hospitality-leadership-forum-paris', q: 'paris hotel luxury meeting conference elegant' },
  { slug: 'luxury-travel-fair-london',          q: 'luxury travel exhibition london showcase' },
  { slug: 'sustainable-hospitality-forum-nyc',  q: 'new york green sustainable architecture hotel' },
  { slug: 'world-hotel-congress-dubai',         q: 'dubai luxury hotel congress ballroom gold' },
  // NEWS
  { slug: 'airbnb-hotel-blur-2026',            q: 'stylish apartment hotel hybrid modern interior' },
  { slug: 'asia-pacific-hotel-investment',     q: 'asia hotel construction skyline investment' },
  { slug: 'chef-shortage-hospitality-2026',    q: 'professional hotel kitchen chef cooking' },
  { slug: 'contactless-checkin-standard',      q: 'hotel reception modern digital check-in lobby' },
  { slug: 'cruise-hotel-partnerships-boom',    q: 'cruise ship luxury port mediterranean sea' },
  { slug: 'dubai-opens-luxury-resort-2026',    q: 'dubai luxury resort beach architecture spectacular' },
  { slug: 'four-seasons-private-jet-expansion', q: 'private jet luxury interior leather seats' },
  { slug: 'gen-z-redefining-luxury-travel',    q: 'vibrant boutique hotel colourful modern travel' },
  { slug: 'green-hotel-certification-demand',  q: 'eco green hotel rooftop garden sustainable luxury' },
  { slug: 'hilton-africa-expansion',           q: 'africa luxury hotel architecture sunset savanna' },
  { slug: 'hospitality-tech-funding-2026',     q: 'technology startup office hotel modern screens' },
  { slug: 'hospitality-workers-salary-rise',   q: 'hotel staff uniform professional grand lobby' },
  { slug: 'hotel-food-waste-zero-pledge',      q: 'hotel kitchen garden organic vegetables sustainable' },
  { slug: 'independent-hotels-outperform-chains', q: 'boutique independent hotel charming exterior' },
  { slug: 'luxury-brand-middle-east-expansion', q: 'middle east luxury hotel ornate grand interior' },
  { slug: 'marriott-bonvoy-redesign-launch',   q: 'modern hotel room luxury bed city view night' },
  { slug: 'marriott-record-revenue-2026',      q: 'luxury hotel rooftop panoramic city skyline' },
  { slug: 'ota-commission-battle-2026',        q: 'hotel booking laptop desk flowers direct' },
  { slug: 'robot-concierge-tokyo-hotel',       q: 'tokyo japan hotel modern futuristic lobby' },
  { slug: 'spa-wellness-boom-luxury-hotels',   q: 'luxury hotel spa indoor pool candles stone' },
  // PODCASTS
  { slug: 'andre-merritt-hotel-brands',        q: 'hotel brand strategy meeting conference room' },
  { slug: 'diana-lara-construction',           q: 'luxury hotel construction architecture building' },
  { slug: 'jacob-mcleod-culture-art',          q: 'contemporary art hotel gallery installation luxury' },
  { slug: 'maria-chen-luxury-spa',             q: 'luxury spa treatment room massage candles serene' },
  { slug: 'robert-hayes-revenue-management',   q: 'hotel data analytics revenue management screens' },
  { slug: 'samia-moore-events-industry',       q: 'luxury hotel ballroom gala event dinner setup' },
  { slug: 'yuki-tanaka-japanese-hospitality',  q: 'japanese ryokan traditional interior zen garden' },
]

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Authorization: API_KEY } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302)
        return get(res.headers.location).then(resolve).catch(reject)
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => resolve({ status: res.statusCode, body: d }))
    }).on('error', reject)
  })
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302)
        return download(res.headers.location, dest).then(resolve).catch(reject)
      const file = fs.createWriteStream(dest)
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
    }).on('error', err => { try { fs.unlinkSync(dest) } catch {} reject(err) })
  })
}

async function fetchOne(slug, q) {
  const dest = path.join(OUT_DIR, `${slug}.jpg`)
  if (fs.existsSync(dest)) { process.stdout.write('SKIP\n'); return }

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape&size=large`
  const { status, body } = await get(url)
  if (status !== 200) throw new Error(`Pexels API ${status}: ${body.slice(0, 100)}`)

  const data = JSON.parse(body)
  if (!data.photos?.length) throw new Error(`No photos found for: ${q}`)

  const photoUrl = data.photos[0].src.landscape || data.photos[0].src.large2x || data.photos[0].src.large
  await download(photoUrl, dest)
  process.stdout.write('OK\n')
}

async function main() {
  console.log(`Downloading ${IMAGES.length} images from Pexels...\n`)
  const failed = []

  for (let i = 0; i < IMAGES.length; i++) {
    const { slug, q } = IMAGES[i]
    process.stdout.write(`[${i+1}/${IMAGES.length}] ${slug} ... `)
    try {
      await fetchOne(slug, q)
    } catch (e) {
      process.stdout.write(`FAIL: ${e.message}\n`)
      failed.push(slug)
    }
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\n✓ ${IMAGES.length - failed.length} downloaded`)
  if (failed.length) console.log('Failed:', failed.join(', '))
}

main()
