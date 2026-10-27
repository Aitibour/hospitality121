/** Search public article text, including subjects that appear after the opening summary. */
export function buildSearchText(body) {
  return String(body || '').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]*>/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[#*`_|>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 16000)
}
