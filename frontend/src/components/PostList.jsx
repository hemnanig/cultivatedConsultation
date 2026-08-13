import { useState } from 'react'
import { Avatar, BadgePill } from './ui.jsx'
import { ChatBubbleIcon } from './icons.jsx'
import { formatRelativeTime } from '../lib/format.js'

/**
 * Shared by the public feed and group feeds — createReply is injected (takes
 * a postId) so this component doesn't care which endpoint it's replying to.
 */
export default function PostList({ posts, onChanged, createReply }) {
  return (
    <ul className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onChanged={onChanged} createReply={createReply} />
      ))}
    </ul>
  )
}

function PostItem({ post, onChanged, createReply }) {
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const replyCount = post.replies.length

  async function submitReply(e) {
    e.preventDefault()
    if (!replyText.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await createReply(post.id, replyText.trim())
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
            <BadgePill badge={post.author.badge} credentialStatus={post.author.credentialStatus} />
          </div>
          <p className="text-xs text-stone-400">{formatRelativeTime(post.createdAt)}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-800">{post.content}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center border-t border-stone-100 pt-1.5">
        <button type="button" className="cc-btn-ghost" onClick={() => setOpen((o) => !o)}>
          <ChatBubbleIcon className="h-4 w-4" />
          {replyCount > 0 ? `${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}` : 'Reply'}
        </button>
      </div>

      {open && (
        <div className="mt-1">
          {replyCount > 0 && (
            <ul className="ml-4 flex flex-col gap-3 border-l-2 border-stone-100 pl-4 pt-2">
              {post.replies.map((reply) => (
                <li key={reply.id} className="flex items-start gap-2.5">
                  <Avatar name={reply.author.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-stone-900">{reply.author.name}</span>
                      <BadgePill badge={reply.author.badge} credentialStatus={reply.author.credentialStatus} />
                      <span className="text-xs text-stone-400">· {formatRelativeTime(reply.createdAt)}</span>
                    </div>
                    <p className="text-sm text-stone-700">{reply.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <form
            className={'flex gap-2 ' + (replyCount > 0 ? 'ml-4 mt-3 pl-4' : 'mt-2')}
            onSubmit={submitReply}
          >
            <input
              type="text"
              className="cc-input"
              placeholder="Reply…"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              autoFocus
            />
            <button className="cc-btn cc-btn-sm shrink-0" type="submit" disabled={submitting || !replyText.trim()}>
              Reply
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-status-denied">{error}</p>}
        </div>
      )}
    </li>
  )
}
