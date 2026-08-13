import { useEffect, useState } from 'react'
import { api } from '../api.js'
import PostComposer from '../components/PostComposer.jsx'
import PostList from '../components/PostList.jsx'
import NavBar from '../components/NavBar.jsx'
import { EmptyState, Spinner } from '../components/ui.jsx'

export default function Feed({ me }) {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setPosts(await api.listPosts())
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <NavBar me={me} />

      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
        <PostComposer onCreated={load} />

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

        {posts && posts.length > 0 && <PostList posts={posts} onChanged={load} />}
      </main>
    </div>
  )
}
