import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { usePortfolio } from '../context/PortfolioContext.jsx'

export default function Footer() {
  const { portfolio } = usePortfolio()
  const contact = portfolio.contact || {}
  const hero    = portfolio.hero    || {}

  const name   = hero.name     || 'Prateek Yadav'
  const github  = contact.github   || hero.github   || 'https://github.com/prateekyadav1807'
  const linkedin = contact.linkedin || hero.linkedin || 'https://www.linkedin.com/in/prateekyadav18/'
  const email   = contact.email    || hero.email    || 'prateekyadav1807@gmail.com'

  return (
    <footer className="py-10 px-4" style={{ borderTop: '1px solid var(--border-s)' }}>
      <div className="wrap">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="font-bold text-base mb-0.5" style={{ color: 'var(--text)' }}>{name}</p>
            <p className="text-xs text-neutral-500">Full Stack Developer</p>
          </div>

          <div className="flex items-center gap-4">
            <a href={github} target="_blank" rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors" aria-label="GitHub">
              <FaGithub size={18} />
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer"
              className="text-neutral-500 hover:text-yellow-400 transition-colors" aria-label="LinkedIn">
              <FaLinkedin size={18} />
            </a>
            <a href={`mailto:${email}`}
              className="text-neutral-500 hover:text-yellow-400 transition-colors" aria-label="Email">
              <FaEnvelope size={17} />
            </a>
          </div>

          <p className="text-xs text-neutral-600 text-center sm:text-right">
            Made with Love ❤️<br />
            © {new Date().getFullYear()} {name}
          </p>
        </div>
      </div>
    </footer>
  )
}
