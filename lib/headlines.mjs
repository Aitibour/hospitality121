/** Compact display copy; the original headline remains available to readers and search engines. */
export function shortHeadline(title, max = 48) {
  let headline = title.trim().replace(/\s+/g, ' ')
  const parts = headline.split(/:\s+/)
  if (parts.length > 1 && /^from\b/i.test(parts[0])) headline = parts.slice(1).join(': ')
  headline = headline.replace(/^how\s+/i, '')
  if (headline.length <= max) return headline
  const prefix = headline.split(/:\s+|\s[—–]\s/)[0]
  if (prefix.length >= 20 && prefix.length <= max) return prefix
  return `${headline.slice(0, max - 1).replace(/\s+\S*$/, '').trimEnd()}…`
}
