import { NavLink } from 'react-router-dom'
import { HomeIcon, UsersIcon, InfoIcon } from './icons.jsx'
import { Avatar } from './ui.jsx'

/**
 * Fixed bottom tab bar for mobile — LinkedIn-style: a handful of pinned
 * destinations, icon + label, active state highlighted. Deliberately capped
 * at 4 tabs (Feed, Directory, About, Profile) to match what the product has
 * today. When a 5th+ section is added later, swap the last tab for a "More"
 * overflow sheet rather than cramming a 5th icon in — same pattern LinkedIn
 * uses once Jobs/Notifications push past the initial four.
 */
const tabs = [
  { to: '/', label: 'Feed', icon: HomeIcon, end: true },
  { to: '/directory', label: 'Directory', icon: UsersIcon },
  { to: '/about', label: 'About', icon: InfoIcon },
]

export default function BottomNav({ me }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-stone-200 bg-white md:hidden">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium ' +
            (isActive ? 'text-brand-700' : 'text-stone-500')
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium ' +
          (isActive ? 'text-brand-700' : 'text-stone-500')
        }
      >
        <Avatar name={me.name || me.email} size="sm" />
        Profile
      </NavLink>
    </nav>
  )
}
