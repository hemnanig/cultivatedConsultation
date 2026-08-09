import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

/**
 * The backend redirects here right after a successful Google login
 * (see app.frontend-base-url + OAuth2LoginSuccessHandler). We just need
 * to trigger one more /api/me fetch and then fall through to "/".
 */
export default function AuthCallback({ onSignedIn }) {
  useEffect(() => {
    onSignedIn()
  }, [onSignedIn])

  return <Navigate to="/" replace />
}
