import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { Avatar } from './ui.jsx'
import {
  InfoIcon,
  ShieldIcon,
  LogOutIcon,
  BellIcon,
  QuestionIcon,
  EnvelopeIcon,
  LockIcon,
  DocumentIcon,
  BriefcaseIcon,
  GlobeIcon,
} from './icons.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const ROW_CLASS =
  'cc-row flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50'

// Fraction of the sheet's own height a drag has to cross before release
// counts as "dismiss" rather than "snap back".
const DISMISS_DISTANCE_RATIO = 0.25
// px/ms — a flick past this speed dismisses regardless of distance dragged,
// same as a fast swipe-to-dismiss on an iOS sheet.
const DISMISS_VELOCITY = 0.5
const REDUCED_MOTION_MS = 80

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function liveTranslateY(el) {
  if (!el) return 0
  const transform = window.getComputedStyle(el).transform
  if (!transform || transform === 'none') return 0
  const matrix = new DOMMatrixReadOnly(transform)
  return matrix.m42
}

/**
 * Mobile-only overflow sheet for the bottom nav — everything that doesn't
 * fit in the 4 pinned tabs (Profile, Notifications, About, FAQ, Contact,
 * Privacy Policy, Terms of Service, Admin, Log out). This is the "in future
 * we can add a More category" piece from the nav redesign: rather than
 * cramming a 5th+ icon into the bar, new sections go here as the product
 * grows.
 *
 * Always mounted by BottomNav (not conditionally rendered) so `open`
 * toggling false plays a real exit animation instead of vanishing — see the
 * mounted/closing state machine below. The handle also supports drag-to-
 * dismiss: 1:1 finger tracking, rubber-band resistance if dragged past the
 * open position, and a release that either snaps back or hands off the
 * gesture's velocity to a dismiss animation — grabbing the sheet again
 * mid-animation reads the live transform instead of jumping.
 */
