import { initials } from '../lib/format.js'
import { CheckBadgeIcon } from './icons.jsx'

/** Circular initials avatar — no photo upload in the POC, so this is the member's visual identity. */
export function Avatar({ name, size = 'md' }) {
  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-16 w-16 text-lg',
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 ${sizes[size]}`}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  )
}

/**
 * Membership badge (credential/role) rendered as a pill instead of plain
 * inline text. Pass credentialStatus to show a small verified checkmark when
 * an admin has confirmed the member's license — otherwise the badge is just
 * self-reported text, same as before.
 */
export function BadgePill({ badge, credentialStatus }) {
  if (!badge) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
      {badge}
      {credentialStatus === 'VERIFIED' && (
        <CheckBadgeIcon className="h-3.5 w-3.5 text-brand-600" role="img" aria-label="Verified credential" />
      )}
    </span>
  )
}

/** Unverified / pending review / verified / rejected — credential review status. */
export function CredentialStatusBadge({ status }) {
  const map = {
    UNVERIFIED: { label: 'Not submitted', classes: 'bg-stone-100 text-stone-500' },
    PENDING_REVIEW: { label: 'Pending review', classes: 'bg-status-pending-bg text-status-pending' },
    VERIFIED: { label: 'Verified', classes: 'bg-status-approved-bg text-status-approved' },
    REJECTED: { label: 'Rejected', classes: 'bg-status-denied-bg text-status-denied' },
  }
  const entry = map[status] ?? { label: status, classes: 'bg-stone-100 text-stone-600' }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${entry.classes}`}>
      {entry.label}
    </span>
  )
}

/** A single specialty/interest tag. */
export function SpecialtyPill({ children, onClick, active = false }) {
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ' +
        (active
          ? 'bg-brand-600 text-white'
          : 'bg-stone-100 text-stone-600' + (onClick ? ' hover:bg-stone-200' : ''))
      }
    >
      {children}
    </Tag>
  )
}

/** Pending / approved / denied — the three membership states, visually distinct. */
export function StatusBadge({ status }) {
  const map = {
    PENDING: { label: 'Pending review', classes: 'bg-status-pending-bg text-status-pending' },
    APPROVED: { label: 'Approved', classes: 'bg-status-approved-bg text-status-approved' },
    DENIED: { label: 'Not approved', classes: 'bg-status-denied-bg text-status-denied' },
  }
  const entry = map[status] ?? { label: status, classes: 'bg-stone-100 text-stone-600' }
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${entry.classes}`}>
      {entry.label}
    </span>
  )
}

/** Friendly placeholder for empty lists, instead of bare gray text. */
export function EmptyState({ icon = '—', title, description }) {
  return (
    <div className="cc-card flex flex-col items-center gap-2 px-6 py-12 text-center">
      <div className="text-3xl" aria-hidden="true">{icon}</div>
      <p className="font-medium text-stone-700">{title}</p>
      {description && <p className="max-w-sm text-sm text-stone-500">{description}</p>}
    </div>
  )
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-stone-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-brand-600" aria-hidden="true" />
      {label}
    </div>
  )
}
