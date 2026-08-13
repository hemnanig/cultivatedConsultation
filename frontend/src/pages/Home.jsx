import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import PostComposer from '../components/PostComposer.jsx'
import PostList from '../components/PostList.jsx'
import AppLayout from '../components/AppLayout.jsx'
import { EmptyState, Spinner } from '../components/ui.jsx'
import { SearchIcon } from '../components/icons.jsx'

export default function Home({ me, onSignedOut }) {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    load()
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
      <main className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-8">
        {/* Desktop already has a persistent search box in the top bar — this
            one only needs to show on mobile, where Topbar is hidden. */}
        <form onSubmit={submitSearch} className="md:hidden">
          <div className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
            <SearchIcon className="h-4 w-4 shrink-0 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members by name, credential, or specialty…"
              className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
        </form>

        <PostComposer me={me} createPost={api.createPost} onCreated={load} />

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
      </main>
    </AppLayout>
  )
}
