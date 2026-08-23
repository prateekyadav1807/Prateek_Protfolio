import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa'
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiTailwindcss, SiJavascript, SiHtml5, SiCss } from 'react-icons/si'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { api } from '../../api/portfolio.js'

const TECH_ICONS = {
  'React':        <SiReact     size={13} className="text-cyan-400" />,
  'React.js':     <SiReact     size={13} className="text-cyan-400" />,
  'Node.js':      <SiNodedotjs size={13} className="text-green-500" />,
  'MongoDB':      <SiMongodb   size={13} className="text-green-400" />,
  'Express.js':   <SiExpress   size={13} />,
  'Tailwind CSS': <SiTailwindcss size={13} className="text-cyan-300" />,
  'JavaScript':   <SiJavascript size={13} className="text-yellow-400" />,
  'HTML':         <SiHtml5     size={13} className="text-orange-400" />,
  'CSS':          <SiCss       size={13} className="text-blue-400" />,
}

// Static fallback projects shown when DB is empty
const FALLBACK_PROJECTS = [
  {
    _id: 'fb1', title: 'E-Commerce Platform', icon: '🛒',
    description: 'A full-featured e-commerce platform with role-based access control and admin dashboard.',
    longDesc: 'Production-ready e-commerce built with MERN. Features JWT auth, role-based authorization, admin dashboard, and order management.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express.js'],
    features: ['JWT authentication', 'Admin dashboard', 'Product management', 'Order management'],
    github: 'https://github.com/prateekyadav1807', demo: '#',
  },
  {
    _id: 'fb2', title: 'Expense Tracker', icon: '💰',
    description: 'A full-stack expense tracking app with dashboard analytics and responsive design.',
    longDesc: 'MERN stack expense tracker with analytics, category filtering, and date-based reports.',
    tech: ['React', 'Node.js', 'MongoDB'],
    features: ['User authentication', 'Expense management', 'Dashboard analytics', 'Category filtering'],
    github: 'https://github.com/prateekyadav1807', demo: '#',
  },
  {
    _id: 'fb3', title: 'Task Management App', icon: '✅',
    description: 'Full-stack task management with personalized dashboards and image upload support.',
    longDesc: 'MERN + Tailwind task manager with full CRUD, priority filtering, and profile management.',
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Tailwind CSS'],
    features: ['JWT authentication', 'Full CRUD', 'Priority filtering', 'Image uploads'],
    github: 'https://github.com/prateekyadav1807', demo: '#',
  },
]

function Modal({ project, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.25 }}
          className="card max-w-md w-full max-h-[85vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {project.image
                ? <img src={project.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                : <span className="text-2xl">{project.icon || '🚀'}</span>
              }
              <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{project.title}</h3>
            </div>
            <button onClick={onClose} className="text-neutral-500 hover:text-yellow-400 transition-colors">
              <FaTimes size={15} />
            </button>
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed mb-5">
            {project.longDesc || project.description}
          </p>

          {project.features?.length > 0 && (
            <>
              <p className="text-xs font-mono uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-d)' }}>Features</p>
              <ul className="space-y-1.5 mb-5">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-400">
                    <span className="text-yellow-400 mt-0.5 flex-shrink-0">—</span>{f}
                  </li>
                ))}
              </ul>
            </>
          )}

          {project.tech?.length > 0 && (
            <>
              <p className="text-xs font-mono uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-d)' }}>Stack</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map(t => <span key={t} className="pill">{t}</span>)}
              </div>
            </>
          )}

          <div className="flex gap-3">
            {project.demo && project.demo !== '#' && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="btn-yellow flex-1 justify-center text-xs">
                <FaExternalLinkAlt size={11} /> Live Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="btn-ghost flex-1 justify-center text-xs">
                <FaGithub size={13} /> GitHub
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Projects() {
  const { portfolio } = usePortfolio()
  const [selected, setSelected] = useState(null)

  const projects = portfolio.projects?.length > 0
    ? portfolio.projects
    : FALLBACK_PROJECTS

  const handleSelect = (p) => {
    setSelected(p)
    // Track project view (fire-and-forget, only for real DB docs)
    if (p._id && !p._id.startsWith('fb')) {
      api.trackProjectView(p._id).catch(() => {})
    }
  }

  return (
    <section id="projects" className="section-pad" style={{ borderTop: '1px solid var(--border-s)' }}>
      <div className="wrap">
        <motion.span
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="tag"
        >
          Projects
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="heading mb-2"
        >
          Things I've built
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm text-neutral-500 mb-10"
        >
          A selection of projects — click any card for details
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <motion.div
              key={p._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleSelect(p)}
              className="card cursor-pointer hover:border-yellow-500/40 transition-all duration-300 flex flex-col group"
            >
              {/* Project image or icon */}
              {p.image ? (
                <div className="w-full h-36 mb-4 rounded-lg overflow-hidden"
                  style={{ border: '1px solid var(--border)' }}>
                  <img src={p.image} alt={p.title}
                    className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{p.icon || '🚀'}</span>
                  {p.featured && <span className="text-yellow-400 text-xs">⭐ Featured</span>}
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div />
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => e.stopPropagation()}>
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-yellow-400 transition-colors p-1">
                      <FaGithub size={15} />
                    </a>
                  )}
                  {p.demo && p.demo !== '#' && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-yellow-400 transition-colors p-1">
                      <FaExternalLinkAlt size={13} />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>{p.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed mb-4 flex-1">{p.description}</p>

              {p.tech?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.map(t => (
                    <span key={t} className="pill text-[11px] flex items-center gap-1">
                      {TECH_ICONS[t] || null}{t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
