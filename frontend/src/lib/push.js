import { api } from '../api.js'

/**
 * Web Push VAPID keys are base64url — pushManager.subscribe wants a
 * Uint8Array. Trims first: a stray trailing newline/space on the env var
 * (easy to introduce copy-pasting into Render's dashboard, or via a shell
 * `export` that captured a newline) is invisible in the UI but makes atob()
 * throw a cryptic "invalid character" / "did not match the expected
 * pattern"-style DOMException with zero indication of why. Also validates
 * the decoded key is a well-formed uncompressed P-256 point (65 bytes,
 * starts with 0x04) so a bad key fails with a message that actually says
 * what's wrong instead of a raw browser exception.
 */
function urlBase64ToUint8Array(base64String) {
  const trimmed = (base64String || '').trim()
  const padding = '='.repeat((4 - (trimmed.length % 4)) % 4)
  const base64 = (trimmed + padding).replace(/-/g, '+').replace(/_/g, '/')

  let rawData
  try {
    rawData = atob(base64)
  } catch {
    throw new Error(
      'The server’s push public key is not valid base64url — check VAPID_PUBLIC_KEY for stray whitespace or a copy-paste error.'
    )
  }

  const bytes = Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
  if (bytes.length !== 65 || bytes[0] !== 0x04) {
    throw new Error(
      `The server’s push public key is the wrong shape (got ${bytes.length} bytes, expected 65 starting with 0x04) — regenerate VAPID keys and check VAPID_PUBLIC_KEY.`
    )
  }
  return bytes
}

/** True in any browser that could theoretically support push — doesn't mean the server has VAPID configured. */
export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

/** Null if push isn't supported, or if the server has no VAPID key configured (see PushSubscriptionController). */
export async function getPushSubscription() {
  if (!isPushSupported()) return null
  const registration = await navigator.serviceWorker.ready
  return registration.pushManager.getSubscription()
}

/**
 * Requests notification permission, subscribes via the service worker, and
 * registers the subscription with the backend. Throws if permission is
 * denied or the browser/server doesn't support push — callers should catch
 * and show a friendly message rather than a raw error.
 */
export async function subscribeToPush() {
  if (!isPushSupported()) throw new Error('Push notifications aren’t supported in this browser.')

  const { publicKey } = await api.vapidPublicKey()
  if (!publicKey) throw new Error('Push notifications aren’t configured on the server yet.')

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error('Notification permission was not granted.')

  const applicationServerKey = urlBase64ToUint8Array(publicKey)
  const registration = await navigator.serviceWorker.ready

  let subscription
  try {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })
  } catch (err) {
    // Surface the browser's own reason (permission, key format, no push
    // service available, etc.) instead of a bare "subscribe failed".
    throw new Error(`Browser rejected the push subscription: ${err.message || err.name || 'unknown reason'}`)
  }

  const json = subscription.toJSON()
  await api.subscribePush({
    endpoint: json.endpoint,
    p256dhKey: json.keys.p256dh,
    authKey: json.keys.auth,
  })

  return subscription
}

/** Unsubscribes on both ends — the browser's push manager and the backend's stored row. */
export async function unsubscribeFromPush() {
  const subscription = await getPushSubscription()
  if (!subscription) return
  const endpoint = subscription.endpoint
  await subscription.unsubscribe()
  await api.unsubscribePush(endpoint)
}
