import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import AppLayout from '../components/AppLayout.jsx'
import { EmptyState, Spinner } from '../components/ui.jsx'

export default function Groups({ me, onSignedOut }) {
  const [groups, setGroups] = useState(null)
  const [error, setError] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setGroups(await api.listGroups())
    } catch (err) {
      setError(err.message)
    }
  }

  async function submitCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    setCreateError(null)
    try {
      await api.createGroup(name.trim(), description.trim())
      setName('')
      setDescription('')
      setShowCreate(false)
      await load()
    } catch (err) {
      setCreateError(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <AppLayout me={me} onSignedOut={onSignedOut}>
      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-stone-900">Groups of Interest</h1>
            <p className="mt-1 text-sm text-stone-600">
              Private, hand-picked discussion groups — useful for keeping a conversation to
              specific colleagues, e.g. avoiding a former client who's also a member.
            </p>
          </div>
          <button className="cc-btn shrink-0" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? 'Cancel' : 'New group'}
          </button>
        </div>

        {showCreate && (
          <form className="cc-card flex flex-col gap-3 p-5" onSubmit={submitCreate}>
            <div>
              <label htmlFor="group-name" className="text-sm font-medium text-stone-900">
                Group name
              </label>
              <input
                id="group-name"
                className="cc-input mt-1.5"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Perinatal MH peer consult"
              />
            </div>
            <div>
              <label htmlFor="group-description" className="text-sm font-medium text-stone-900">
                Description (optional)
              </label>
              <textarea
                id="group-description"
                className="cc-input mt-1.5 resize-y"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this group for?"
              />
            </div>
            <div className="flex items-center justify-between">
              <button className="cc-btn" type="submit" disabled={creating || !name.trim()}>
                {creating ? 'Creating…' : 'Create group'}
              </button>
              {createError && <span className="text-sm text-status-denied">{createError}</span>}
            </div>
          </form>
        )}

        {error && <p className="rounded-lg bg-status-denied-bg px-4 py-3 text-sm text-status-denied">{error}</p>}

        {groups === null && !error && <Spinner label="Loading groups…" />}

        {groups && groups.length === 0 && (
          <EmptyState
            icon="👥"
            title="You're not in any groups yet"
            description="Create one and hand-pick who's in it, or wait for an invite from a colleague."
          />
        )}

        {groups && groups.length > 0 && (
          <ul className="flex flex-col gap-3">
            {groups.map((g) => (
              <li key={g.id}>
                <Link to={`/groups/${g.id}`} className="cc-card flex items-center justify-between p-4 transition-colors hover:bg-stone-50">
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900">{g.name}</p>
                    {g.description && <p className="mt-0.5 truncate text-sm text-stone-500">{g.description}</p>}
                  </div>
                  <span className="shrink-0 text-xs text-stone-400">
                    {g.memberCount} {g.memberCount === 1 ? 'member' : 'members'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </AppLayout>
  )
}
