import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiSun, HiMoon } from 'react-icons/hi'
import { useScrollSpy } from '../hooks/useScrollSpy'

const LINKS = ['home', 'about', 'skills', 'projects', 'achievements', 'coding', 'certifications', 'contact']

export default function Navbar({ isDark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(LINKS)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent', background: scrolled ? 'var(--nav-bg)' : 'transparent', backdropFilter: scrolled ? 'blur(10px)' : 'none' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="wrap flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
        <button onClick={() => go('home')} className="font-mono font-bold text-lg" style={{ color: 'var(--text)' }}>
          <span style={{ color: 'var(--text)' }}>P</span><span className="text-yellow-400">Y</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <button
              key={l}
              onClick={() => go(l)}
              className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${
                active === l ? 'text-yellow-400' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-neutral-400 hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <HiSun size={17} /> : <HiMoon size={17} />}
          </button>
          <button
            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <HiX size={20} /> : <HiMenu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}
          >
            <div className="px-4 py-2 flex flex-col">
              {LINKS.map(l => (
                <button
                  key={l}
                  onClick={() => go(l)}
                  className={`px-3 py-2.5 text-sm capitalize text-left rounded-md transition-colors ${
                    active === l ? 'text-yellow-400' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
