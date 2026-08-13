import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import PostComposer from '../components/PostComposer.jsx'
import PostList from '../components/PostList.jsx'
import AnnouncementBanner from '../components/AnnouncementBanner.jsx'
import AppLayout from '../components/AppLayout.jsx'
import { EmptyState, Spinner, CredentialStatusBadge } from '../components/ui.jsx'
import { SearchIcon, GroupIcon, ShieldIcon, ChevronRightIcon } from '../components/icons.jsx'

const CREDENTIAL_COPY = {
  UNVERIFIED: 'Add your license number and state for a verified checkmark on your badge.',
  PENDING_REVIEW: 'An admin is reviewing what you submitted.',
  VERIFIED: 'Your credential is verified — it shows on your badge across the app.',
  REJECTED: 'Your last submission wasn’t verified. Double-check the details and resubmit.',
}

export default function Home({ me, onSignedOut }) {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [groups, setGroups] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    load()
    api.listGroups().then(setGroups).catch(() => setGroups([]))
  }, [])

  function submitSearch(e) {
    e.preventDefault()
    navigate(`/directory?q=${encodeURIComponent(query.trim())}`)
  }

  async function load() {
    try {
      setPosts(await api.listPosts())
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AppLayout me={me} onSignedOut={onSignedOut}>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-6">
          <div className="flex flex-col gap-3">
            {/* Desktop already has a persistent search box in the top bar — this
                one only needs to show on mobile, where Topbar is hidden. */}
            <form onSubmit={submitSearch} className="md:hidden">
              <div className="flex items-center gap-2 rounded-full border border-stone-300 bg-surface px-4 py-2.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/25">
                <SearchIcon className="h-4 w-4 shrink-0 text-stone-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search members by name, credential, or specialty…"
                  className="w-full bg-transparent text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
                />
              </div>
            </form>

            <AnnouncementBanner />

            <PostComposer me={me} createPost={api.createPost} onCreated={load} allowAnonymous />

            {error && (
              <p className="rounded-lg bg-status-denied-bg px-4 py-3 text-sm text-status-denied">{error}</p>
            )}

            {posts === null && !error && <Spinner label="Loading posts…" />}

            {posts && posts.length === 0 && (
              <EmptyState
                icon="💬"
                title="No consultation questions yet"
                description="Be the first to ask one — remember to keep it de-identified."
              />
            )}

            {posts && posts.length > 0 && <PostList posts={posts} onChanged={load} createReply={api.createReply} />}
          </div>

          <aside className="hidden lg:sticky lg:top-20 lg:flex lg:flex-col lg:gap-4">
            <div className="cc-card p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-clay-100 text-clay-700">
                  <GroupIcon className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold text-stone-900">Your groups</p>
              </div>

              {groups === null && <p className="mt-3 text-xs text-stone-400">Loading…</p>}

              {groups && groups.length === 0 && (
                <div className="mt-3">
                  <p className="text-xs leading-relaxed text-stone-500">
                    Create a hand-picked group to keep a consultation to specific colleagues.
                  </p>
                  <Link to="/groups" className="mt-2 inline-block text-xs font-medium text-clay-600 hover:underline">
                    Create a group →
                  </Link>
                </div>
              )}

              {groups && groups.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2.5">
                  {groups.slice(0, 4).map((g) => (
                    <li key={g.id}>
                      <Link to={`/groups/${g.id}`} className="flex items-center justify-between gap-2 text-xs hover:text-clay-700">
                        <span className="truncate text-stone-700">{g.name}</span>
                        <span className="shrink-0 text-stone-400">{g.memberCount}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {groups && groups.length > 0 && (
                <Link
                  to="/groups"
                  className="mt-3 flex items-center gap-1 border-t border-stone-100 pt-3 text-xs font-medium text-clay-600 hover:underline"
                >
                  View all groups
                  <ChevronRightIcon className="h-3 w-3" />
                </Link>
              )}
            </div>

            <div className="cc-card p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <ShieldIcon className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold text-stone-900">Credential status</p>
              </div>
              <div className="mt-3">
                <CredentialStatusBadge status={me.credentialStatus} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-stone-500">
                {CREDENTIAL_COPY[me.credentialStatus] ?? CREDENTIAL_COPY.UNVERIFIED}
              </p>
              {me.credentialStatus !== 'VERIFIED' && me.credentialStatus !== 'PENDING_REVIEW' && (
                <Link to="/profile" className="mt-2 inline-block text-xs font-medium text-brand-700 hover:underline">
                  Go to your profile →
                </Link>
              )}
            </div>
          </aside>
        </div>
      </main>
    </AppLayout>
  )
}
