import { HiPlusCircle } from 'react-icons/hi'

/**
 * Empty state placeholder for list pages.
 * Props: icon, title, message, actionLabel, onAction
 */
export default function EmptyState({ icon: Icon, title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center mb-4">
          <Icon size={28} className="text-yellow-400" />
        </div>
      )}
      <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{title}</p>
      {message && <p className="text-sm mb-5" style={{ color: 'var(--text-m)' }}>{message}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary flex items-center gap-2">
          <HiPlusCircle size={16} /> {actionLabel}
        </button>
      )}
    </div>
  )
}
