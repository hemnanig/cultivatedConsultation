import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/images/CC-1024-x-1024-px.png'
import { Avatar } from './ui.jsx'
import { HomeIcon, UsersIcon, GroupIcon, MailIcon, BellIcon, ShieldIcon, LogOutIcon } from './icons.jsx'
import { api } from '../api.js'

const navItems = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/directory', label: 'Directory', icon: UsersIcon },
  { to: '/groups', label: 'Groups', icon: GroupIcon },
  { to: '/messages', label: 'Messages', icon: MailIcon },
  { to: '/notifications', label: 'Notifications', icon: BellIcon },
]

// Secondary/legal links — LinkedIn-style small text footer at the bottom of
// the sidebar rather than full nav items, since these aren't core features.
const footerLinks = [
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy-policy', label: 'Privacy' },
  { to: '/terms-of-service', label: 'Terms' },
]

const linkClasses = ({ isActive }) =>
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ' +
  (isActive ? 'bg-brand-50 text-brand-700' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900')

export default function Sidebar({ me, onSignedOut }) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    api.unreadNotificationCount().then((r) => setUnreadCount(r.count)).catch(() => {})
  }, [])

  async function logout() {
    await api.logout()
    onSignedOut()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-stone-200 bg-white md:flex">
      <NavLink to="/" className="flex items-center gap-2 px-5 py-5">
        <img className="h-8 w-8" src={logo} alt="Cultivated Consultation" />
        <span className="font-display text-base font-semibold text-stone-900">Cultivated Consultation</span>
      </NavLink>

      <NavLink
        to="/profile"
        className="mx-3 mb-4 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-stone-100"
      >
        <Avatar name={me.name || me.email} />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-medium text-stone-900">{me.name || me.email}</p>
          {me.badge && <p className="truncate text-xs text-stone-500">{me.badge}</p>}
        </div>
      </NavLink>

      <nav className="flex flex-col gap-1 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={linkClasses}>
            <Icon className="h-5 w-5 shrink-0" />
            <span className="flex-1">{label}</span>
            {to === '/notifications' && unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
        {me.admin && (
          <NavLink to="/admin" className={linkClasses}>
            <ShieldIcon className="h-5 w-5 shrink-0" />
            Admin
          </NavLink>
        )}
      </nav>

      <div className="mt-auto px-3 pb-5">
        <button
          onClick={logout}
          className="mb-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
        >
          <LogOutIcon className="h-5 w-5 shrink-0" />
          Log out
        </button>
        <nav className="flex flex-wrap gap-x-3 gap-y-1 px-3 text-xs text-stone-400">
          {footerLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className="hover:text-stone-600 hover:underline">
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
