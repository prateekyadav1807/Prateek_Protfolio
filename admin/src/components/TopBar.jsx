import { HiMenuAlt2, HiSun, HiMoon } from 'react-icons/hi'
import { useEffect, useState } from 'react'

export default function TopBar({ onMenuClick }) {
  const [isDark, setIsDark] = useState(true)

  // Sync with html class on mount
  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains('light'))
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    if (isDark) {
      html.classList.add('light')
      setIsDark(false)
    } else {
      html.classList.remove('light')
      setIsDark(true)
    }
  }

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 h-14 flex-shrink-0"
      style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        style={{ color: 'var(--text-m)' }}
        aria-label="Open sidebar"
      >
        <HiMenuAlt2 size={20} />
      </button>

      <div className="hidden lg:block" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          style={{ color: 'var(--text-m)' }}
          aria-label="Toggle theme"
        >
          {isDark ? <HiSun size={17} /> : <HiMoon size={17} />}
        </button>

        <a
          href={import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
          style={{ border: '1px solid var(--border)', color: 'var(--text-m)' }}
        >
          View Site ↗
        </a>
      </div>
    </header>
  )
}
