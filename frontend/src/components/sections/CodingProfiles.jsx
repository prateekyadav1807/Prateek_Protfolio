import { motion } from 'framer-motion'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { SiLeetcode, SiGeeksforgeeks, SiGithub } from 'react-icons/si'
import { codingProfiles } from '../../data/portfolio'

const icons = {
  LeetCode: <SiLeetcode size={22} />,
  GeeksforGeeks: <SiGeeksforgeeks size={22} />,
  GitHub: <SiGithub size={22} />,
}

export default function CodingProfiles() {
  return (
    <section id="coding" className="section-pad" style={{ borderTop: '1px solid var(--border-s)' }}>
      <div className="wrap">
        <motion.span
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="tag"
        >
          Coding Profiles
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="heading mb-2"
        >
          Find me online
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm text-neutral-500 mb-10"
        >
          My presence across coding and development platforms
        </motion.p>

        <div className="grid sm:grid-cols-3 gap-4">
          {codingProfiles.map((p, i) => (
            <motion.a
              key={p.platform}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="card hover:border-yellow-500/40 transition-all duration-300 group block"
            >
              <div className="flex items-start justify-between mb-4">
                <span style={{ color: p.color }}>{icons[p.platform]}</span>
                <FaExternalLinkAlt size={12} className="text-neutral-600 group-hover:text-yellow-400 transition-colors" />
              </div>
              <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{p.platform}</p>
              <p className="text-yellow-400 font-mono font-bold text-sm mb-1">{p.stat}</p>
              <p className="text-xs text-neutral-500">{p.detail}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
