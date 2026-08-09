import { useState } from 'react'
import { api } from '../api.js'

export default function PostList({ posts, onChanged }) {
  return (
    <ul className="post-list">
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
    <li className="card post">
      <div className="post-author">
        {post.author.name}{post.author.badge ? ` · ${post.author.badge}` : ''}
      </div>
      <p className="post-content">{post.content}</p>

      {post.replies.length > 0 && (
        <ul className="reply-list">
          {post.replies.map((reply) => (
            <li key={reply.id} className="reply">
              <span className="reply-author">
                {reply.author.name}{reply.author.badge ? ` · ${reply.author.badge}` : ''}:
              </span>{' '}
              {reply.content}
            </li>
          ))}
        </ul>
      )}

      <form className="reply-form" onSubmit={submitReply}>
        <input
          type="text"
          placeholder="Reply…"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button className="button button-small" type="submit" disabled={submitting || !replyText.trim()}>
          Reply
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </li>
  )
}
