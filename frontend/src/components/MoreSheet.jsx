import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { Avatar } from './ui.jsx'
import { InfoIcon, ShieldIcon, LogOutIcon, BellIcon } from './icons.jsx'

/**
 * Mobile-only overflow sheet for the bottom nav — everything that doesn't
 * fit in the 4 pinned tabs (Profile, Notifications, About, Admin, Log out).
 * This is the "in future we can add a More category" piece from the nav
 * redesign: rather than cramming a 5th+ icon into the bar, new sections go
 * here as the product grows.
 */
export default function MoreSheet({ me, onSignedOut, onClose }) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    api.unreadNotificationCount().then((r) => setUnreadCount(r.count)).catch(() => {})
  }, [])

  async function logout() {
    await api.logout()
    onSignedOut()
  }

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-stone-900/30" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-16 rounded-t-2xl bg-white p-3 shadow-lg">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-stone-50"
        >
          <Avatar name={me.name || me.email} />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-stone-900">{me.name || me.email}</p>
            <p className="text-xs text-stone-500">View profile</p>
          </div>
        </Link>

        <div className="my-2 border-t border-stone-100" />

        <Link
          to="/notifications"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <BellIcon className="h-5 w-5 shrink-0" />
          <span className="flex-1">Notifications</span>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        <Link
          to="/about"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <InfoIcon className="h-5 w-5 shrink-0" />
          About
        </Link>

        {me.admin && (
          <Link
            to="/admin"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            <ShieldIcon className="h-5 w-5 shrink-0" />
            Admin
          </Link>
        )}

        <div className="my-2 border-t border-stone-100" />

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-500 hover:bg-stone-50"
        >
          <LogOutIcon className="h-5 w-5 shrink-0" />
          Log out
        </button>
      </div>
    </div>
  )
}
