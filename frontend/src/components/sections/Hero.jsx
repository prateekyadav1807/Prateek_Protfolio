import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiDownload, HiArrowDown, HiEye } from 'react-icons/hi'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { api } from '../../api/portfolio.js'
import { useTypewriter } from '../../hooks/useTypewriter'
import ResumeModal from '../ResumeModal'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
})

const FALLBACK_ROLES = ['Full Stack Developer', 'React Developer', 'MERN Stack Dev', 'Problem Solver']

export default function Hero() {
  const { portfolio } = usePortfolio()
  const hero = portfolio.hero || {}

  const roles = Array.isArray(hero.roles) && hero.roles.length > 0
    ? hero.roles
    : FALLBACK_ROLES

  const [showResume, setShowResume] = useState(false)
  const typed = useTypewriter(roles)

  const handleResumeDownload = () => {
    // Track resume download (fire-and-forget)
    api.trackResumeDownload().catch(() => {})
  }

  return (
    <section id="home" className="min-h-screen flex items-center section-pad">
      <div className="wrap w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

          {/* Left */}
          <div className="flex-1 w-full">
            {/* Open to work badge */}
            <motion.div {...fade(0)} className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
              </span>
              <span className="text-xs font-mono text-green-400 tracking-wide">
                Open to Internships &amp; Opportunities
              </span>
            </motion.div>

            <motion.h1
              {...fade(0.1)}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-3 leading-[1.08] tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              {hero.name?.split(' ')[0] || 'Prateek'}<br />
              <span className="text-yellow-400">{hero.name?.split(' ').slice(1).join(' ') || 'Yadav'}.</span>
            </motion.h1>

            {/* Typewriter */}
            <motion.p {...fade(0.15)} className="text-sm font-mono mb-5 h-5" style={{ color: 'var(--text-m)' }}>
              {typed}<span className="animate-pulse text-yellow-400">|</span>
            </motion.p>

            <motion.p {...fade(0.2)} className="text-neutral-400 text-base max-w-xl mb-8 leading-relaxed">
              {hero.tagline}
            </motion.p>

            {/* CTA buttons */}
            <motion.div {...fade(0.3)} className="flex flex-wrap gap-3 mb-10">
              <a
                href={hero.resumeUrl || '/resume.pdf'}
                download
                onClick={handleResumeDownload}
                className="btn-yellow"
              >
                <HiDownload size={15} /> Resume
              </a>
              <button onClick={() => setShowResume(true)} className="btn-ghost">
                <HiEye size={15} /> View Resume
              </button>
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-ghost"
              >
                View Projects
              </button>
              {hero.github && (
                <a href={hero.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <FaGithub size={15} /> GitHub
                </a>
              )}
              {hero.linkedin && (
                <a href={hero.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <FaLinkedin size={15} /> LinkedIn
                </a>
              )}
            </motion.div>

            {/* Stats */}
            {hero.stats?.length > 0 && (
              <motion.div {...fade(0.4)} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {hero.stats.map((s, i) => (
                  <div key={i} className="card py-3 px-4 text-center">
                    <p className="text-yellow-400 font-extrabold text-lg font-mono leading-none mb-1">
                      {s.value}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-m)' }}>{s.label}</p>
                  </div>
                ))}
              </motion.div>
            )}

            <motion.div {...fade(0.5)} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-d)' }}>
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
                <HiArrowDown size={15} />
              </motion.div>
              scroll down
            </motion.div>
          </div>

          {/* Right — photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex-shrink-0"
          >
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
              <img
                src={hero.photo || '/photo.jpeg'}
                alt={hero.name || 'Prateek Yadav'}
                className="w-full h-full object-cover rounded-full"
                style={{ border: '3px solid #eab308' }}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              {/* Fallback initials */}
              <div
                className="absolute inset-0 rounded-full items-center justify-center text-5xl font-extrabold text-yellow-400 hidden"
                style={{ background: 'var(--bg-card)', border: '3px solid #eab308' }}
              >
                {hero.name?.split(' ').map(n => n[0]).join('') || 'PY'}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {showResume && (
        <ResumeModal
          src={hero.resumeUrl || '/resume.pdf'}
          onClose={() => setShowResume(false)}
        />
      )}
    </section>
  )
}
