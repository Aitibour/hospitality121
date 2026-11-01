export const SITE = 'https://hospitality121.com'
export const EXPECTED_X_USERNAME = 'Hospitality_121'

export function vancouverSlot(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }).formatToParts(now).map(p => [p.type, p.value]))
  const kind = parts.hour === '09' ? 'news' : parts.hour === '13' ? 'article' : null
  return kind ? { key: `${parts.year}-${parts.month}-${parts.day}/${kind}`, date: `${parts.year}-${parts.month}-${parts.day}`, kind } : null
}

function compact(text, max) {
  const clean = String(text || '').replace(/<[^>]*>|[#*_`]/g, '').replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

function bold(text) {
  return [...text].map(c => /[A-Z]/.test(c) ? String.fromCodePoint(0x1d400 + c.charCodeAt(0) - 65) : /[a-z]/.test(c) ? String.fromCodePoint(0x1d41a + c.charCodeAt(0) - 97) : c).join('')
}

export function postText(item, kind) {
  const description = compact(item.description || item.excerpt, kind === 'article' ? 94 : 110)
  if (!description) throw new Error('An article summary is required')
  const words = description.split(' '), lines = ['', '', '']
  if (kind === 'article') {
    const target = Math.ceil(description.length / 3)
    let line = 0
    for (const word of words) {
      if (line < 2 && lines[line] && lines[line].length + word.length > target) line++
      lines[line] += (lines[line] ? ' ' : '') + word
    }
  }
  const text = `${bold(compact(item.title, 48))}\n\n${kind === 'article' ? lines.join('\n') : description}\n\nRead the full article: ${SITE}/content/${item.slug}\n\n#HotelTech #Hospitality`
  // Conservative URL-weighted length. Unicode bold counts as two weighted characters.
  const weighted = [...text.replace(/https:\/\/\S+/g, 'x'.repeat(23))].reduce((sum, c) => sum + (c.codePointAt(0) > 0x10ff ? 2 : 1), 0)
  if (weighted > 280) throw new Error('X post exceeds the standard post limit')
  return text
}

