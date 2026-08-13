import { useEffect, useState } from 'react'

const STORAGE_KEY = 'cc-theme'

/** Mirrors the inline bootstrap script in index.html — keep the two in sync. */
export function getInitialTheme() {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  window.localStorage.setItem(STORAGE_KEY, theme)
}

/** Shared by every place that needs to read or flip the theme (Topbar, MoreSheet). */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return [theme, toggleTheme]
}
