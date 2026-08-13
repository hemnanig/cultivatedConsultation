import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/images/CC-1024-x-1024-px.png'
import { Avatar } from './ui.jsx'
import {
  HomeIcon,
  UsersIcon,
  GroupIcon,
  ChatBubbleIcon,
  BellIcon,
  ShieldIcon,
  LogOutIcon,
  SearchIcon,
} from './icons.jsx'
import { api } from '../api.js'

const navItems = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/directory', label: 'Directory', icon: UsersIcon },
  { to: '/groups', label: 'Groups', icon: GroupIcon },
  { to: '/messages', label: 'Messages', icon: ChatBubbleIcon },
  { to: '/notifications', label: 'Notifications', icon: BellIcon },
]

const menuLinks = [
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-of-service', label: 'Terms of Service' },
]

const navLinkClasses = ({ isActive }) =>
  'relative flex flex-col items-center gap-0.5 px-2.5 pt-1.5 text-[11px] font-medium transition-colors ' +
  (isActive ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900')

/**
 * Full LinkedIn-style horizontal top nav: logo + search on the left, a strip
 * of icon+label destinations in the middle, avatar menu on the right. This
 * replaces the old left sidebar entirely on desktop (md+) — LinkedIn itself
 * doesn't use a left nav sidebar, just this top bar plus a profile summary
 * card on the feed page.
 */
export default function Topbar({ me, onSignedOut }) {
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.unreadNotificationCount().then((r) => setUnreadNotifications(r.count)).catch(() => {})
  }, [])

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function submitSearch(e) {
    e.preventDefault()
    navigate(`/directory?q=${encodeURIComponent(query.trim())}`)
  }

  async function logout() {
    await api.logout()
    onSignedOut()
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30 hidden h-14 border-b border-stone-200 bg-white md:flex">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4">
        <NavLink to="/" className="flex shrink-0 items-center gap-2">
          <img className="h-8 w-8" src={logo} alt="Cultivated Consultation" />
        </NavLink>

        <form onSubmit={submitSearch} className="w-56 shrink-0 lg:w-72">
          <div className="flex items-center gap-2 rounded-lg border border-transparent bg-stone-100 px-3 py-1.5 focus-within:border-brand-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
            <SearchIcon className="h-4 w-4 shrink-0 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members…"
              className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
        </form>

        <nav className="flex flex-1 items-center justify-center gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClasses}>
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.8} />
                    {to === '/notifications' && unreadNotifications > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-denied px-1 text-[10px] font-semibold text-white">
                        {unreadNotifications}
                      </span>
                    )}
                  </span>
                  <span>{label}</span>
                  <span className={'mt-1 h-0.5 w-full rounded-full ' + (isActive ? 'bg-brand-600' : 'bg-transparent')} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex flex-col items-center gap-0.5 px-2 pt-1.5 text-[11px] font-medium text-stone-500 transition-colors hover:text-stone-900"
          >
            <Avatar name={me.name || me.email} size="sm" />
            <span>Me</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-stone-200 bg-white p-2 shadow-lg">
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-stone-50"
              >
                <Avatar name={me.name || me.email} />
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-medium text-stone-900">{me.name || me.email}</p>
                  {me.badge && <p className="truncate text-xs text-stone-500">{me.badge}</p>}
                  <p className="text-xs text-brand-700">View profile</p>
                </div>
              </NavLink>

              {me.admin && (
                <NavLink
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="mt-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  <ShieldIcon className="h-4 w-4 shrink-0" />
                  Admin
                </NavLink>
              )}

              <div className="my-2 border-t border-stone-100" />

              <div className="flex flex-col">
                {menuLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-2.5 py-1.5 text-xs text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                  >
                    {label}
                  </NavLink>
                ))}
              </div>

              <div className="my-1 border-t border-stone-100" />

              <button
                onClick={logout}
                className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-stone-500 hover:bg-stone-50 hover:text-stone-900"
              >
                <LogOutIcon className="h-4 w-4 shrink-0" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
