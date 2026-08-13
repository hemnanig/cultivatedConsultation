import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { isPushSupported, getPushSubscription, subscribeToPush, unsubscribeFromPush } from '../lib/push.js'
import { BellIcon } from './icons.jsx'

/**
 * Push opt-in card for the Profile page. Three states: unsupported browser
 * (hidden), server has no VAPID key configured (hidden — nothing to offer),
 * or a normal enable/disable toggle. Deliberately quiet about the middle
 * case rather than showing a broken toggle — see PushSubscriptionController's
 * /vapid-public-key, which returns "" when unconfigured.
 */
export default function PushNotificationSettings() {
  const [status, setStatus] = useState('checking') // checking | unavailable | off | on
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    check()
  }, [])

  async function check() {
    if (!isPushSupported()) {
      setStatus('unavailable')
      return
    }
    try {
      const { publicKey } = await api.vapidPublicKey()
      if (!publicKey) {
        setStatus('unavailable')
        return
      }
      const existing = await getPushSubscription()
      setStatus(existing ? 'on' : 'off')
    } catch {
      setStatus('unavailable')
    }
  }

  async function enable() {
    setBusy(true)
    setError(null)
    try {
      await subscribeToPush()
      setStatus('on')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function disable() {
    setBusy(true)
    setError(null)
    try {
      await unsubscribeFromPush()
      setStatus('off')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (status === 'checking' || status === 'unavailable') return null

  return (
    <div className="cc-card flex items-center justify-between gap-4 p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <BellIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-stone-900">Push notifications</p>
          <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
            Get a notification on this device for replies, new messages, membership decisions, and
            community announcements — even when the app isn't open.
          </p>
          {error && <p className="mt-1 text-xs text-status-denied">{error}</p>}
        </div>
      </div>
      {status === 'on' ? (
        <button className="cc-btn-secondary cc-btn-sm shrink-0" onClick={disable} disabled={busy}>
          {busy ? 'Turning off…' : 'Turn off'}
        </button>
      ) : (
        <button className="cc-btn cc-btn-sm shrink-0" onClick={enable} disabled={busy}>
          {busy ? 'Enabling…' : 'Enable'}
        </button>
      )}
    </div>
  )
}
