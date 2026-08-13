import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import AppLayout from '../components/AppLayout.jsx'
import PostComposer from '../components/PostComposer.jsx'
import PostList from '../components/PostList.jsx'
import { Avatar, BadgePill, EmptyState, Spinner } from '../components/ui.jsx'

export default function GroupDetail({ me, onSignedOut }) {
  const { groupId } = useParams()

  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState(null)
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState(null)

  const [showAddMember, setShowAddMember] = useState(false)
  const [directory, setDirectory] = useState(null)
  const [memberQuery, setMemberQuery] = useState('')
  const [addingId, setAddingId] = useState(null)
  const [memberActionError, setMemberActionError] = useState(null)

  useEffect(() => {
    loadAll()
  }, [groupId])

  async function loadAll() {
    setError(null)
    try {
      const [groupRes, membersRes, postsRes] = await Promise.all([
        api.getGroup(groupId),
        api.listGroupMembers(groupId),
        api.listGroupPosts(groupId),
      ])
      setGroup(groupRes)
      setMembers(membersRes)
      setPosts(postsRes)
    } catch (err) {
      setError(err.message)
    }
  }

  async function loadPosts() {
    try {
      setPosts(await api.listGroupPosts(groupId))
    } catch (err) {
      setError(err.message)
    }
  }

  const myMembership = useMemo(() => members?.find((m) => m.id === me.id), [members, me.id])
  const isOwner = myMembership?.role === 'OWNER'

  async function openAddMember() {
    setShowAddMember(true)
    if (!directory) {
      try {
        setDirectory(await api.listMembers())
      } catch (err) {
        setMemberActionError(err.message)
      }
    }
  }

  const candidateMembers = useMemo(() => {
    if (!directory || !members) return []
    const memberIds = new Set(members.map((m) => m.id))
    const q = memberQuery.trim().toLowerCase()
    return directory.filter((d) => {
      if (memberIds.has(d.id)) return false
      if (!q) return true
      return d.name?.toLowerCase().includes(q) || d.badge?.toLowerCase().includes(q)
    })
  }, [directory, members, memberQuery])

  async function addMember(memberId) {
    setAddingId(memberId)
    setMemberActionError(null)
    try {
      await api.addGroupMember(groupId, memberId)
      setMembers(await api.listGroupMembers(groupId))
    } catch (err) {
      setMemberActionError(err.message)
    } finally {
      setAddingId(null)
    }
  }

  async function removeMember(memberId) {
    setMemberActionError(null)
    try {
      await api.removeGroupMember(groupId, memberId)
      setMembers(await api.listGroupMembers(groupId))
    } catch (err) {
      setMemberActionError(err.message)
    }
  }

  if (error) {
    return (
      <AppLayout me={me} onSignedOut={onSignedOut}>
        <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
          <Link to="/groups" className="text-sm text-brand-700 hover:underline">← Back to groups</Link>
          <p className="rounded-lg bg-status-denied-bg px-4 py-3 text-sm text-status-denied">{error}</p>
        </main>
      </AppLayout>
    )
  }

  if (!group || !members || !posts) {
    return (
      <AppLayout me={me} onSignedOut={onSignedOut}>
        <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
          <Spinner label="Loading group…" />
        </main>
      </AppLayout>
    )
  }

  return (
    <AppLayout me={me} onSignedOut={onSignedOut}>
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
        <div>
          <Link to="/groups" className="text-sm text-brand-700 hover:underline">← Back to groups</Link>
          <h1 className="mt-2 font-display text-2xl font-semibold text-stone-900">{group.name}</h1>
          {group.description && <p className="mt-1 text-sm text-stone-600">{group.description}</p>}
        </div>

        <section className="cc-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-900">
              Members ({members.length})
            </h2>
            {isOwner && (
              <button className="cc-btn-secondary cc-btn-sm" onClick={openAddMember}>
                Add member
              </button>
            )}
          </div>

          {showAddMember && (
            <div className="mt-3 border-t border-stone-100 pt-3">
              <input
                className="cc-input"
                type="text"
                value={memberQuery}
                onChange={(e) => setMemberQuery(e.target.value)}
                placeholder="Search the directory by name or credential…"
              />
              {!directory && <Spinner label="Loading directory…" />}
              {directory && (
                <ul className="mt-2 flex max-h-48 flex-col gap-1 overflow-y-auto">
                  {candidateMembers.length === 0 && (
                    <li className="py-2 text-sm text-stone-400">No matching members to add.</li>
                  )}
                  {candidateMembers.map((d) => (
                    <li key={d.id} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-stone-50">
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar name={d.name} size="sm" />
                        <span className="truncate text-sm text-stone-900">{d.name}</span>
                        <BadgePill badge={d.badge} credentialStatus={d.credentialStatus} />
                      </div>
                      <button
                        className="cc-btn-secondary cc-btn-sm shrink-0"
                        disabled={addingId === d.id}
                        onClick={() => addMember(d.id)}
                      >
                        {addingId === d.id ? 'Adding…' : 'Add'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {memberActionError && <p className="mt-2 text-sm text-status-denied">{memberActionError}</p>}

          <ul className="mt-3 flex flex-col gap-2">
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar name={m.name} size="sm" />
                  <span className="truncate text-sm text-stone-900">{m.name}</span>
                  <BadgePill badge={m.badge} credentialStatus={m.credentialStatus} />
                  {m.role === 'OWNER' && (
                    <span className="text-xs font-medium text-stone-400">Owner</span>
                  )}
                </div>
                {isOwner && m.role !== 'OWNER' && (
                  <button
                    className="shrink-0 text-xs font-medium text-stone-400 hover:text-status-denied"
                    onClick={() => removeMember(m.id)}
                  >
                    Remove
                  </button>
                )}
                {!isOwner && m.id === me.id && (
                  <button
                    className="shrink-0 text-xs font-medium text-stone-400 hover:text-status-denied"
                    onClick={() => removeMember(m.id)}
                  >
                    Leave
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <PostComposer
          me={me}
          createPost={(content) => api.createGroupPost(groupId, content)}
          onCreated={loadPosts}
          label="Post to this group"
        />

        {posts.length === 0 && (
          <EmptyState icon="💬" title="No posts in this group yet" description="Start the conversation." />
        )}

        {posts.length > 0 && (
          <PostList
            posts={posts}
            onChanged={loadPosts}
            createReply={(postId, content) => api.createGroupReply(groupId, postId, content)}
          />
        )}
      </main>
    </AppLayout>
  )
}
