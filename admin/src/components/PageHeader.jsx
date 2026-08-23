/**
 * Consistent page header used across all admin pages.
 * Props: title, subtitle, action (optional button/element)
 */
export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text)' }}>{title}</h1>
        {subtitle && <p className="text-sm" style={{ color: 'var(--text-m)' }}>{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
