import { useState } from 'react'
import { api } from '../api.js'

export default function PostComposer({ onCreated }) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await api.createPost(content.trim())
      setContent('')
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="card composer" onSubmit={submit}>
      <label htmlFor="post-content">Ask a de-identified consultation question</label>
      <textarea
        id="post-content"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Describe the clinical question — omit names, dates, and any identifying details."
      />
      <div className="composer-footer">
        <span className="muted small">Do not post PHI or identifying client information.</span>
        <button className="button" type="submit" disabled={submitting || !content.trim()}>
          {submitting ? 'Posting…' : 'Post'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
