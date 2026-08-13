import { useState } from 'react'
import { Avatar } from './ui.jsx'
import { IncognitoIcon } from './icons.jsx'

/**
 * Shared by the public feed and group feeds — createPost is injected so this
 * component doesn't care which endpoint it's posting to.
 *
 * LinkedIn-style collapsed/expanded composer: starts as a single tappable
 * row (avatar + rounded pill) and opens into the full textarea on click,
 * rather than always showing an open text box.
 *
 * allowAnonymous is only ever true on the public feed (Home) — group posts
 * are never anonymous, so GroupDetail doesn't pass it and this stays hidden
 * there. createPost is always called as (content, anonymous); callers that
 * don't care about the second argument just ignore it.
 */
export default function PostComposer({
  me,
  createPost,
  onCreated,
  label = 'Ask a de-identified consultation question',
  allowAnonymous = false,
}) {
  const [expanded, setExpanded] = useState(false)
  const [content, setContent] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await createPost(content.trim(), anonymous)
      setContent('')
      setAnonymous(false)
      setExpanded(false)
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function cancel() {
    setContent('')
    setAnonymous(false)
    setError(null)
    setExpanded(false)
  }

  return (
    <div className="cc-card p-4 sm:p-5">
      {!expanded ? (
        <button type="button" onClick={() => setExpanded(true)} className="flex w-full items-center gap-3 text-left">
          <Avatar name={me?.name || me?.email} />
          <span className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-500 transition-colors hover:bg-stone-100">
            {label}…
          </span>
        </button>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={submit}>
          <div className="flex items-start gap-3">
            <Avatar name={me?.name || me?.email} />
            <textarea
              autoFocus
              id="post-content"
              className="cc-input flex-1 resize-y"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the clinical question — omit names, dates, and any identifying details."
            />
          </div>

          {allowAnonymous && (
            <label className="flex cursor-pointer items-center gap-2 self-start rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
              />
              <IncognitoIcon className="h-4 w-4 shrink-0" />
              Post anonymously
            </label>
          )}

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-stone-500">
              {anonymous
                ? 'Your name is hidden — your credential badge still shows.'
                : 'Do not post PHI or identifying client information.'}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" className="cc-btn-ghost" onClick={cancel} disabled={submitting}>
                Cancel
              </button>
              <button className="cc-btn" type="submit" disabled={submitting || !content.trim()}>
                {submitting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-status-denied">{error}</p>}
        </form>
      )}
    </div>
  )
}
