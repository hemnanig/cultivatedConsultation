import Sidebar from './Sidebar.jsx'
import BottomNav from './BottomNav.jsx'

/**
 * Shared shell for every authenticated screen: a fixed left sidebar on
 * desktop (md+), a fixed bottom tab bar on mobile, and a content area that
 * reserves space for whichever one is showing.
 */
export default function AppLayout({ me, onSignedOut, children }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <Sidebar me={me} onSignedOut={onSignedOut} />
      <div className="pb-16 md:ml-64 md:pb-0">{children}</div>
      <BottomNav me={me} onSignedOut={onSignedOut} />
    </div>
  )
}
