/** Turns an ISO instant into "just now" / "5m ago" / "3d ago" / a plain date once it's old. */
export function formatRelativeTime(isoString) {
  if (!isoString) return ''
  const then = new Date(isoString).getTime()
  if (Number.isNaN(then)) return ''
  const diffSeconds = Math.round((Date.now() - then) / 1000)

  if (diffSeconds < 30) return 'just now'
  if (diffSeconds < 60) return `${diffSeconds}s ago`

  const diffMinutes = Math.round(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/** First letter of up to the first two words of a name, for an avatar. Falls back to "?" */
export function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** "Perinatal Mental Health, Trauma, EMDR" -> ["Perinatal Mental Health", "Trauma", "EMDR"] */
export function parseSpecialties(specialtiesString) {
  if (!specialtiesString) return []
  return specialtiesString
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
