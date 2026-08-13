import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { api, setUnauthorizedHandler } from './api.js'
import Login from './pages/Login.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import Pending from './pages/Pending.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Directory from './pages/Directory.jsx'
import Profile from './pages/Profile.jsx'
import Admin from './pages/Admin.jsx'
import Groups from './pages/Groups.jsx'
import GroupDetail from './pages/GroupDetail.jsx'
import Messages from './pages/Messages.jsx'
import MessageThread from './pages/MessageThread.jsx'
import Notifications from './pages/Notifications.jsx'
import Opportunities from './pages/Opportunities.jsx'
import PublicDirectory from './pages/PublicDirectory.jsx'
import Faq from './pages/Faq.jsx'
import Contact from './pages/Contact.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import { Spinner } from './components/ui.jsx'

export default function App() {
  const [me, setMe] = useState(undefined) // undefined = loading, null = signed out
  const [loadError, setLoadError] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    refreshMe()

    // A 401 from any API call, anywhere in the app — not just this initial
    // check — means the session died server-side (timeout, or the backend
    // restarted and lost its in-memory... well, JDBC-backed sessions now, but
    // still: expired/invalid either way). Without this, a page rendered from
    // state fetched before the session died looks completely normal and lets
    // you click around, but every write 401s silently. Only flag it as an
    // actual "session expired" notice if they were previously signed in —
    // a signed-out visitor's first /api/me check also 401s and that's normal.
    setUnauthorizedHandler(() => {
      setMe((prev) => {
        if (prev) setSessionExpired(true)
        return null
      })
    })
  }, [])

  async function refreshMe() {
    try {
      const user = await api.me()
      setMe(user)
    } catch (err) {
      if (err.status === 401) {
        setMe(null)
      } else {
        setLoadError(err.message)
      }
    }
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-center text-stone-600">
        Something went wrong talking to the server: {loadError}
      </div>
    )
  }

  if (me === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <Spinner label="Loading…" />
      </div>
    )
  }

  function onSignedOut() {
    setMe(null)
  }

  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback onSignedIn={refreshMe} />} />
      {/* Works signed out — the one page anonymous visitors can reach. */}
      <Route path="/public-directory" element={<PublicDirectory me={me || null} />} />
      {!me && <Route path="*" element={<Login sessionExpired={sessionExpired} />} />}
      {me && me.membershipStatus !== 'APPROVED' && <Route path="*" element={<Pending me={me} onSignedOut={onSignedOut} />} />}
      {me && me.membershipStatus === 'APPROVED' && (
        <>
          <Route path="/" element={<Home me={me} onSignedOut={onSignedOut} />} />
          <Route path="/directory" element={<Directory me={me} onSignedOut={onSignedOut} />} />
          <Route path="/groups" element={<Groups me={me} onSignedOut={onSignedOut} />} />
          <Route path="/groups/:groupId" element={<GroupDetail me={me} onSignedOut={onSignedOut} />} />
          <Route path="/messages" element={<Messages me={me} onSignedOut={onSignedOut} />} />
          <Route path="/messages/:userId" element={<MessageThread me={me} onSignedOut={onSignedOut} />} />
          <Route path="/notifications" element={<Notifications me={me} onSignedOut={onSignedOut} />} />
          <Route path="/opportunities" element={<Opportunities me={me} onSignedOut={onSignedOut} />} />
          <Route path="/about" element={<About me={me} onSignedOut={onSignedOut} />} />
          <Route path="/faq" element={<Faq me={me} onSignedOut={onSignedOut} />} />
          <Route path="/contact" element={<Contact me={me} onSignedOut={onSignedOut} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy me={me} onSignedOut={onSignedOut} />} />
          <Route path="/terms-of-service" element={<TermsOfService me={me} onSignedOut={onSignedOut} />} />
          <Route path="/profile" element={<Profile me={me} onUpdated={refreshMe} onSignedOut={onSignedOut} />} />
          <Route path="/admin" element={<Admin me={me} onSignedOut={onSignedOut} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  )
}
