import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { MegaphoneIcon } from './icons.jsx'
import { formatRelativeTime } from '../lib/format.js'

/**
 * Community-wide admin announcements — shown at the top of the Home feed for
 * every approved member. Read-only here; posting/deleting happens in Admin.
 * Backend already caps this at the 5 most recent, so no client-side paging.
 */
export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState(null)

  useEffect(() => {
    api.listAnnouncements().then(setAnnouncements).catch(() => setAnnouncements([]))
  }, [])

  if (!announcements || announcements.length === 0) return null

  return (
    <div className="cc-card border-l-4 border-l-clay-500 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-clay-100 text-clay-700">
          <MegaphoneIcon className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-stone-900">Community announcements</p>
      </div>
      <ul className="mt-3 flex flex-col gap-3">
        {announcements.map((a, i) => (
          <li key={a.id} className={i > 0 ? 'border-t border-stone-100 pt-3' : ''}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-800">{a.message}</p>
            <p className="mt-1 text-xs text-stone-400">
              {a.createdByName || 'Admin'} · {formatRelativeTime(a.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
