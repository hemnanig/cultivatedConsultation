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
  logout: () => request('/api/logout', { method: 'POST' }),
  updateMe: (fields) => request('/api/me', { method: 'PATCH', body: JSON.stringify(fields) }),
  submitCredential: (licenseNumber, licenseState) =>
    request('/api/me/credential', { method: 'PATCH', body: JSON.stringify({ licenseNumber, licenseState }) }),
  listPosts: () => request('/api/posts'),
  createPost: (content, anonymous = false) =>
    request('/api/posts', { method: 'POST', body: JSON.stringify({ content, anonymous }) }),
  createReply: (postId, content) =>
    request(`/api/posts/${postId}/replies`, { method: 'POST', body: JSON.stringify({ content }) }),
  listMembers: (specialty) =>
    request(`/api/members${specialty ? `?specialty=${encodeURIComponent(specialty)}` : ''}`),
  pendingUsers: () => request('/api/admin/users/pending'),
  approveUser: (userId) => request(`/api/admin/users/${userId}/approve`, { method: 'POST' }),
  denyUser: (userId) => request(`/api/admin/users/${userId}/deny`, { method: 'POST' }),
  pendingCredentials: () => request('/api/admin/users/credentials/pending'),
  verifyCredential: (userId) => request(`/api/admin/users/${userId}/credential/verify`, { method: 'POST' }),
  rejectCredential: (userId) => request(`/api/admin/users/${userId}/credential/reject`, { method: 'POST' }),

  // Groups of Interest
  listGroups: () => request('/api/groups'),
  createGroup: (name, description) =>
    request('/api/groups', { method: 'POST', body: JSON.stringify({ name, description }) }),
  getGroup: (groupId) => request(`/api/groups/${groupId}`),
  listGroupMembers: (groupId) => request(`/api/groups/${groupId}/members`),
  addGroupMember: (groupId, memberId) =>
    request(`/api/groups/${groupId}/members`, { method: 'POST', body: JSON.stringify({ memberId }) }),
  removeGroupMember: (groupId, memberId) =>
    request(`/api/groups/${groupId}/members/${memberId}`, { method: 'DELETE' }),
  listGroupPosts: (groupId) => request(`/api/groups/${groupId}/posts`),
  createGroupPost: (groupId, content) =>
    request(`/api/groups/${groupId}/posts`, { method: 'POST', body: JSON.stringify({ content }) }),
  createGroupReply: (groupId, postId, content) =>
    request(`/api/groups/${groupId}/posts/${postId}/replies`, { method: 'POST', body: JSON.stringify({ content }) }),

  // Direct messaging
  listConversations: () => request('/api/messages/conversations'),
  getThread: (userId) => request(`/api/messages/with/${userId}`),
  sendMessage: (recipientId, content) =>
    request('/api/messages', { method: 'POST', body: JSON.stringify({ recipientId, content }) }),

  // Notifications
  listNotifications: () => request('/api/notifications'),
  unreadNotificationCount: () => request('/api/notifications/unread-count'),
  markNotificationRead: (id) => request(`/api/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () => request('/api/notifications/read-all', { method: 'POST' }),

  // Admin community announcements
  listAnnouncements: () => request('/api/announcements'),
  createAnnouncement: (message) =>
    request('/api/announcements', { method: 'POST', body: JSON.stringify({ message }) }),
  deleteAnnouncement: (id) => request(`/api/announcements/${id}`, { method: 'DELETE' }),

  // Opportunities & offerings board
  listOpportunities: () => request('/api/opportunities'),
  createOpportunity: (type, title, description) =>
    request('/api/opportunities', { method: 'POST', body: JSON.stringify({ type, title, description }) }),
  deleteOpportunity: (id) => request(`/api/opportunities/${id}`, { method: 'DELETE' }),

  // Public opt-in directory — unauthenticated, but the wrapper's credentials:
  // 'include' is harmless here since the endpoint doesn't require a session.
  publicDirectory: () => request('/api/public/directory'),

  // Web push
  vapidPublicKey: () => request('/api/push/vapid-public-key'),
  subscribePush: (subscription) =>
    request('/api/push/subscriptions', { method: 'POST', body: JSON.stringify(subscription) }),
  unsubscribePush: (endpoint) =>
    request('/api/push/unsubscribe', { method: 'POST', body: JSON.stringify({ endpoint }) })
}

export function googleLoginUrl() {
  return `${API_BASE_URL}/oauth2/authorization/google`
}
