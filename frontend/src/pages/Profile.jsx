import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import AppLayout from '../components/AppLayout.jsx'
import { Avatar, SpecialtyPill } from '../components/ui.jsx'
import { parseSpecialties } from '../lib/format.js'

export default function Profile({ me, onUpdated, onSignedOut }) {
  const [badge, setBadge] = useState(me.badge || '')
  const [bio, setBio] = useState(me.bio || '')
  const [specialties, setSpecialties] = useState(me.specialties || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await api.updateMe({ badge: badge.trim(), bio: bio.trim(), specialties: specialties.trim() })
      await onUpdated()
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function logout() {
    await api.logout()
    onSignedOut()
  }

  return (
    <AppLayout me={me} onSignedOut={onSignedOut}>
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
        <div className="flex items-center gap-4">
          <Avatar name={me.name || me.email} size="lg" />
          <div>
            <h1 className="font-display text-2xl font-semibold text-stone-900">{me.name || me.email}</h1>
            <p className="text-sm text-stone-500">{me.email}</p>
          </div>
        </div>

        {me.admin && (
          <Link
            to="/admin"
            className="cc-card flex items-center justify-between p-4 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50"
          >
            Review pending applications
            <span className="text-stone-400">→</span>
          </Link>
        )}

        <form className="cc-card flex flex-col gap-5 p-6" onSubmit={submit}>
          <div>
            <label htmlFor="badge" className="text-sm font-medium text-stone-900">
              Credential / role
            </label>
            <p className="mb-1.5 text-xs text-stone-500">
              e.g. "Licensed Marriage &amp; Family Therapist" or "Graduate Student — Clinical Psychology"
            </p>
            <input
              id="badge"
              className="cc-input"
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Your credential or role"
            />
          </div>

          <div>
            <label htmlFor="specialties" className="text-sm font-medium text-stone-900">
              Specialties
            </label>
            <p className="mb-1.5 text-xs text-stone-500">Comma-separated — shown in the member directory search.</p>
            <input
              id="specialties"
              className="cc-input"
              type="text"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="Perinatal Mental Health, Trauma, EMDR"
            />
            {parseSpecialties(specialties).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {parseSpecialties(specialties).map((s) => (
                  <SpecialtyPill key={s}>{s}</SpecialtyPill>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="text-sm font-medium text-stone-900">
              Bio
            </label>
            <p className="mb-1.5 text-xs text-stone-500">A short introduction shown on your directory listing.</p>
            <textarea
              id="bio"
              className="cc-input resize-y"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A sentence or two about your background and interests."
            />
          </div>

          <div className="flex items-center justify-between">
            <button className="cc-btn" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save profile'}
            </button>
            {saved && <span className="text-sm text-status-approved">Saved.</span>}
          </div>
          {error && <p className="text-sm text-status-denied">{error}</p>}
        </form>

        <button
          onClick={logout}
          className="cc-btn-secondary self-start md:hidden"
        >
          Log out
        </button>
      </main>
    </AppLayout>
  )
}
