import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiSun, HiMoon } from 'react-icons/hi'
import { useScrollSpy } from '../hooks/useScrollSpy'

const LINKS = [
  { id: 'home',         label: 'Home' },
  { id: 'about',        label: 'About' },
  { id: 'skills',       label: 'Skills' },
  { id: 'projects',     label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'coding',       label: 'Coding' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact',      label: 'Contact' },
]

export default function Navbar({ isDark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const active = useScrollSpy(LINKS.map(l => l.id))

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const go = (id) => {
    setOpen(false)
    // Small delay so menu closes before scrolling
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          background:   scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
        }}
      >
        <div className="wrap flex items-center justify-between h-14 px-4 sm:px-6">

          {/* Logo */}
          <button
            onClick={() => go('home')}
            className="font-mono font-bold text-lg z-10"
            style={{ color: 'var(--text)' }}
          >
            P<span className="text-yellow-400">Y</span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  active === id
                    ? 'text-yellow-400'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-neutral-400 hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <HiSun size={17} /> : <HiMoon size={17} />}
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <HiX size={22} /> : <HiMenu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu — rendered as a full-screen overlay outside the nav
          so it's never clipped by overflow:hidden or z-index issues */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              key="menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 z-50 md:hidden w-64 flex flex-col"
              style={{
                background: 'var(--bg-card)',
                borderLeft: '1px solid var(--border)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 h-14 flex-shrink-0"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <span className="font-mono font-bold text-lg" style={{ color: 'var(--text)' }}>
                  P<span className="text-yellow-400">Y</span>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-md text-neutral-400 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <HiX size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                {LINKS.map(({ id, label }, i) => (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => go(id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-colors ${
                      active === id
                        ? 'text-yellow-400 bg-yellow-400/10'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {label}
                  </motion.button>
                ))}
              </nav>

              {/* Theme toggle at bottom */}
              <div
                className="px-5 py-4 flex-shrink-0"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  {isDark ? <HiSun size={16} /> : <HiMoon size={16} />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
