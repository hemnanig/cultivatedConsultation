import { useEffect, useState } from 'react'
import { api } from '../api.js'
import PostComposer from '../components/PostComposer.jsx'
import PostList from '../components/PostList.jsx'
import logo from '../assets/images/CC-1024-x-1024-px.png'

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
    <div className="page">
      <header className="topbar">
        <div className="topbar-brand">
          <img className="logo logo-small" src={logo} alt="Cultivated Consultation" />
          <span className="topbar-title">Cultivated Consultation</span>
        </div>
        <div className="topbar-user">{me.name || me.email}{me.badge ? ` · ${me.badge}` : ''}</div>
      </header>

      <main className="feed">
        <PostComposer onCreated={load} />
        {error && <p className="error">{error}</p>}
        {posts === null && !error && <p className="muted">Loading posts…</p>}
        {posts && posts.length === 0 && <p className="muted">No consultation questions yet — be the first to ask one.</p>}
        {posts && <PostList posts={posts} onChanged={load} />}
      </main>
    </div>
  )
}
