import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import AppLayout from '../components/AppLayout.jsx'
import { Avatar, BadgePill, EmptyState, Spinner } from '../components/ui.jsx'
import { formatRelativeTime } from '../lib/format.js'

export default function Messages({ me, onSignedOut }) {
  const [conversations, setConversations] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setConversations(await api.listConversations())
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AppLayout me={me} onSignedOut={onSignedOut}>
      <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-900">Messages</h1>
          <p className="mt-1 text-sm text-stone-600">
            Start a conversation from a member's card in the{' '}
            <Link to="/directory" className="text-brand-700 hover:underline">directory</Link>.
          </p>
        </div>

        {error && <p className="rounded-lg bg-status-denied-bg px-4 py-3 text-sm text-status-denied">{error}</p>}

        {conversations === null && !error && <Spinner label="Loading messages…" />}

        {conversations && conversations.length === 0 && (
          <EmptyState icon="✉️" title="No conversations yet" description="Message a colleague from their directory listing to get started." />
        )}

        {conversations && conversations.length > 0 && (
          <ul className="flex flex-col gap-2">
            {conversations.map((c) => (
              <li key={c.counterpart.id}>
                <Link
                  to={`/messages/${c.counterpart.id}`}
                  className="cc-card flex items-center gap-3 p-4 transition-colors hover:bg-stone-50"
                >
                  <Avatar name={c.counterpart.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={'text-sm ' + (c.unreadCount > 0 ? 'font-semibold text-stone-900' : 'font-medium text-stone-900')}>
                        {c.counterpart.name}
                      </span>
                      <BadgePill badge={c.counterpart.badge} credentialStatus={c.counterpart.credentialStatus} />
                    </div>
                    <p className={'truncate text-sm ' + (c.unreadCount > 0 ? 'font-medium text-stone-800' : 'text-stone-500')}>
                      {c.lastMessageFromMe && <span className="text-stone-400">You: </span>}
                      {c.lastMessage}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-xs text-stone-400">{formatRelativeTime(c.lastMessageAt)}</span>
                    {c.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-semibold text-white">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </AppLayout>
  )
}
