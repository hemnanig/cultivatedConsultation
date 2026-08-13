import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { api } from '../api.js'
import AppLayout from '../components/AppLayout.jsx'
import { Avatar, BadgePill, Spinner } from '../components/ui.jsx'
import { formatRelativeTime } from '../lib/format.js'

export default function MessageThread({ me, onSignedOut }) {
  const { userId } = useParams()
  const location = useLocation()

  const [counterpart, setCounterpart] = useState(location.state?.member ?? null)
  const [messages, setMessages] = useState(null)
  const [error, setError] = useState(null)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadThread()
    if (!counterpart) loadCounterpart()
  }, [userId])

  async function loadThread() {
    try {
      setMessages(await api.getThread(userId))
    } catch (err) {
      setError(err.message)
    }
  }

  async function loadCounterpart() {
    try {
      const members = await api.listMembers()
      setCounterpart(members.find((m) => String(m.id) === String(userId)) ?? null)
    } catch {
      // Non-fatal — the thread still works without header details.
    }
  }

  async function submit(e) {
    e.preventDefault()
    if (!content.trim()) return
    setSending(true)
    setError(null)
    try {
      await api.sendMessage(Number(userId), content.trim())
      setContent('')
      await loadThread()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <AppLayout me={me} onSignedOut={onSignedOut}>
      <main className="mx-auto flex h-[calc(100vh-4rem)] max-w-2xl flex-col px-4 py-6 md:h-screen md:py-8">
        <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
          <Link to="/messages" className="text-sm text-brand-700 hover:underline">←</Link>
          {counterpart ? (
            <>
              <Avatar name={counterpart.name} size="sm" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-stone-900">{counterpart.name}</span>
                  <BadgePill badge={counterpart.badge} credentialStatus={counterpart.credentialStatus} />
                </div>
              </div>
            </>
          ) : (
            <span className="text-sm text-stone-500">Conversation</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {messages === null && !error && <Spinner label="Loading conversation…" />}
          {error && <p className="rounded-lg bg-status-denied-bg px-4 py-3 text-sm text-status-denied">{error}</p>}

          {messages && messages.length === 0 && (
            <p className="py-8 text-center text-sm text-stone-400">
              No messages yet — say hello.
            </p>
          )}

          {messages && messages.length > 0 && (
            <ul className="flex flex-col gap-2">
              {messages.map((m) => {
                const fromMe = m.senderId === me.id
                return (
                  <li key={m.id} className={'flex ' + (fromMe ? 'justify-end' : 'justify-start')}>
                    <div className={'max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ' + (fromMe ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-900')}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                      <p className={'mt-0.5 text-[11px] ' + (fromMe ? 'text-brand-100' : 'text-stone-400')}>
                        {formatRelativeTime(m.createdAt)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <form onSubmit={submit} className="flex gap-2 border-t border-stone-200 pt-4">
          <input
            className="cc-input"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a message…"
          />
          <button className="cc-btn shrink-0" type="submit" disabled={sending || !content.trim()}>
            Send
          </button>
        </form>
      </main>
    </AppLayout>
  )
}
