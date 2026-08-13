import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../api.js'
import AppLayout from '../components/AppLayout.jsx'
import { Avatar, EmptyState, Spinner } from '../components/ui.jsx'

export default function Admin({ me, onSignedOut }) {
  const [users, setUsers] = useState(null)
  const [error, setError] = useState(null)
  const [actingOn, setActingOn] = useState(null)

  const [credentials, setCredentials] = useState(null)
  const [credentialError, setCredentialError] = useState(null)
  const [actingOnCredential, setActingOnCredential] = useState(null)

  useEffect(() => {
    load()
    loadCredentials()
  }, [])

  async function load() {
    try {
      setUsers(await api.pendingUsers())
    } catch (err) {
      setError(err.message)
    }
  }

  async function loadCredentials() {
    try {
      setCredentials(await api.pendingCredentials())
    } catch (err) {
      setCredentialError(err.message)
    }
  }

  async function decide(userId, decision) {
    setActingOn(userId)
    setError(null)
    try {
      if (decision === 'approve') await api.approveUser(userId)
      else await api.denyUser(userId)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (err) {
      setError(err.message)
    } finally {
      setActingOn(null)
    }
  }

  async function decideCredential(userId, decision) {
    setActingOnCredential(userId)
    setCredentialError(null)
    try {
      if (decision === 'verify') await api.verifyCredential(userId)
      else await api.rejectCredential(userId)
      setCredentials((prev) => prev.filter((u) => u.id !== userId))
    } catch (err) {
      setCredentialError(err.message)
    } finally {
      setActingOnCredential(null)
    }
  }

  if (!me.admin) return <Navigate to="/" replace />

  return (
    <AppLayout me={me} onSignedOut={onSignedOut}>
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8">
        <section className="flex flex-col gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-stone-900">Pending applications</h1>
            <p className="mt-1 text-sm text-stone-600">Review new sign-ups before they can see or post in the community.</p>
          </div>

          {error && <p className="rounded-lg bg-status-denied-bg px-4 py-3 text-sm text-status-denied">{error}</p>}

          {users === null && !error && <Spinner label="Loading pending applications…" />}

          {users && users.length === 0 && (
            <EmptyState icon="✅" title="Nothing to review" description="No pending applications right now." />
          )}

          {users && users.length > 0 && (
            <ul className="flex flex-col gap-3">
              {users.map((u) => (
                <li key={u.id} className="cc-card flex flex-wrap items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name || u.email} />
                    <div>
                      <p className="font-medium text-stone-900">{u.name || u.email}</p>
                      <p className="text-sm text-stone-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="cc-btn cc-btn-sm"
                      disabled={actingOn === u.id}
                      onClick={() => decide(u.id, 'approve')}
                    >
                      Approve
                    </button>
                    <button
                      className="cc-btn-secondary cc-btn-sm"
                      disabled={actingOn === u.id}
                      onClick={() => decide(u.id, 'deny')}
                    >
                      Deny
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-4 border-t border-stone-200 pt-8">
          <div>
            <h2 className="font-display text-xl font-semibold text-stone-900">Credential verification requests</h2>
            <p className="mt-1 text-sm text-stone-600">
              Confirm license number + state against the issuing board before verifying — this is
              out-of-band, the app doesn't check licensing boards itself.
            </p>
          </div>

          {credentialError && (
            <p className="rounded-lg bg-status-denied-bg px-4 py-3 text-sm text-status-denied">{credentialError}</p>
          )}

          {credentials === null && !credentialError && <Spinner label="Loading credential requests…" />}

          {credentials && credentials.length === 0 && (
            <EmptyState icon="🪪" title="Nothing to review" description="No pending credential requests right now." />
          )}

          {credentials && credentials.length > 0 && (
            <ul className="flex flex-col gap-3">
              {credentials.map((u) => (
                <li key={u.id} className="cc-card flex flex-wrap items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name || u.email} />
                    <div>
                      <p className="font-medium text-stone-900">{u.name || u.email}</p>
                      <p className="text-sm text-stone-500">
                        License {u.licenseNumber} · {u.licenseState}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="cc-btn cc-btn-sm"
                      disabled={actingOnCredential === u.id}
                      onClick={() => decideCredential(u.id, 'verify')}
                    >
                      Verify
                    </button>
                    <button
                      className="cc-btn-secondary cc-btn-sm"
                      disabled={actingOnCredential === u.id}
                      onClick={() => decideCredential(u.id, 'reject')}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </AppLayout>
  )
}
