import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <motion.p
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="text-8xl font-extrabold text-yellow-400 font-mono mb-4"
      >
        404
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}
      >
        Oops! Page not found 👀
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="text-neutral-500 text-sm mb-8"
      >
        Looks like this page took a coffee break and never came back.
      </motion.p>
      <motion.a
        href="/"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="btn-yellow"
      >
        ← Back to Home
      </motion.a>
    </div>
  )
}
