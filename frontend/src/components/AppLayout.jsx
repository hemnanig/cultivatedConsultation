import Topbar from './Topbar.jsx'
import BottomNav from './BottomNav.jsx'

/**
 * Shared shell for every authenticated screen: a fixed horizontal top bar on
 * desktop (md+, LinkedIn-style), a fixed bottom tab bar on mobile, and a
 * content area that reserves space for whichever one is showing.
 */
export default function AppLayout({ me, onSignedOut, children }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <Topbar me={me} onSignedOut={onSignedOut} />
      <div className="pb-16 md:pb-0 md:pt-14">{children}</div>
      <BottomNav me={me} onSignedOut={onSignedOut} />
    </div>
  )
}
