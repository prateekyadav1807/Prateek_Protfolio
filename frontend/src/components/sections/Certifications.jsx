import { motion } from 'framer-motion'
import { FaExternalLinkAlt, FaAws, FaCertificate } from 'react-icons/fa'
import { usePortfolio } from '../../context/PortfolioContext.jsx'

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    // Handle "YYYY-MM" format from month input
    const d = /^\d{4}-\d{2}$/.test(dateStr)
      ? new Date(dateStr + '-01')
      : new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

// Pick a relevant icon based on the organisation name
function CertIcon({ organization, image, name }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-12 h-12 object-contain rounded-xl"
        onError={e => { e.target.style.display = 'none' }}
      />
    )
  }
  const org = (organization || '').toLowerCase()
  if (org.includes('aws') || org.includes('amazon')) return <FaAws size={24} className="text-yellow-400" />
  return <FaCertificate size={24} className="text-yellow-400" />
}

export default function Certifications() {
  const { portfolio } = usePortfolio()
  const certifications = portfolio.certifications || []

  // Hide the section entirely when there's nothing to show
  if (certifications.length === 0) return null

  return (
    <section id="certifications" className="section-pad" style={{ borderTop: '1px solid var(--border-s)' }}>
      <div className="wrap">
        <motion.span
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="tag"
        >
          Certifications
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="heading mb-2"
        >
          Credentials
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm text-neutral-500 mb-10"
        >
          Professional certifications I've earned
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card hover:border-yellow-500/40 transition-colors duration-300"
            >
              {/* Badge */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}
              >
                <CertIcon
                  image={cert.image}
                  name={cert.name}
                  organization={cert.organization}
                />
              </div>

              <p className="font-bold mb-1" style={{ color: 'var(--text)' }}>{cert.name}</p>
              <p className="text-xs font-mono text-yellow-500 mb-1">{cert.organization}</p>
              {cert.date && (
                <p className="text-xs text-neutral-500 mb-3">{formatDate(cert.date)}</p>
              )}

              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                >
                  View Credential <FaExternalLinkAlt size={10} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
