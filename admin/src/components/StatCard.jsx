/**
 * Dashboard statistic card.
 * Props: label, value, icon, trend, color ('yellow'|'green'|'blue'|'red'|'purple')
 */
export default function StatCard({ label, value, icon: Icon, trend, color = 'yellow' }) {
  const colors = {
    yellow: 'bg-yellow-400/10 text-yellow-400',
    green:  'bg-green-500/10 text-green-400',
    blue:   'bg-blue-500/10 text-blue-400',
    red:    'bg-red-500/10 text-red-400',
    purple: 'bg-purple-500/10 text-purple-400',
  }

  return (
    <div className="card flex items-center gap-4">
      {Icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-2xl font-bold font-mono leading-none mb-0.5" style={{ color: 'var(--text)' }}>
          {value ?? '—'}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--text-m)' }}>{label}</p>
        {trend !== undefined && (
          <p className={`text-xs mt-0.5 font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
    </div>
  )
}
