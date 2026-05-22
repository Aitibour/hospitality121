/**
 * LinkedIn auto-publish module for Hospitality121
 * 1. Uploads the Unsplash cover image to LinkedIn media
 * 2. Creates a company-page post with the image attached (no URL in body)
 * 3. Posts the article URL as the first comment
 *
 * Requires env vars:
 *   LINKEDIN_ACCESS_TOKEN  — OAuth2 access token with w_organization_social scope
 *   LINKEDIN_ORG_URN       — Organization URN, e.g. urn:li:organization:12345678
 */

import fs from 'node:fs'
import path from 'node:path'

const BASE_URL = 'https://hospitality121.com'
const LI_API = 'https://api.linkedin.com/v2'

// ─── Post copy ─────────────────────────────────────────────────────────────────

function buildPostText({ titleEn, excerptEn, category }) {
  const clean = (excerptEn ?? '').replace(/[-–—]/g, ' ').replace(/\s{2,}/g, ' ').trim()
  const tag = (category ?? 'TRENDS').toUpperCase()

  const categoryHashtags = {
    TRENDS:         '#HospitalityTrends #HotelIndustry #FutureOfHospitality',
    TECHNOLOGY:     '#HotelTech #HospitalityTech #PropTech',
    SUSTAINABILITY: '#SustainableHospitality #GreenHotel #EcoTravel',
    WELLNESS:       '#HotelWellness #WellnessTravel #SpaHospitality',
    OPERATIONS:     '#HotelOperations #HospitalityManagement #HotelBusiness',
    LUXURY:         '#LuxuryHospitality #LuxuryHotel #FineHospitality',
    'F&B':          '#HotelFnB #HospitalityFood #RestaurantHospitality',
    INVESTMENT:     '#HotelInvestment #HospitalityFinance #RealEstate',
    WORKFORCE:      '#HospitalityJobs #HotelStaffing #HospitalityLeadership',
    BRANDS:         '#HotelBrands #HospitalityBrands #Hotelier',
    DEVELOPMENT:    '#HotelDevelopment #HospitalityGrowth #NewHotels',
    DISTRIBUTION:   '#HotelDistribution #OTA #DirectBooking',
    PARTNERSHIPS:   '#HospitalityPartnerships #HotelCollaboration',
  }

  const hashtags = categoryHashtags[tag] ?? categoryHashtags.TRENDS

  return [
    `Fresh insight from the Hospitality121 team ✍️`,
    ``,
    `${titleEn}`,
    ``,
    `${clean}`,
    ``,
    `What's your take? Drop a comment below — we'd love to hear from hospitality professionals on the front lines. 👇`,
    ``,
    `${hashtags} #Hospitality121`,
  ].join('\n')
}

// ─── Upload image to LinkedIn ──────────────────────────────────────────────────

async function uploadImageToLinkedIn(token, orgUrn, imagePath) {
  if (!fs.existsSync(imagePath)) {
    console.warn(`⚠ LinkedIn image not found at ${imagePath}, posting without image`)
    return null
  }

  const imageBuffer = fs.readFileSync(imagePath)
  const ext = path.extname(imagePath).toLowerCase()
  const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png'

  // Step 1: register upload
  const registerRes = await fetch(`${LI_API}/assets?action=registerUpload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: orgUrn,
        serviceRelationships: [
          { relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' },
        ],
      },
    }),
  })

  if (!registerRes.ok) {
    console.error('LinkedIn register upload failed:', registerRes.status, await registerRes.text())
    return null
  }

  const registerData = await registerRes.json()
  const assetUrn = registerData.value.asset
  const uploadUrl =
    registerData.value.uploadMechanism[
      'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
    ].uploadUrl

  // Step 2: upload binary
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': mimeType },
    body: new Uint8Array(imageBuffer),
  })

  if (!uploadRes.ok) {
    console.error('LinkedIn image upload failed:', uploadRes.status)
    return null
  }

  console.log('✓ LinkedIn image uploaded:', assetUrn)
  return assetUrn
}

// ─── Create post ───────────────────────────────────────────────────────────────

async function createPost(token, orgUrn, text, assetUrn, title) {
  const mediaContent = assetUrn
    ? {
        shareMediaCategory: 'IMAGE',
        media: [
          {
            status: 'READY',
            description: { text: title },
            media: assetUrn,
            title: { text: title },
          },
        ],
      }
    : { shareMediaCategory: 'NONE' }

  const body = {
    author: orgUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        ...mediaContent,
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  }

  const res = await fetch(`${LI_API}/ugcPosts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    console.error('LinkedIn post failed:', res.status, await res.text())
    return null
  }

  const postUrn = res.headers.get('x-restli-id') ?? res.headers.get('X-RestLi-Id')
  if (postUrn) return postUrn

  try {
    const data = await res.json()
    return data.id ?? null
  } catch {
    return null
  }
}

// ─── First comment with article URL ───────────────────────────────────────────

async function postComment(token, orgUrn, postUrn, articleUrl) {
  const encodedUrn = encodeURIComponent(postUrn)
  const res = await fetch(`${LI_API}/socialActions/${encodedUrn}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      actor: orgUrn,
      message: { text: `Read the full article here 👉 ${articleUrl}` },
    }),
  })

  if (!res.ok) {
    console.error('LinkedIn comment failed:', res.status, await res.text())
  } else {
    console.log('✓ LinkedIn first comment posted:', articleUrl)
  }
}

// ─── Main export ───────────────────────────────────────────────────────────────

/**
 * Publishes a blog post or news item to the Hospitality121 LinkedIn company page.
 *
 * @param {{ slug: string, titleEn: string, excerptEn: string, category: string, imageFile: string, contentType?: 'blog' | 'news' }} params
 * @returns {Promise<boolean>}
 */
export async function publishToLinkedIn({ slug, titleEn, excerptEn, category, imageFile, contentType = 'blog' }) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN
  const orgUrn = process.env.LINKEDIN_ORG_URN

  if (!token || !orgUrn) {
    console.log('LinkedIn credentials not configured — skipping LinkedIn publish')
    return false
  }
  if (!orgUrn.startsWith('urn:li:organization:') && !orgUrn.startsWith('urn:li:person:')) {
    console.error('LINKEDIN_ORG_URN must be urn:li:organization:... or urn:li:person:... — aborting')
    return false
  }

  const text = buildPostText({ titleEn, excerptEn, category })
  const section = contentType === 'news' ? 'news' : 'blog'
  const articleUrl = `${BASE_URL}/${section}/${slug}`

  console.log('Publishing to LinkedIn company page:', titleEn)

  const imagePath = path.join(process.cwd(), 'public', 'images', 'content', imageFile)
  const assetUrn = await uploadImageToLinkedIn(token, orgUrn, imagePath)

  const postUrn = await createPost(token, orgUrn, text, assetUrn, titleEn)
  if (!postUrn) return false

  console.log('✓ LinkedIn post created:', postUrn)

  // Brief delay before adding the URL comment
  await new Promise(r => setTimeout(r, 3000))
  await postComment(token, orgUrn, postUrn, articleUrl)

  return true
}
