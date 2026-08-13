/* Minimal hand-drawn outline icons — avoids adding an icon-library dependency
   on top of the Tailwind install the user already has to run locally. */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  )
}

export function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.75 19c0-3.2 2.8-5.5 6.25-5.5s6.25 2.3 6.25 5.5" />
      <path d="M15.5 5.2a3.25 3.25 0 0 1 0 6.1" />
      <path d="M18 13.7c2.4.5 3.75 2.2 3.75 4.3" />
    </svg>
  )
}

export function GroupIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3.5" y="4.5" width="12" height="9" rx="2" />
      <path d="M8 17.5h9a2.5 2.5 0 0 0 2.5-2.5V8" />
    </svg>
  )
}

export function InfoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3.5 19 6.5v5.2c0 4.4-3 7.6-7 8.8-4-1.2-7-4.4-7-8.8V6.5Z" />
      <path d="M9 12l2 2 4-4.2" />
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.5-4.5" />
    </svg>
  )
}

export function LogOutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9" />
      <path d="M16 16.5 21 12l-5-4.5" />
      <path d="M21 12H9" />
    </svg>
  )
}

export function CheckBadgeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3.5 19 6.5v5.2c0 4.4-3 7.6-7 8.8-4-1.2-7-4.4-7-8.8V6.5Z" fill="currentColor" stroke="none" opacity="0.15" />
      <path d="M12 3.5 19 6.5v5.2c0 4.4-3 7.6-7 8.8-4-1.2-7-4.4-7-8.8V6.5Z" />
      <path d="M9 12l2 2 4-4.2" />
    </svg>
  )
}

export function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  )
}

export function BellIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function ChevronRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function QuestionIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.3a2.7 2.7 0 1 1 3.6 2.5c-.8.4-1.2 1-1.2 1.9v.3" />
      <circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function EnvelopeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  )
}

export function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function DocumentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 12.5h6M9 15.5h6M9 18h3.5" />
    </svg>
  )
}

export function ChatBubbleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 5.5h16v11H9.5L5 20.5v-4H4Z" />
    </svg>
  )
}

export function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
    </svg>
  )
}

export function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
    </svg>
  )
}

export function DotsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="5" cy="12" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="19" cy="12" r="1.75" />
    </svg>
  )
}
