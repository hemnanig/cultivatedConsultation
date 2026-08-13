import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'
import NavBar from '../components/NavBar.jsx'
import { Avatar, BadgePill, SpecialtyPill, EmptyState, Spinner } from '../components/ui.jsx'
import { parseSpecialties } from '../lib/format.js'

export default function Directory({ me }) {
  const [members, setMembers] = useState(null)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [activeSpecialty, setActiveSpecialty] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setMembers(await api.listMembers())
    } catch (err) {
      setError(err.message)
    }
  }

  const allSpecialties = useMemo(() => {
    if (!members) return []
    const set = new Set()
    members.forEach((m) => parseSpecialties(m.specialties).forEach((s) => set.add(s)))
    return [...set].sort()
  }, [members])

  const filtered = useMemo(() => {
    if (!members) return []
    return members.filter((m) => {
      const matchesSpecialty = !activeSpecialty || parseSpecialties(m.specialties).includes(activeSpecialty)
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        m.name?.toLowerCase().includes(q) ||
        m.badge?.toLowerCase().includes(q) ||
        m.specialties?.toLowerCase().includes(q)
      return matchesSpecialty && matchesQuery
    })
  }, [members, query, activeSpecialty])

  return (
    <div className="min-h-screen bg-stone-50">
      <NavBar me={me} />

      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-900">Member directory</h1>
          <p className="mt-1 text-sm text-stone-600">
            Find peers by name, credential, or specialty — perinatal mental health, trauma, addiction, and more.
          </p>
        </div>

        <input
          className="cc-input"
          type="text"
          placeholder="Search by name, credential, or specialty…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {allSpecialties.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <SpecialtyPill active={activeSpecialty === null} onClick={() => setActiveSpecialty(null)}>
              All
            </SpecialtyPill>
            {allSpecialties.map((s) => (
              <SpecialtyPill key={s} active={activeSpecialty === s} onClick={() => setActiveSpecialty(s)}>
                {s}
              </SpecialtyPill>
            ))}
          </div>
        )}

        {error && <p className="rounded-lg bg-status-denied-bg px-4 py-3 text-sm text-status-denied">{error}</p>}

        {members === null && !error && <Spinner label="Loading directory…" />}

        {members && filtered.length === 0 && (
          <EmptyState
            icon="🔎"
            title="No members match"
            description="Try a different search term or clear the specialty filter."
          />
        )}

        {members && filtered.length > 0 && (
          <ul className="flex flex-col gap-3">
            {filtered.map((m) => (
              <li key={m.id} className="cc-card flex items-start gap-3 p-4">
                <Avatar name={m.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-stone-900">{m.name}</span>
                    <BadgePill badge={m.badge} />
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
    </div>
  )
}
