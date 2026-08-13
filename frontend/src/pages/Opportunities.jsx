import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import AppLayout from '../components/AppLayout.jsx'
import { Avatar, BadgePill, EmptyState, Spinner } from '../components/ui.jsx'
import { BriefcaseIcon, ChatBubbleIcon } from '../components/icons.jsx'
import { formatRelativeTime } from '../lib/format.js'

const TYPES = [
  { value: 'JOB', label: 'Job' },
  { value: 'RESEARCH', label: 'Research' },
  { value: 'SUPERVISION', label: 'Supervision' },
  { value: 'TRAINING', label: 'Training' },
  { value: 'OTHER', label: 'Other' },
]

const TYPE_LABEL = Object.fromEntries(TYPES.map((t) => [t.value, t.label]))

/**
 * No replies/threads here by design — members respond via the existing DM
 * system (each listing links to a message thread with the author), same
 * pattern the product brief describes for this board.
 */
export default function Opportunities({ me, onSignedOut }) {
  const [opportunities, setOpportunities] = useState(null)
  const [error, setError] = useState(null)

  const [expanded, setExpanded] = useState(false)
  const [type, setType] = useState('JOB')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setOpportunities(await api.listOpportunities())
    } catch (err) {
      setError(err.message)
    }
  }

  async function submit(e) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return
    setSubmitting(true)
    setFormError(null)
    try {
      await api.createOpportunity(type, title.trim(), description.trim())
      setTitle('')
      setDescription('')
      setType('JOB')
      setExpanded(false)
      await load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function remove(id) {
    setDeletingId(id)
    try {
      await api.deleteOpportunity(id)
      setOpportunities((prev) => prev.filter((o) => o.id !== id))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AppLayout me={me} onSignedOut={onSignedOut}>
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-900">Opportunities &amp; offerings</h1>
          <p className="mt-1 text-sm text-stone-600">
            Jobs, research collaborations, supervision openings, and trainings shared by the community.
            Respond by messaging the poster directly.
          </p>
        </div>

        <div className="cc-card p-4 sm:p-5">
          {!expanded ? (
            <button type="button" onClick={() => setExpanded(true)} className="flex w-full items-center gap-3 text-left">
              <Avatar name={me?.name || me?.email} />
              <span className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-500 transition-colors hover:bg-stone-100">
                Post a job, research opportunity, supervision opening, or training…
              </span>
            </button>
          ) : (
            <form className="flex flex-col gap-3" onSubmit={submit}>
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={
                      'rounded-full px-3 py-1 text-xs font-medium transition-colors ' +
                      (type === t.value ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200')
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <input
                className="cc-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title — e.g. Part-time clinical supervisor, perinatal specialty"
                maxLength={200}
              />
              <textarea
                className="cc-input resize-y"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details — setting, time commitment, requirements, how to respond…"
                maxLength={2000}
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="cc-btn-ghost"
                  disabled={submitting}
                  onClick={() => {
                    setExpanded(false)
                    setTitle('')
                    setDescription('')
                    setFormError(null)
                  }}
                >
                  Cancel
                </button>
                <button className="cc-btn" type="submit" disabled={submitting || !title.trim() || !description.trim()}>
                  {submitting ? 'Posting…' : 'Post'}
                </button>
              </div>
              {formError && <p className="text-sm text-status-denied">{formError}</p>}
            </form>
          )}
        </div>

        {error && <p className="rounded-lg bg-status-denied-bg px-4 py-3 text-sm text-status-denied">{error}</p>}

        {opportunities === null && !error && <Spinner label="Loading opportunities…" />}

        {opportunities && opportunities.length === 0 && (
          <EmptyState icon="💼" title="Nothing posted yet" description="Be the first to share a job, research collaboration, or training." />
        )}

        {opportunities && opportunities.length > 0 && (
          <ul className="flex flex-col gap-3">
            {opportunities.map((o) => {
              const canDelete = me.admin || o.author?.id === me.id
              return (
                <li key={o.id} className="cc-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                      <BriefcaseIcon className="h-3.5 w-3.5" />
                      {TYPE_LABEL[o.type] || o.type}
                    </span>
                    {canDelete && (
                      <button
                        className="shrink-0 text-xs font-medium text-stone-400 hover:text-status-denied"
                        disabled={deletingId === o.id}
                        onClick={() => remove(o.id)}
                      >
                        {deletingId === o.id ? 'Removing…' : 'Remove'}
                      </button>
                    )}
                  </div>
                  <h2 className="mt-2 font-medium text-stone-900">{o.title}</h2>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{o.description}</p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={o.author?.name} size="sm" />
                      <span className="text-sm text-stone-700">{o.author?.name}</span>
                      <BadgePill badge={o.author?.badge} credentialStatus={o.author?.credentialStatus} />
                      <span className="text-xs text-stone-400">· {formatRelativeTime(o.createdAt)}</span>
                    </div>
                    {o.author?.id && o.author.id !== me.id && (
                      <Link
                        to={`/messages/${o.author.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 hover:underline"
                      >
                        <ChatBubbleIcon className="h-3.5 w-3.5" />
                        Message
                      </Link>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </AppLayout>
  )
}
