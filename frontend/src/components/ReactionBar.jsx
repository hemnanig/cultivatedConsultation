import { useEffect, useRef, useState } from 'react'

// Facebook's six reactions. Colors are fixed brand colors (not theme tokens)
// deliberately — reaction colors read the same in light and dark mode, same
// as every social app that has them.
export const REACTIONS = [
  { type: 'LIKE', emoji: '👍', label: 'Like', color: '#0a66c2' },
  { type: 'LOVE', emoji: '❤️', label: 'Love', color: '#e0245e' },
  { type: 'HAHA', emoji: '😆', label: 'Haha', color: '#f5a623' },
  { type: 'WOW', emoji: '😮', label: 'Wow', color: '#f5a623' },
  { type: 'SAD', emoji: '😢', label: 'Sad', color: '#f5a623' },
  { type: 'ANGRY', emoji: '😠', label: 'Angry', color: '#e0601a' },
]

const BY_TYPE = Object.fromEntries(REACTIONS.map((r) => [r.type, r]))
const LONG_PRESS_MS = 420
const HOVER_CLOSE_DELAY_MS = 220

function applyOptimistic(summary, type) {
  const counts = { ...summary.counts }
  const prev = summary.myReaction
  if (prev === type) {
    counts[prev] = Math.max(0, (counts[prev] || 0) - 1)
    return { counts, total: Math.max(0, summary.total - 1), myReaction: null }
  }
  if (prev) counts[prev] = Math.max(0, (counts[prev] || 0) - 1)
  counts[type] = (counts[type] || 0) + 1
  return { counts, total: summary.total + (prev ? 0 : 1), myReaction: type }
}

/**
 * Facebook-style reaction control, shared by posts and replies. Tapping the
 * button toggles Like; hovering (desktop) or long-pressing (touch) opens a
 * tray of all six reactions. State updates optimistically so the pop/bounce
 * animations play instantly — the server's summary (returned by onReact/
 * onUnreact) reconciles the real counts once the request resolves.
 */
export default function ReactionBar({ reactions, onReact, onUnreact }) {
  const [summary, setSummary] = useState(reactions)
  const [trayOpen, setTrayOpen] = useState(false)
  const [burst, setBurst] = useState(null)
  const [bounceKey, setBounceKey] = useState(0)
  const hoverTimer = useRef(null)
  const pressTimer = useRef(null)
  const longPressed = useRef(false)
  const containerRef = useRef(null)

  useEffect(() => setSummary(reactions), [reactions])

  useEffect(() => {
    if (!trayOpen) return
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setTrayOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [trayOpen])

  useEffect(() => () => {
    clearTimeout(hoverTimer.current)
    clearTimeout(pressTimer.current)
  }, [])

  function openTray() {
    clearTimeout(hoverTimer.current)
    setTrayOpen(true)
  }

  function scheduleClose() {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setTrayOpen(false), HOVER_CLOSE_DELAY_MS)
  }

  async function pick(type) {
    setTrayOpen(false)
    const mine = summary.myReaction
    setSummary((s) => applyOptimistic(s, type))
    setBurst(mine === type ? null : type)
    setBounceKey((k) => k + 1)
    try {
      const updated = mine === type ? await onUnreact() : await onReact(type)
      setSummary(updated)
    } catch {
      setSummary(reactions)
    }
  }

  function handleMainClick() {
    if (longPressed.current) {
      longPressed.current = false
      return
    }
    pick(summary.myReaction ?? 'LIKE')
  }

  function handleTouchStart() {
    longPressed.current = false
    clearTimeout(pressTimer.current)
    pressTimer.current = setTimeout(() => {
      longPressed.current = true
      openTray()
    }, LONG_PRESS_MS)
  }

  function cancelLongPress() {
    clearTimeout(pressTimer.current)
  }

  const mine = summary.myReaction ? BY_TYPE[summary.myReaction] : null
  const topEmoji = Object.entries(summary.counts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => BY_TYPE[type]?.emoji)
    .join('')

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={openTray}
      onMouseLeave={scheduleClose}
    >
      {trayOpen && (
        <div
          role="menu"
          aria-label="Pick a reaction"
          className="cc-reaction-tray absolute bottom-full left-0 z-10 mb-2 flex items-center gap-0.5 rounded-full border border-stone-200 bg-surface px-1.5 py-1 shadow-lg"
        >
          {REACTIONS.map((r, i) => (
            <button
              key={r.type}
              type="button"
              role="menuitem"
              title={r.label}
              aria-label={r.label}
              className="cc-reaction-emoji-pop flex h-9 w-9 items-center justify-center rounded-full text-xl transition-transform hover:-translate-y-1.5 hover:scale-125"
              style={{ animationDelay: `${i * 28}ms` }}
              onClick={() => pick(r.type)}
            >
              {r.emoji}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className="cc-btn-ghost relative"
        style={mine ? { color: mine.color } : undefined}
        onClick={handleMainClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={cancelLongPress}
        onTouchCancel={cancelLongPress}
        onTouchMove={cancelLongPress}
      >
        <span key={bounceKey} className={bounceKey > 0 ? 'cc-reaction-bounce inline-block' : 'inline-block'}>
          {mine ? mine.emoji : '👍'}
        </span>
        {mine ? mine.label : 'Like'}
        {burst && (
          <span
            key={bounceKey}
            className="cc-reaction-burst pointer-events-none absolute left-1/2 top-0 select-none text-lg"
            onAnimationEnd={() => setBurst(null)}
          >
            {BY_TYPE[burst].emoji}
          </span>
        )}
      </button>

      {summary.total > 0 && (
        <span className="ml-1 flex items-center gap-1 text-xs text-stone-400">
          <span aria-hidden="true">{topEmoji}</span>
          {summary.total}
        </span>
      )}
    </div>
  )
}
