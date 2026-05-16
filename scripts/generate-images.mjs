import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const API_KEY = process.env.OPENAI_API_KEY
const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'content')

if (!API_KEY) { console.error('Missing OPENAI_API_KEY'); process.exit(1) }
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

const BASE = 'Cinematic editorial photography, luxury hospitality setting, warm professional lighting, magazine quality, no text, no people, no faces, 16:9 widescreen ratio, rich colours, photorealistic. '

const IMAGES = [
  // ARTICLES
  { slug: 'ai-in-guest-experience', prompt: BASE + 'Sleek luxury hotel lobby with subtle glowing digital interfaces embedded in surfaces, AI-powered ambient lighting, holographic display at concierge desk, ultra-modern design, warm gold tones.' },
  { slug: 'architecture-guest-experience', prompt: BASE + 'Breathtaking contemporary hotel suite interior, floor-to-ceiling windows with city skyline view, modular transformable furniture, living plant wall, golden hour light flooding the room.' },
  { slug: 'art-of-personalisation', prompt: BASE + 'Beautifully appointed luxury hotel suite with personalised touches: fresh flowers, curated books on nightstand, monogrammed robe laid out, warm candlelight ambiance, intimate and exclusive.' },
  { slug: 'food-beverage-hotel-revenue', prompt: BASE + 'Award-winning hotel restaurant, impeccably plated fine dining course on white porcelain, sommelier pouring wine in background, intimate warm lighting, marble table, elegant napkins.' },
  { slug: 'future-of-luxury-hospitality', prompt: BASE + 'Futuristic ultra-luxury hotel infinity pool overlooking a dramatic ocean landscape, seamless glass architecture, sunset reflections on still water, minimalist design, aspirational.' },
  { slug: 'hiring-retaining-talent-2026', prompt: BASE + 'Elegant hotel staff training space, professional uniforms neatly arranged, bright modern interior with natural light, collaborative tables set up for learning, hospitality excellence.' },
  { slug: 'hotel-loyalty-evolution', prompt: BASE + 'Luxury hotel welcome amenity on marble surface: personalised handwritten note, champagne flutes, artisanal chocolates, fresh orchids, soft warm light, exclusive and personal.' },
  { slug: 'interview-hotel-cio-ai-strategy', prompt: BASE + 'High-tech hotel operations centre, curved monitors displaying hotel dashboards and AI analytics, data visualisations in cool blue light, modern corporate design, precision and intelligence.' },
  { slug: 'interview-startup-founder-hotel-tech', prompt: BASE + 'Modern hospitality tech startup workspace inside a converted boutique hotel space, sleek laptops, hotel UX prototypes on screens, exposed brick and warm lighting, creative innovative energy.' },
  { slug: 'revenue-management-strategies', prompt: BASE + 'Charming independent boutique hotel exterior at golden hour, warm glowing windows, cobblestone street, European architecture, intimate and distinguished, inviting evening atmosphere.' },
  { slug: 'sustainable-hotels-2026', prompt: BASE + 'Stunning eco-friendly luxury hotel with living green walls integrated into elegant architecture, solar panels as design features, natural stone and timber, surrounded by lush vegetation, morning light.' },
  { slug: 'wellness-tourism-billion-market', prompt: BASE + 'World-class hotel spa infinity pool merging into a misty mountain landscape, floating flower petals on still water, soft ambient candles at the edge, pure luxury and serenity.' },
  // INTERVIEWS
  // (same slugs as above, already covered)
  // BLOG
  { slug: 'designing-for-instagram', prompt: BASE + 'Visually stunning hotel interior designed for social media: dramatic floral installation ceiling, geometric patterned tile floor, pink and gold colour palette, mirrored surfaces, perfect symmetry.' },
  { slug: 'five-trends-reshaping-hospitality', prompt: BASE + 'Modern luxury hotel atrium with multiple levels, lush planted terraces, contemporary art installations, natural light flooding through a glass ceiling, dynamic and forward-looking design.' },
  { slug: 'future-of-hotel-loyalty', prompt: BASE + 'Exclusive hotel suite welcome moment, personalised letter on monogrammed paper, aged whisky decanter, local artisan gifts on dark wood table, intimate warm lamp light, genuine belonging.' },
  { slug: 'gm-morning-routine', prompt: BASE + 'Grand luxury hotel lobby at dawn, empty marble foyer with golden morning light streaming through tall windows, polished floors gleaming, fresh flower arrangement on reception desk, calm anticipation.' },
  { slug: 'how-to-build-hotel-culture', prompt: BASE + 'Beautifully designed hotel team culture space, warm motivational wall with brand values, professional uniforms hanging neatly on a rail, warm lighting, pride and belonging.' },
  { slug: 'lessons-from-ritz-carlton', prompt: BASE + 'White-glove luxury hotel service tableau: silver tray with champagne flutes, white-gloved hands presenting it, grand classical staircase in background, deep rich burgundy and gold tones, timeless opulence.' },
  { slug: 'revenue-beyond-rooms', prompt: BASE + 'Luxury hotel resort panorama showing spa terrace, rooftop restaurant and private pool cabana all in one scene, golden hour light across all amenities, aspirational lifestyle.' },
  { slug: 'what-guests-want-2026', prompt: BASE + 'Contemporary luxury hotel room with curated minibar of local artisan products, a cosy reading nook with a single lamp, city skyline glowing at dusk through large windows, warm and intimate.' },
  // EVENTS
  { slug: 'asia-pacific-hotel-summit-singapore', prompt: BASE + 'World-class conference centre ballroom in Singapore, elegant gala dinner table setup with tall floral centrepieces, crystal glassware, soft chandelier lighting, Marina Bay visible through windows.' },
  { slug: 'food-beverage-expo-milan', prompt: BASE + 'Elegant food and beverage exhibition in a grand Italian palazzo, artfully arranged food and wine displays on white marble, arched Renaissance architecture, warm amber evening light.' },
  { slug: 'hospitality-industry-summit-london', prompt: BASE + 'Prestigious conference venue in London, elegant auditorium with tiered seating and stage lighting, classical British architecture details, professional and prestigious atmosphere.' },
  { slug: 'hospitality-leadership-forum-paris', prompt: BASE + 'Refined hotel boardroom in Paris with Haussmann architecture visible through tall windows, elegant oval table set for a leadership forum, fresh flowers, warm evening light, sophistication.' },
  { slug: 'luxury-travel-fair-london', prompt: BASE + 'Upscale luxury travel exhibition at a grand London venue, beautifully designed showcase stands with rich materials, soft ambient lighting, marble floors, aspirational travel imagery as backdrops.' },
  { slug: 'sustainable-hospitality-forum-nyc', prompt: BASE + 'Sustainable hospitality event space in New York, biophilic design with abundant living greenery walls, recycled material furniture, natural daylight, Manhattan skyline through windows.' },
  { slug: 'world-hotel-congress-dubai', prompt: BASE + 'Grand hospitality congress event in Dubai, stunning contemporary Arabic-inspired ballroom architecture, chandelier-lit hall, gold and ivory colour palette, luxury gala setup, desert city skyline at dusk.' },
  // NEWS
  { slug: 'airbnb-hotel-blur-2026', prompt: BASE + 'Stylish hybrid hotel-apartment space blurring hotel and home: exposed brick, designer furniture, open-plan kitchen with hotel service touches, warm residential feel, curated lifestyle objects.' },
  { slug: 'asia-pacific-hotel-investment', prompt: BASE + 'Luxury hotel under construction in an Asian coastal city, dramatic steel and glass architecture rising against a sunrise sky, scale and ambition, cranes as symbols of growth.' },
  { slug: 'chef-shortage-hospitality-2026', prompt: BASE + 'World-class hotel kitchen, gleaming stainless steel surfaces, copper pots hanging, mise en place preparations on marble island, warm overhead lighting, professional and artisanal.' },
  { slug: 'contactless-checkin-standard', prompt: BASE + 'Sleek modern hotel lobby with a digital self check-in kiosk seamlessly integrated into a beautiful marble reception desk, warm ambient lighting, futuristic yet welcoming.' },
  { slug: 'cruise-hotel-partnerships-boom', prompt: BASE + 'Luxury cruise ship docked at a stunning Mediterranean coastal port, a grand hotel visible on the waterfront, golden evening light reflecting off calm water, sea and land luxury.' },
  { slug: 'dubai-opens-luxury-resort-2026', prompt: BASE + 'The most spectacular luxury resort in Dubai, dramatic architectural structure on a private beachfront, infinity pools cascading toward the Gulf at sunset, iconic opulence and scale.' },
  { slug: 'four-seasons-private-jet-expansion', prompt: BASE + 'Private jet interior outfitted in luxury hospitality style, cream leather seats, fresh white orchids, champagne setup on tray table, aerial view of clouds through oval window, rarified.' },
  { slug: 'gen-z-redefining-luxury-travel', prompt: BASE + 'Vibrant boutique hotel common area designed for Gen Z travellers, colourful murals, co-working zones with plants, rooftop terrace with city panorama, eclectic but sophisticated design.' },
  { slug: 'green-hotel-certification-demand', prompt: BASE + 'Luxury eco-hotel with a lush rooftop garden, solar panels as architectural features, natural stone and reclaimed wood, tropical surroundings, sustainability as design language.' },
  { slug: 'hilton-africa-expansion', prompt: BASE + 'Grand luxury hotel in a Sub-Saharan African city, contemporary architecture blending African design motifs, savannah landscape at sunset visible, warm terracotta and gold tones.' },
  { slug: 'hospitality-tech-funding-2026', prompt: BASE + 'Modern hospitality technology workspace, sleek monitors displaying hotel analytics dashboards and booking interfaces, startup energy meets luxury aesthetic, innovation and ambition.' },
  { slug: 'hospitality-workers-salary-rise', prompt: BASE + 'Elegantly uniformed hotel staff standing in a grand hotel entrance hall, professional and proud, warm welcoming lobby light, marble columns, sense of dignity and excellence.' },
  { slug: 'hotel-food-waste-zero-pledge', prompt: BASE + 'Luxury hotel kitchen garden, beautiful raised beds of seasonal produce, composting station elegantly integrated into garden design, natural materials, sustainable luxury.' },
  { slug: 'independent-hotels-outperform-chains', prompt: BASE + 'Charming independent boutique hotel exterior with unique character, window boxes of flowers, intimate cobblestone courtyard, hand-lettered sign, warm evening glow, distinctly personal.' },
  { slug: 'luxury-brand-middle-east-expansion', prompt: BASE + 'Ultra-luxury hotel lobby in the Middle East, soaring ceilings with ornate geometric patterns, massive floral centrepiece installation, marble floors with gold inlay, dramatic chandelier.' },
  { slug: 'marriott-bonvoy-redesign-launch', prompt: BASE + 'Contemporary luxury hotel room, crisp white linen, warm wood accents, city view at twilight through floor-to-ceiling windows, premium welcome amenity on the desk, sophisticated comfort.' },
  { slug: 'marriott-record-revenue-2026', prompt: BASE + 'Panoramic view of a major international hotel at peak season, elegant rooftop terrace with table settings for an evening event, city skyline at dusk, success and prestige.' },
  { slug: 'ota-commission-battle-2026', prompt: BASE + 'Luxury hotel direct booking experience: beautiful hotel website on an open laptop on a marble desk, beside a coffee cup and fresh flowers, warm intimate setting.' },
  { slug: 'robot-concierge-tokyo-hotel', prompt: BASE + 'Futuristic hotel lobby in Tokyo, sleek minimalist AI concierge station at reception, Japanese design aesthetic, warm indirect lighting, cherry blossom arrangement, technology meeting tradition.' },
  { slug: 'spa-wellness-boom-luxury-hotels', prompt: BASE + 'Breathtaking luxury hotel indoor spa pool, heated water with gentle steam rising, stone walls, flickering candles lining the edge, tropical plants, warm amber lighting, sanctuary.' },
  // PODCASTS
  { slug: 'andre-merritt-hotel-brands', prompt: BASE + 'Sophisticated hotel brand strategy room, glass walls overlooking a luxury hotel lobby, brand mood boards and design samples arranged on a long conference table, creative and professional.' },
  { slug: 'diana-lara-construction', prompt: BASE + 'Luxury hotel construction site with architect blueprints and material samples on a temporary desk, grand glass-and-steel skeleton rising behind, vision of something extraordinary taking shape.' },
  { slug: 'jacob-mcleod-culture-art', prompt: BASE + 'Museum-quality contemporary art installation inside a luxury hotel, large-scale abstract canvas on a dramatic textured wall, gallery-style spotlighting, marble floors, art and hospitality merged.' },
  { slug: 'maria-chen-luxury-spa', prompt: BASE + 'World-class hotel spa treatment room, massage table draped in crisp white linen, fresh botanicals in a ceramic bowl, flickering candles, stone and wood textures, complete serenity.' },
  { slug: 'robert-hayes-revenue-management', prompt: BASE + 'Luxury hotel revenue management suite, multiple curved monitors displaying demand forecasting charts, occupancy heat maps and pricing data on elegant dark screens, cool blue light, precision.' },
  { slug: 'samia-moore-events-industry', prompt: BASE + 'Elegantly styled luxury hotel ballroom set for a major industry gala, round tables with tall floral centrepieces, crystal glassware, warm chandelier light, anticipation before the event.' },
  { slug: 'yuki-tanaka-japanese-hospitality', prompt: BASE + 'Traditional Japanese ryokan interior with contemporary luxury elements, tatami floors, shoji screens glowing with soft light, ikebana flower arrangement, zen garden view through window.' },
]

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(dest)
    proto.get(url, res => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        file.close()
        fs.unlinkSync(dest)
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject)
      }
      res.pipe(file)
      file.on('finish', () => file.close(resolve))
    }).on('error', err => { fs.unlinkSync(dest); reject(err) })
  })
}

