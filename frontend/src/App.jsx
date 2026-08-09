import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { api } from './api.js'
import Login from './pages/Login.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import Pending from './pages/Pending.jsx'
import Feed from './pages/Feed.jsx'

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
    return <div className="page-centered">Something went wrong talking to the server: {loadError}</div>
  }

  if (me === undefined) {
    return <div className="page-centered">Loading…</div>
  }

  return (
    <Routes>
      <Route path="/" element={me ? <Gate me={me} /> : <Login />} />
      <Route path="/auth/callback" element={<AuthCallback onSignedIn={refreshMe} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function Gate({ me }) {
  if (me.membershipStatus === 'APPROVED') {
    return <Feed me={me} />
  }
  return <Pending me={me} />
}
