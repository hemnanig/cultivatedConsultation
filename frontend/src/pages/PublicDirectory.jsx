import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import logo from '../assets/images/CC-1024-x-1024-px.png'
import AppLayout from '../components/AppLayout.jsx'
import { Avatar, BadgePill, SpecialtyPill, EmptyState, Spinner } from '../components/ui.jsx'
import { parseSpecialties } from '../lib/format.js'

/**
 * The one page in the app reachable signed out — members who opt in via
 * their Profile page show up here for outside visitors (referral partners,
 * prospective clients, etc.) with only the fields they explicitly agreed to
 * share. Signed-in members reach it from the Topbar/MoreSheet menu, so it
 * gets the standard AppLayout shell (Topbar/BottomNav) like every other
 * screen in that case; a bare-bones header with a "Sign in" link only
 * applies to actual anonymous visitors, who have no AppLayout to show.
 */
export default function PublicDirectory({ me, onSignedOut }) {
  const [members, setMembers] = useState(null)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    api
      .publicDirectory()
      .then(setMembers)
      .catch((err) => setError(err.message))
  }, [])

  const filtered = useMemo(() => {
    if (!members) return []
    const q = query.trim().toLowerCase()
    if (!q) return members
    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.badge?.toLowerCase().includes(q) ||
        m.specialties?.toLowerCase().includes(q)
    )
  }, [members, query])

  const content = (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-stone-900">Public member directory</h1>
        <p className="mt-1 text-sm text-stone-600">
          Members who've opted in to public visibility. Full member details and messaging require a
          free account.
        </p>
      </div>

      <input
        className="cc-input"
        type="text"
        placeholder="Search by name, credential, or specialty…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error && <p className="rounded-lg bg-status-denied-bg px-4 py-3 text-sm text-status-denied">{error}</p>}

      {members === null && !error && <Spinner label="Loading directory…" />}

      {members && filtered.length === 0 && (
        <EmptyState
          icon="🔎"
          title={members.length === 0 ? 'No public listings yet' : 'No members match'}
          description={
            members.length === 0
              ? 'Members can opt in from their profile settings.'
              : 'Try a different search term.'
          }
        />
      )}

      {members && filtered.length > 0 && (
        <ul className="grid gap-3 lg:grid-cols-2">
          {filtered.map((m, i) => (
            <li key={i} className="cc-card flex items-start gap-3 p-4">
              <Avatar name={m.name} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-stone-900">{m.name}</span>
                  <BadgePill badge={m.badge} credentialStatus={m.credentialStatus} />
                </div>
                {m.bio && <p className="mt-1 text-sm text-stone-600">{m.bio}</p>}
                {parseSpecialties(m.specialties).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {parseSpecialties(m.specialties).map((s) => (
                      <SpecialtyPill key={s}>{s}</SpecialtyPill>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )

  // Signed-in members get the same Topbar/BottomNav shell as every other
  // screen instead of a dead-end "Back to app" button. Only an actual
  // anonymous visitor sees the standalone header, since AppLayout assumes
  // an authenticated `me`.
  if (me) {
    return (
      <AppLayout me={me} onSignedOut={onSignedOut}>
        {content}
      </AppLayout>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="flex items-center justify-between border-b border-stone-200 bg-surface px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img className="h-8 w-8" src={logo} alt="Cultivated Consultation" />
          <span className="font-display text-sm font-semibold text-stone-900">Cultivated Consultation</span>
        </Link>
        <Link to="/" className="cc-btn-secondary cc-btn-sm">
          Sign in
        </Link>
      </header>

      {content}
    </div>
  )
}