async function generateImage(slug, prompt) {
  const dest = path.join(OUT_DIR, `${slug}.jpg`)
  if (fs.existsSync(dest)) {
    console.log(`  SKIP ${slug}.jpg (already exists)`)
    return
  }

  const body = JSON.stringify({ model: 'dall-e-3', prompt, size: '1792x1024', quality: 'standard', n: 1 })

  const data = await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}`, 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let raw = ''
      res.on('data', c => raw += c)
      res.on('end', () => {
        try { resolve(JSON.parse(raw)) } catch(e) { reject(e) }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })

  if (data.error) throw new Error(data.error.message)
  const url = data.data[0].url
  await downloadFile(url, dest)
  console.log(`  OK  ${slug}.jpg`)
}

async function main() {
  console.log(`Generating ${IMAGES.length} images into ${OUT_DIR}\n`)
  let done = 0, failed = []

  for (const { slug, prompt } of IMAGES) {
    process.stdout.write(`[${++done}/${IMAGES.length}] ${slug} ... `)
    try {
      await generateImage(slug, prompt)
    } catch (e) {
      console.log(`FAIL: ${e.message}`)
      failed.push(slug)
    }
    // small delay to respect rate limits
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\nDone. ${IMAGES.length - failed.length} succeeded.`)
  if (failed.length) console.log('Failed:', failed.join(', '))
}

main()
