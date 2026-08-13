import { useTheme } from '../lib/theme.js'
import { SunIcon, MoonIcon } from './icons.jsx'

/**
 * Shared by the desktop Topbar "Me" menu and the mobile More sheet — same
 * row styling as their other menu items, just swap in via className.
 */
export default function ThemeToggle({ className, iconClassName = 'h-4 w-4 shrink-0' }) {
  const [theme, toggleTheme] = useTheme()
  const isDark = theme === 'dark'

  return (
    <button type="button" onClick={toggleTheme} className={className}>
      {isDark ? <SunIcon className={iconClassName} /> : <MoonIcon className={iconClassName} />}
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
