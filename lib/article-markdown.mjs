import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

// Render on the server; never execute MDX or trust HTML supplied by RSS or AI.
export function renderArticleMarkdown(markdown) {
  return DOMPurify.sanitize(marked.parse(String(markdown || ''), { async: false, gfm: true }), {
    ALLOWED_TAGS: ['p', 'br', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'del'],
    ALLOWED_ATTR: ['href', 'title', 'start'],
    ALLOW_DATA_ATTR: false,
  })
}

export function articleDescription(metadata, body) {
  const explicit = metadata.description || metadata.excerpt
  const text = explicit || String(body).split(/<!--\s*FR\s*-->/)[0].split(/\n\s*\n/).find(p => !/^\s*[#<]/.test(p) && p.trim().length > 60) || metadata.title
  return String(text).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/<[^>]*>|[#*`_]/g, '').replace(/\s+/g, ' ').trim().slice(0, 155)
}
