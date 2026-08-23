import { motion } from 'framer-motion'
import { usePortfolio } from '../../context/PortfolioContext.jsx'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

// Parse highlight strings — if they start with an emoji, split it out
function parseHighlight(text) {
  // Match leading emoji(s)
  const match = text.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s*/u)
  if (match) {
    return { icon: match[0].trim(), text: text.slice(match[0].length) }
  }
  return { icon: '→', text }
}

export default function About() {
  const { portfolio } = usePortfolio()
  const about     = portfolio.about     || {}
  const education = portfolio.education || []

  const highlights = about.highlights?.length
    ? about.highlights
    : [
        '🎓 B.Tech Computer Science, KIET (2023–2027)',
        '⚡ Full Stack Developer — MERN Stack',
        '🧩 300+ DSA problems on LeetCode & GFG',
        '🚀 Passionate about scalable, user-friendly apps',
      ]

  const learningTags = about.learning?.length
    ? about.learning
    : ['Full Stack Development', 'Cloud (AWS)', 'DSA', 'System Design']

  return (
    <section id="about" className="section-pad" style={{ borderTop: '1px solid var(--border-s)' }}>
      <div className="wrap">
        <motion.span {...fadeUp()} className="tag">About me</motion.span>
        <motion.h2 {...fadeUp(0.05)} className="heading mb-10">Who I am</motion.h2>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Left — bio + highlights */}
          <motion.div {...fadeUp(0.1)}>
            {about.bio && (
              <p className="text-neutral-400 leading-relaxed mb-8 text-base">{about.bio}</p>
            )}
            <div className="space-y-3">
              {highlights.map((h, i) => {
                const { icon, text } = parseHighlight(h)
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-lg w-7 flex-shrink-0">{icon}</span>
                    <span className="text-sm text-neutral-400">{text}</span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Right — education + focus tags */}
          <motion.div {...fadeUp(0.15)} className="space-y-4">
            {education.length > 0 && (
              <>
                <p className="text-xs font-mono uppercase tracking-widest mb-2"
                  style={{ color: 'var(--text-d)' }}>Education</p>

                {education.map((edu, i) => (
                  <div key={edu._id || i} className="card">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="font-semibold" style={{ color: 'var(--text)' }}>
                        {edu.degree}
                      </h3>
                      {edu.score && (
                        <span className="text-yellow-400 font-mono text-sm flex-shrink-0 font-bold">
                          {edu.score}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-500 text-sm mb-3">{edu.institution}</p>
                    <div className="flex items-center justify-between text-xs"
                      style={{ color: 'var(--text-d)' }}>
                      <span>{edu.duration || edu.period}</span>
                      <span className="text-yellow-500 font-medium">In Progress</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="card">
              <p className="text-xs font-mono uppercase tracking-widest mb-3"
                style={{ color: 'var(--text-d)' }}>Currently focused on</p>
              <div className="flex flex-wrap gap-2">
                {learningTags.map(t => (
                  <span key={t} className="pill">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
