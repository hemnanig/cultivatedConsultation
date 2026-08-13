import { useState } from 'react'
import { api } from '../api.js'
import { Avatar, BadgePill } from './ui.jsx'
import { formatRelativeTime } from '../lib/format.js'

export default function PostList({ posts, onChanged }) {
  return (
    <ul className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onChanged={onChanged} />
      ))}
    </ul>
  )
}

function PostItem({ post, onChanged }) {
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function submitReply(e) {
    e.preventDefault()
    if (!replyText.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await api.createReply(post.id, replyText.trim())
      setReplyText('')
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <li className="cc-card p-5">
      <div className="flex items-start gap-3">
        <Avatar name={post.author.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-stone-900">{post.author.name}</span>
            <BadgePill badge={post.author.badge} />
            <span className="text-xs text-stone-400">· {formatRelativeTime(post.createdAt)}</span>
          </div>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-stone-800">{post.content}</p>
        </div>
      </div>

      {post.replies.length > 0 && (
        <ul className="ml-4 mt-4 flex flex-col gap-3 border-l-2 border-stone-100 pl-4">
          {post.replies.map((reply) => (
            <li key={reply.id} className="flex items-start gap-2.5">
              <Avatar name={reply.author.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-stone-900">{reply.author.name}</span>
                  <BadgePill badge={reply.author.badge} />
                  <span className="text-xs text-stone-400">· {formatRelativeTime(reply.createdAt)}</span>
                </div>
                <p className="text-sm text-stone-700">{reply.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="mt-4 flex gap-2" onSubmit={submitReply}>
        <input
          type="text"
          className="cc-input"
          placeholder="Reply…"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button className="cc-btn cc-btn-sm shrink-0" type="submit" disabled={submitting || !replyText.trim()}>
          Reply
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-status-denied">{error}</p>}
    </li>
  )
}
