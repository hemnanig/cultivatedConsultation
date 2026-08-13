import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { api } from './api.js'
import Login from './pages/Login.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import Pending from './pages/Pending.jsx'
import Feed from './pages/Feed.jsx'
import About from './pages/About.jsx'
import Directory from './pages/Directory.jsx'
import Profile from './pages/Profile.jsx'
import Admin from './pages/Admin.jsx'
import Groups from './pages/Groups.jsx'
import GroupDetail from './pages/GroupDetail.jsx'
import Messages from './pages/Messages.jsx'
import MessageThread from './pages/MessageThread.jsx'
import Notifications from './pages/Notifications.jsx'
import { Spinner } from './components/ui.jsx'

export default function App() {
  const [me, setMe] = useState(undefined) // undefined = loading, null = signed out
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    refreshMe()
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
      {!me && <Route path="*" element={<Login />} />}
      {me && me.membershipStatus !== 'APPROVED' && <Route path="*" element={<Pending me={me} onSignedOut={onSignedOut} />} />}
      {me && me.membershipStatus === 'APPROVED' && (
        <>
          <Route path="/" element={<Feed me={me} onSignedOut={onSignedOut} />} />
          <Route path="/directory" element={<Directory me={me} onSignedOut={onSignedOut} />} />
          <Route path="/groups" element={<Groups me={me} onSignedOut={onSignedOut} />} />
          <Route path="/groups/:groupId" element={<GroupDetail me={me} onSignedOut={onSignedOut} />} />
          <Route path="/messages" element={<Messages me={me} onSignedOut={onSignedOut} />} />
          <Route path="/messages/:userId" element={<MessageThread me={me} onSignedOut={onSignedOut} />} />
          <Route path="/notifications" element={<Notifications me={me} onSignedOut={onSignedOut} />} />
          <Route path="/about" element={<About me={me} onSignedOut={onSignedOut} />} />
          <Route path="/profile" element={<Profile me={me} onUpdated={refreshMe} onSignedOut={onSignedOut} />} />
          <Route path="/admin" element={<Admin me={me} onSignedOut={onSignedOut} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  )
}
