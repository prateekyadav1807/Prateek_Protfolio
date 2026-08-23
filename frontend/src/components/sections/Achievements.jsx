import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { usePortfolio } from '../../context/PortfolioContext.jsx'

// Fallbacks used when DB has no achievements yet
const FALLBACK_STATS = [
  { value: '300+', label: 'DSA Problems Solved' },
  { value: '1470', label: 'LeetCode Rating' },
  { value: '5+',   label: 'Projects Built' },
  { value: '82.55%', label: 'Academic Score' },
]

const FALLBACK_CARDS = [
  { icon: '💻', title: '300+ DSA Problems', desc: 'Solved on LeetCode & GeeksforGeeks' },
  { icon: '🚀', title: '5+ Projects',       desc: 'Full Stack applications built & deployed' },
  { icon: '📚', title: 'B.Tech CS',         desc: 'KIET Group of Institutions, 82.55%' },
]

function Counter({ target }) {
  const [display, setDisplay] = useState('0')
  const ref  = useRef(null)
  const done = useRef(false)

  useEffect(() => {
    const raw = String(target).replace(/[^0-9.]/g, '')
    if (!raw) { setDisplay(target); return }

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const n    = parseFloat(raw)
        const step = n / 40
        let cur    = 0
        const t = setInterval(() => {
          cur += step
          if (cur >= n) {
            setDisplay(n % 1 === 0 ? String(n) : n.toFixed(2))
            clearInterval(t)
          } else {
            setDisplay(String(Math.floor(cur)))
          }
        }, 30)
      }
    }, { threshold: 0.5 })

    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  const suffix = String(target).includes('+')
    ? '+'
    : String(target).includes('%')
      ? '%'
      : ''

  return <span ref={ref}>{display}{suffix}</span>
}

export default function Achievements() {
  const { portfolio } = usePortfolio()
  const achievements = portfolio.achievements || []

  // Achievements with a `value` field become stat counters
  const statItems  = achievements.filter(a => a.value)
  const cardItems  = achievements.filter(a => a.title)

  const displayStats = statItems.length > 0 ? statItems : FALLBACK_STATS
  const displayCards = cardItems.length  > 0 ? cardItems : FALLBACK_CARDS

  return (
    <section id="achievements" className="section-pad" style={{ borderTop: '1px solid var(--border-s)' }}>
      <div className="wrap">
        <motion.span
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="tag"
        >
          Achievements
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="heading mb-2"
        >
          By the numbers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm text-neutral-500 mb-10"
        >
          Milestones from my journey so far
        </motion.p>

        {/* Stat counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {displayStats.map((a, i) => (
            <motion.div
              key={a._id || a.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card text-center"
            >
              <p className="text-2xl font-extrabold text-yellow-400 font-mono mb-1">
                <Counter target={a.value} />
              </p>
              <p className="text-xs" style={{ color: 'var(--text-m)' }}>{a.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Achievement cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayCards.map((a, i) => (
            <motion.div
              key={a._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="card hover:border-yellow-500/40 transition-colors duration-300 flex items-start gap-4"
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{a.icon || '🏆'}</span>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{a.title}</p>
                <p className="text-xs text-neutral-500">{a.description || a.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
