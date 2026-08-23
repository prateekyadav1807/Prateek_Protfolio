import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  HiMail, HiLocationMarker, HiCheckCircle,
  HiPaperAirplane, HiClipboardCopy, HiCheck, HiPhone,
} from 'react-icons/hi'
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa'
import { usePortfolio } from '../../context/PortfolioContext.jsx'
import { api } from '../../api/portfolio.js'

export default function Contact() {
  const { portfolio } = usePortfolio()
  const contact = portfolio.contact || {}

  const [form,    setForm]    = useState({ name: '', email: '', message: '' })
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [copied,  setCopied]  = useState(false)

  const email = contact.email || 'prateekyadav1807@gmail.com'

  const copyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.sendMessage(form)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setSent(false), 5000)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Build links dynamically from contact data
  const links = [
    email && {
      icon: <HiMail size={16} />,
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
      copyable: true,
    },
    contact.phone && {
      icon: <HiPhone size={16} />,
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone}`,
    },
    contact.github && {
      icon: <FaGithub size={16} />,
      label: 'GitHub',
      value: contact.github.replace('https://', '').replace('www.', ''),
      href: contact.github,
    },
    contact.linkedin && {
      icon: <FaLinkedin size={16} />,
      label: 'LinkedIn',
      value: contact.linkedin.replace('https://', '').replace('www.', ''),
      href: contact.linkedin,
    },
    contact.instagram && {
      icon: <FaInstagram size={16} />,
      label: 'Instagram',
      value: contact.instagram.replace('https://', '').replace('www.', ''),
      href: contact.instagram,
    },
    contact.twitter && {
      icon: <FaTwitter size={16} />,
      label: 'Twitter',
      value: contact.twitter.replace('https://', '').replace('www.', ''),
      href: contact.twitter,
    },
    contact.location && {
      icon: <HiLocationMarker size={16} />,
      label: 'Location',
      value: contact.location,
      href: null,
    },
  ].filter(Boolean)

  return (
    <section id="contact" className="section-pad" style={{ borderTop: '1px solid var(--border-s)' }}>
      <div className="wrap">
        <motion.span
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="tag"
        >
          Contact
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="heading mb-2"
        >
          Get in touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm text-neutral-500 mb-10"
        >
          Let's build something amazing together.
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Left — contact links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              I'm open to new opportunities and collaborations. Whether you have a project idea or
              just want to say hi — feel free to reach out.
            </p>

            <div className="space-y-3">
              {links.map((l) =>
                l.href ? (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-neutral-400 hover:text-yellow-400 transition-colors"
                  >
                    <span className="text-yellow-400 flex-shrink-0">{l.icon}</span>
                    <span className="w-16 flex-shrink-0" style={{ color: 'var(--text-d)' }}>{l.label}</span>
                    <span className="truncate">{l.value}</span>
                    {l.copyable && (
                      <button
                        onClick={e => { e.preventDefault(); copyEmail() }}
                        className="ml-auto text-neutral-600 hover:text-yellow-400 transition-colors flex-shrink-0"
                        title="Copy email"
                      >
                        {copied
                          ? <HiCheck size={14} className="text-green-400" />
                          : <HiClipboardCopy size={14} />
                        }
                      </button>
                    )}
                  </a>
                ) : (
                  <div key={l.label} className="flex items-center gap-3 text-sm text-neutral-400">
                    <span className="text-yellow-400 flex-shrink-0">{l.icon}</span>
                    <span className="w-16 flex-shrink-0" style={{ color: 'var(--text-d)' }}>{l.label}</span>
                    <span>{l.value}</span>
                  </div>
                )
              )}
            </div>
          </motion.div>

          {/* Right — contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <HiCheckCircle className="text-yellow-400 mb-3" size={40} />
                <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Message sent!</p>
                <p className="text-neutral-500 text-sm">I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-neutral-500 text-xs mb-1.5">Name</label>
                  <input
                    className="input" type="text" required placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 text-xs mb-1.5">Email</label>
                  <input
                    className="input" type="email" required placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 text-xs mb-1.5">Message</label>
                  <textarea
                    className="input resize-none" rows={4} required placeholder="What's on your mind?"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-yellow w-full justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                    />
                  ) : (
                    <><HiPaperAirplane size={15} /> Send Message</>
                  )}
                </button>

                {error && (
                  <p className="text-red-400 text-xs text-center mt-2">{error}</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
