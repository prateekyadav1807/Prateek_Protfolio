import { motion } from 'framer-motion'
import { usePortfolio } from '../../context/PortfolioContext.jsx'

// Default icon map for categories that have no icon stored in DB
const CATEGORY_ICONS = {
  'Frontend':      '🖥️',
  'Backend':       '⚙️',
  'Database':      '🗄️',
  'Cloud & Tools': '☁️',
  'Languages':     '{ }',
  'Core CS':       '📐',
  'DevOps':        '🔧',
  'Other':         '🔩',
}

export default function Skills() {
  const { portfolio } = usePortfolio()
  const skills = portfolio.skills || []

  // Group flat skill documents by category
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  // Fallback static groups if DB is empty
  const FALLBACK_GROUPS = [
    { category: 'Frontend',      items: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'] },
    { category: 'Backend',       items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth'] },
    { category: 'Database',      items: ['MongoDB', 'MySQL'] },
    { category: 'Cloud & Tools', items: ['Git', 'GitHub', 'Vercel', 'Postman', 'AWS'] },
    { category: 'Languages',     items: ['C++', 'JavaScript', 'Python', 'C'] },
    { category: 'Core CS',       items: ['DSA', 'OOP', 'DBMS', 'Operating Systems'] },
  ]

  const hasDbSkills = skills.length > 0

  return (
    <section id="skills" className="section-pad" style={{ borderTop: '1px solid var(--border-s)' }}>
      <div className="wrap">
        <motion.span
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="tag"
        >
          Skills
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="heading mb-2"
        >
          What I work with
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm text-neutral-500 mb-10"
        >
          Technologies and tools I use to build products
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hasDbSkills
            ? Object.entries(grouped).map(([category, items], gi) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.07 }}
                  className="card hover:border-yellow-500/40 transition-colors duration-300"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-base">{CATEGORY_ICONS[category] || '🔹'}</span>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{category}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map(skill => (
                      <span key={skill._id} className="pill">
                        {skill.icon && <span className="mr-1">{skill.icon}</span>}
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))
            : FALLBACK_GROUPS.map((group, gi) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.07 }}
                  className="card hover:border-yellow-500/40 transition-colors duration-300"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-base">{CATEGORY_ICONS[group.category]}</span>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{group.category}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map(skill => (
                      <span key={skill} className="pill">{skill}</span>
                    ))}
                  </div>
                </motion.div>
              ))
          }
        </div>
      </div>
    </section>
  )
}
