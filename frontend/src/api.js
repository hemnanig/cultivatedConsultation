// `??` (not `||`) on purpose: the combined-deploy Docker build sets
// VITE_API_BASE_URL="" deliberately (same-origin, relative paths). An empty
// string is falsy, so `||` would silently override it back to localhost — `??`
// only falls back when the var is genuinely unset (local dev, no .env.local).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

/**
 * Thin fetch wrapper. `credentials: 'include'` is required on every call —
 * auth is a server-side session cookie set by Spring Security's OAuth2 login,
 * not a bearer token.
 */
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  })

  if (!res.ok) {
    if (res.status === 401) {
      const err = new Error('Not signed in')
      err.status = 401
      throw err
    }
    let message = `Request failed: ${res.status}`
    try {
      const body = await res.json()
      message = body.message || message
    } catch {
      // response wasn't JSON — fall back to the generic message
    }
    const err = new Error(message)
    err.status = res.status
    throw err
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  me: () => request('/api/me'),
  listPosts: () => request('/api/posts'),
  createPost: (content) => request('/api/posts', { method: 'POST', body: JSON.stringify({ content }) }),
  createReply: (postId, content) =>
    request(`/api/posts/${postId}/replies`, { method: 'POST', body: JSON.stringify({ content }) }),
  pendingUsers: () => request('/api/admin/users/pending'),
  approveUser: (userId) => request(`/api/admin/users/${userId}/approve`, { method: 'POST' }),
  denyUser: (userId) => request(`/api/admin/users/${userId}/deny`, { method: 'POST' })
}

export function googleLoginUrl() {
  return `${API_BASE_URL}/oauth2/authorization/google`
}
