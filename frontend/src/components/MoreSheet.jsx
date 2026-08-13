import { useEffect, useState } from 'react'
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

/**
 * Mobile-only overflow sheet for the bottom nav — everything that doesn't
 * fit in the 4 pinned tabs (Profile, Notifications, About, FAQ, Contact,
 * Privacy Policy, Terms of Service, Admin, Log out). This is the "in future
 * we can add a More category" piece from the nav redesign: rather than
 * cramming a 5th+ icon into the bar, new sections go here as the product
 * grows.
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
      <div className="absolute inset-x-0 bottom-16 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-surface p-3 shadow-lg">
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
          to="/opportunities"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <BriefcaseIcon className="h-5 w-5 shrink-0" />
          Opportunities
        </Link>

        <Link
          to="/public-directory"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <GlobeIcon className="h-5 w-5 shrink-0" />
          Public directory
        </Link>

        <div className="my-2 border-t border-stone-100" />

        <Link
          to="/about"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <InfoIcon className="h-5 w-5 shrink-0" />
          About
        </Link>

        <Link
          to="/faq"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <QuestionIcon className="h-5 w-5 shrink-0" />
          FAQ
        </Link>

        <Link
          to="/contact"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <EnvelopeIcon className="h-5 w-5 shrink-0" />
          Contact
        </Link>

        <Link
          to="/privacy-policy"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <LockIcon className="h-5 w-5 shrink-0" />
          Privacy Policy
        </Link>

        <Link
          to="/terms-of-service"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <DocumentIcon className="h-5 w-5 shrink-0" />
          Terms of Service
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

        <ThemeToggle
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
          iconClassName="h-5 w-5 shrink-0"
        />

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
