import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiDownload } from 'react-icons/hi'

export default function ResumeModal({ onClose, src = '/resume.pdf' }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
          className="card w-full max-w-3xl flex flex-col"
          style={{ height: '85vh' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Resume Preview</p>
            <div className="flex items-center gap-2">
              <a href={src} download className="btn-yellow text-xs py-1.5 px-3">
                <HiDownload size={13} /> Download
              </a>
              <button onClick={onClose} className="text-neutral-500 hover:text-yellow-400 transition-colors p-1">
                <HiX size={18} />
              </button>
            </div>
          </div>
          <iframe
            src={src}
            className="flex-1 rounded-lg w-full"
            style={{ border: '1px solid var(--border)' }}
            title="Resume"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
