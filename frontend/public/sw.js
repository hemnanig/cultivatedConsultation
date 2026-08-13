/**
 * Minimal hand-written service worker — no build-time precache manifest
 * (that would need a bundler plugin like vite-plugin-pwa, which this
 * project doesn't have installed and which this sandbox couldn't verify
 * end-to-end anyway). Instead: runtime caching for the app shell/static
 * assets, always-network for the API, plus the two things that actually
 * require a service worker — Web Push and its notification click handler.
 *
 * Bump CACHE_NAME whenever this file's caching strategy changes so old
 * clients don't get stuck on a stale cache.
 */
const CACHE_NAME = 'cc-shell-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  // Never cache the API — every response here is per-user, session-cookie
  // gated, and needs to be fresh (posts, notifications, messages, etc.).
  if (url.pathname.startsWith('/api/')) return

  if (request.mode === 'navigate') {
    // Network-first for page loads so a refresh always gets the latest
    // build; fall back to the cached shell only when actually offline —
    // this keeps the SPA-refresh routing (see SpaWebConfig) working online.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    )
    return
  }

  // Cache-first for static assets (hashed JS/CSS/fonts/images) — safe
  // because Vite content-hashes filenames, so a stale cache entry just
  // means an old build's asset, never a wrong one.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
    )
  )
})

self.addEventListener('push', (event) => {
  if (!event.data) return
  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'Cultivated Consultation', body: event.data.text() }
  }

  const title = payload.title || 'Cultivated Consultation'
  const options = {
    body: payload.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    data: { url: payload.url || '/' },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        const clientUrl = new URL(client.url)
        if (clientUrl.origin === self.location.origin && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      return self.clients.openWindow(url)
    })
  )
})