export default function MoreSheet({ me, open, onSignedOut, onClose }) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [dragTransitionMs, setDragTransitionMs] = useState(0)

  const sheetRef = useRef(null)
  const pointerId = useRef(null)
  const startClientY = useRef(0)
  const startDragY = useRef(0)
  const lastClientY = useRef(0)
  const lastMoveT = useRef(0)
  const velocity = useRef(0)
  const closeTimer = useRef(null)

  useEffect(() => {
    api.unreadNotificationCount().then((r) => setUnreadCount(r.count)).catch(() => {})
  }, [])

  useEffect(() => {
    if (open) {
      clearTimeout(closeTimer.current)
      setMounted(true)
      setClosing(false)
      setDragging(false)
      setDragTransitionMs(0)
      setDragY(0)
    } else if (mounted && !dragging) {
      setClosing(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!mounted) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mounted, onClose])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  function finishClose() {
    setMounted(false)
    setClosing(false)
    setDragging(false)
    setDragTransitionMs(0)
    setDragY(0)
  }

  function handleSheetAnimationEnd(e) {
    if (e.target !== sheetRef.current) return
    if (closing) finishClose()
  }

  function handlePointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId)
    clearTimeout(closeTimer.current)
    pointerId.current = e.pointerId
    const live = liveTranslateY(sheetRef.current)
    startDragY.current = live
    startClientY.current = e.clientY
    lastClientY.current = e.clientY
    lastMoveT.current = performance.now()
    velocity.current = 0
    setDragTransitionMs(0)
    setDragging(true)
    setDragY(live)
  }

  function handlePointerMove(e) {
    if (pointerId.current !== e.pointerId) return
    const now = performance.now()
    const dt = now - lastMoveT.current
    if (dt > 0) velocity.current = (e.clientY - lastClientY.current) / dt
    lastClientY.current = e.clientY
    lastMoveT.current = now

    let delta = e.clientY - startClientY.current + startDragY.current
    if (delta < 0) delta *= 0.35 // rubber-band: resist dragging past the open position
    setDragY(delta)
  }

  function handlePointerUp(e) {
    if (pointerId.current !== e.pointerId) return
    pointerId.current = null
    setDragging(false)

    const sheetHeight = sheetRef.current?.offsetHeight || 400
    const reduced = prefersReducedMotion()
    const shouldDismiss = dragY > sheetHeight * DISMISS_DISTANCE_RATIO || velocity.current > DISMISS_VELOCITY

    if (shouldDismiss) {
      const remaining = Math.max(sheetHeight - Math.max(dragY, 0), 0)
      const speed = Math.max(velocity.current, 0.7)
      const duration = reduced ? REDUCED_MOTION_MS : Math.min(Math.max(remaining / speed, 140), 300)
      setDragTransitionMs(duration)
      setDragY(sheetHeight + 60)
      closeTimer.current = setTimeout(() => {
        onClose()
        finishClose()
      }, duration)
    } else {
      setDragTransitionMs(reduced ? REDUCED_MOTION_MS : 320)
      setDragY(0)
    }
  }

  async function logout() {
    await api.logout()
    onSignedOut()
  }

  if (!mounted) return null

  const usingDragTransform = dragging || dragTransitionMs > 0
  const sheetHeight = sheetRef.current?.offsetHeight || 400
  const backdropOpacity = usingDragTransform ? Math.max(1 - Math.max(dragY, 0) / sheetHeight, 0) : undefined

  return (
    <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="More">
      <div
        className={
          'absolute inset-0 bg-stone-900/30 ' +
          (usingDragTransform ? '' : closing ? 'cc-backdrop-exit' : 'cc-backdrop-enter')
        }
        style={usingDragTransform ? { opacity: backdropOpacity } : undefined}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className={
          'absolute inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] max-h-[80vh] overflow-y-auto rounded-t-2xl bg-surface pb-3 shadow-lg ' +
          (usingDragTransform ? '' : closing ? 'cc-sheet-exit' : 'cc-sheet-enter')
        }
        style={
          usingDragTransform
            ? {
                transform: `translateY(${Math.max(dragY, -40)}px)`,
                transition: dragTransitionMs ? `transform ${dragTransitionMs}ms cubic-bezier(0.32, 0.72, 0, 1)` : 'none',
              }
            : undefined
        }
        onAnimationEnd={handleSheetAnimationEnd}
        onTransitionEnd={() => {
          if (!dragging && dragTransitionMs && dragY === 0) setDragTransitionMs(0)
        }}
      >
        <div
          className="flex touch-none justify-center py-2"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <span className="h-1.5 w-10 shrink-0 cursor-grab rounded-full bg-stone-300 active:cursor-grabbing" aria-hidden="true" />
        </div>

        <div className="px-3">
          <Link to="/profile" onClick={onClose} className={ROW_CLASS}>
            <Avatar name={me.name || me.email} />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-stone-900">{me.name || me.email}</p>
              <p className="text-xs text-stone-500">View profile</p>
            </div>
          </Link>

          <div className="my-2 border-t border-stone-100" />

          <Link to="/notifications" onClick={onClose} className={ROW_CLASS}>
            <BellIcon className="h-5 w-5 shrink-0" />
            <span className="flex-1">Notifications</span>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link to="/opportunities" onClick={onClose} className={ROW_CLASS}>
            <BriefcaseIcon className="h-5 w-5 shrink-0" />
            Opportunities
          </Link>

          <Link to="/public-directory" onClick={onClose} className={ROW_CLASS}>
            <GlobeIcon className="h-5 w-5 shrink-0" />
            Public directory
          </Link>

          <div className="my-2 border-t border-stone-100" />

          <Link to="/about" onClick={onClose} className={ROW_CLASS}>
            <InfoIcon className="h-5 w-5 shrink-0" />
            About
          </Link>

          <Link to="/faq" onClick={onClose} className={ROW_CLASS}>
            <QuestionIcon className="h-5 w-5 shrink-0" />
            FAQ
          </Link>

          <Link to="/contact" onClick={onClose} className={ROW_CLASS}>
            <EnvelopeIcon className="h-5 w-5 shrink-0" />
            Contact
          </Link>

          <Link to="/privacy-policy" onClick={onClose} className={ROW_CLASS}>
            <LockIcon className="h-5 w-5 shrink-0" />
            Privacy Policy
          </Link>

          <Link to="/terms-of-service" onClick={onClose} className={ROW_CLASS}>
            <DocumentIcon className="h-5 w-5 shrink-0" />
            Terms of Service
          </Link>

          {me.admin && (
            <Link to="/admin" onClick={onClose} className={ROW_CLASS}>
              <ShieldIcon className="h-5 w-5 shrink-0" />
              Admin
            </Link>
          )}

          <ThemeToggle className={'w-full ' + ROW_CLASS} iconClassName="h-5 w-5 shrink-0" />

          <div className="my-2 border-t border-stone-100" />

          <button onClick={logout} className={'w-full text-stone-500 ' + ROW_CLASS}>
            <LogOutIcon className="h-5 w-5 shrink-0" />
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
