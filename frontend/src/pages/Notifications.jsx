import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import AppLayout from '../components/AppLayout.jsx'
import { EmptyState, Spinner } from '../components/ui.jsx'
import { formatRelativeTime } from '../lib/format.js'

export default function Notifications({ me, onSignedOut }) {
  const [notifications, setNotifications] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setNotifications(await api.listNotifications())
    } catch (err) {
      setError(err.message)
    }
  }

  async function markAllRead() {
    try {
      await api.markAllNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      setError(err.message)
    }
  }

  async function open(notification) {
    if (!notification.read) {
      try {
        await api.markNotificationRead(notification.id)
        setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))
      } catch {
        // Non-fatal — still navigate even if marking read failed.
      }
    }
    if (notification.linkPath) navigate(notification.linkPath)
  }

  const hasUnread = notifications?.some((n) => !n.read)

  return (
    <AppLayout me={me} onSignedOut={onSignedOut}>
      <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-semibold text-stone-900">Notifications</h1>
          {hasUnread && (
            <button className="cc-btn-secondary cc-btn-sm" onClick={markAllRead}>
              Mark all as read
            </button>
          )}
        </div>

        {error && <p className="rounded-lg bg-status-denied-bg px-4 py-3 text-sm text-status-denied">{error}</p>}

        {notifications === null && !error && <Spinner label="Loading notifications…" />}

        {notifications && notifications.length === 0 && (
          <EmptyState icon="🔔" title="You're all caught up" description="Replies, group activity, and messages will show up here." />
        )}

        {notifications && notifications.length > 0 && (
          <ul className="flex flex-col gap-2">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => open(n)}
                  className={
                    'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ' +
                    (n.read ? 'border-stone-200 bg-surface hover:bg-stone-50' : 'border-brand-200 bg-brand-50 hover:bg-brand-100')
                  }
                >
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />}
                  {n.read && <span className="mt-1.5 h-2 w-2 shrink-0" aria-hidden="true" />}
                  <div className="min-w-0 flex-1">
                    <p className={'text-sm ' + (n.read ? 'text-stone-700' : 'font-medium text-stone-900')}>{n.message}</p>
                    <p className="mt-0.5 text-xs text-stone-400">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </AppLayout>
  )
}
