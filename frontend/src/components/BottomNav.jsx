import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HomeIcon, UsersIcon, GroupIcon, ChatBubbleIcon } from './icons.jsx'
import MoreSheet from './MoreSheet.jsx'

/**
 * Fixed bottom tab bar for mobile — LinkedIn-style: a handful of pinned
 * destinations, icon + label, active state highlighted. Capped at 4 content
 * tabs (Home, Directory, Groups, Messages) plus a "More" tab for everything
 * else (Profile, Notifications, About, FAQ, Contact, legal, Admin, Log out)
 * — this is the overflow pattern the nav was designed to grow into rather
 * than cramming more icons into the bar as the product adds sections.
 */
const tabs = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/directory', label: 'Directory', icon: UsersIcon },
  { to: '/groups', label: 'Groups', icon: GroupIcon },
  { to: '/messages', label: 'Messages', icon: ChatBubbleIcon },
]

const tabClasses = ({ isActive }) =>
  'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium ' +
  (isActive ? 'text-brand-700' : 'text-stone-500')

export default function BottomNav({ me, onSignedOut }) {
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      {/* Padding-bottom (not height) carries the safe-area inset so the bar's
          total footprint grows to clear the home-indicator area on notched
          iPhones instead of the tab row itself being squeezed into it —
          without this the bar sits partly behind/under the home indicator. */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="flex h-16 items-stretch">
          {tabs.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={tabClasses}>
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className={'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium ' + (moreOpen ? 'text-brand-700' : 'text-stone-500')}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <circle cx="5" cy="12" r="1.75" />
              <circle cx="12" cy="12" r="1.75" />
              <circle cx="19" cy="12" r="1.75" />
            </svg>
            More
          </button>
        </div>
      </nav>

      {moreOpen && <MoreSheet me={me} onSignedOut={onSignedOut} onClose={() => setMoreOpen(false)} />}
    </>
  )
}
