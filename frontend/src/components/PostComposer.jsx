import { useState } from 'react'

/**
 * Shared by the public feed and group feeds — createPost is injected so this
 * component doesn't care which endpoint it's posting to.
 */
export default function PostComposer({ createPost, onCreated, label = 'Ask a de-identified consultation question' }) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await createPost(content.trim())
      setContent('')
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="cc-card flex flex-col gap-3 p-5" onSubmit={submit}>
      <label htmlFor="post-content" className="text-sm font-medium text-stone-900">
        {label}
      </label>
      <textarea
        id="post-content"
        className="cc-input resize-y"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Describe the clinical question — omit names, dates, and any identifying details."
      />
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-stone-500">Do not post PHI or identifying client information.</span>
        <button className="cc-btn shrink-0" type="submit" disabled={submitting || !content.trim()}>
          {submitting ? 'Posting…' : 'Post'}
        </button>
      </div>
      {error && <p className="text-sm text-status-denied">{error}</p>}
    </form>
  )
}
