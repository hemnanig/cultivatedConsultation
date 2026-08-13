import { api } from '../api.js'

/** Web Push VAPID keys are base64url — pushManager.subscribe wants a Uint8Array. */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
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

  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  })

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
