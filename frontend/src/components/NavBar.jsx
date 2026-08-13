import { NavLink } from 'react-router-dom'
import logo from '../assets/images/CC-1024-x-1024-px.png'
import { Avatar } from './ui.jsx'

const linkClasses = ({ isActive }) =>
  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors ' +
  (isActive ? 'bg-brand-50 text-brand-700' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900')

export default function NavBar({ me }) {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2">
            <img className="h-8 w-8" src={logo} alt="Cultivated Consultation" />
            <span className="hidden font-display text-base font-semibold text-stone-900 sm:inline">
              Cultivated Consultation
            </span>
          </NavLink>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={linkClasses}>Feed</NavLink>
            <NavLink to="/directory" className={linkClasses}>Directory</NavLink>
            <NavLink to="/about" className={linkClasses}>About</NavLink>
            {me.admin && <NavLink to="/admin" className={linkClasses}>Admin</NavLink>}
          </nav>
        </div>

        <NavLink to="/profile" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-stone-100">
          <Avatar name={me.name || me.email} size="sm" />
          <span className="hidden flex-col text-left leading-tight sm:flex">
            <span className="text-sm font-medium text-stone-900">{me.name || me.email}</span>
            {me.badge && <span className="text-xs text-stone-500">{me.badge}</span>}
          </span>
        </NavLink>
      </div>
    </header>
  )
}
