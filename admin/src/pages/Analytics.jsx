import { useEffect, useState } from 'react'
import {
  HiEye, HiDownload, HiMail, HiCollection,
  HiRefresh, HiClock, HiTrendingUp,
} from 'react-icons/hi'
import { getAnalytics } from '../api/services.js'
import PageHeader from '../components/PageHeader.jsx'
import StatCard   from '../components/StatCard.jsx'
import Spinner    from '../components/Spinner.jsx'

const ACTION_META = {
  resume_download:  { label: 'Resume Downloaded',    icon: '📄', color: 'green' },
  visitor:          { label: 'New Visitor',           icon: '👀', color: 'yellow' },
  message_received: { label: 'Message Received',      icon: '✉️', color: 'blue' },
  project_view:     { label: 'Project Viewed',        icon: '🚀', color: 'purple' },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  <  1)  return 'just now'
  if (mins  < 60)  return `${mins}m ago`
  if (hours < 24)  return `${hours}h ago`
  if (days  <  7)  return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Count occurrences of each action type in the log
function summarizeActions(log = []) {
  return log.reduce((acc, entry) => {
    acc[entry.action] = (acc[entry.action] || 0) + 1
    return acc
  }, {})
}

export default function AnalyticsPage() {
  const [data,      setData]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error,     setError]     = useState('')

  const load = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    getAnalytics()
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load analytics'))
      .finally(() => { setLoading(false); setRefreshing(false) })
  }

  useEffect(() => { load() }, [])

  if (loading) return <Spinner center />
  if (error)   return <p className="text-red-400 text-sm">{error}</p>

  const actionCounts = summarizeActions(data?.activityLog)

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Overview of your portfolio's performance and engagement."
        action={
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="btn-ghost flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <HiRefresh size={15} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Visitors"
          value={data?.visitors?.toLocaleString() ?? 0}
          icon={HiEye}
          color="yellow"
        />
        <StatCard
          label="Resume Downloads"
          value={data?.resumeDownloads ?? 0}
          icon={HiDownload}
          color="green"
        />
        <StatCard
          label="Total Messages"
          value={data?.totalMessages ?? 0}
          icon={HiMail}
          color="blue"
        />
        <StatCard
          label="Total Projects"
          value={data?.totalProjects ?? 0}
          icon={HiCollection}
          color="purple"
        />
      </div>

      {/* Breakdown + Activity */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Action breakdown */}
        <div className="card">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <HiTrendingUp size={15} className="text-yellow-400" /> Activity Breakdown
            <span className="text-xs font-normal" style={{ color: 'var(--text-m)' }}>
              (last 50 events)
            </span>
          </h2>

          <div className="space-y-3">
            {Object.entries(ACTION_META).map(([key, meta]) => {
              const count = actionCounts[key] || 0
              const max   = Math.max(...Object.values(actionCounts), 1)
              const pct   = Math.round((count / max) * 100)
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <span>{meta.icon}</span> {meta.label}
                    </span>
                    <span className="text-sm font-mono font-semibold" style={{ color: 'var(--text-m)' }}>
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'var(--border)' }}>
                    <div
                      className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Message stats row */}
          <div className="mt-5 pt-4 grid grid-cols-2 gap-3"
            style={{ borderTop: '1px solid var(--border)' }}>
            <div className="rounded-lg p-3 text-center"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <p className="text-lg font-bold font-mono text-yellow-400">{data?.unreadMessages ?? 0}</p>
              <p className="text-xs" style={{ color: 'var(--text-m)' }}>Unread Messages</p>
            </div>
            <div className="rounded-lg p-3 text-center"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <p className="text-lg font-bold font-mono text-green-400">
                {data?.totalMessages - data?.unreadMessages ?? 0}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-m)' }}>Read Messages</p>
            </div>
          </div>
        </div>

        {/* Full activity log */}
        <div className="card">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <HiClock size={15} className="text-yellow-400" /> Activity Log
            <span className="text-xs font-normal" style={{ color: 'var(--text-m)' }}>
              (latest 50 events)
            </span>
          </h2>

          {data?.activityLog?.length ? (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {data.activityLog.map((entry, i) => {
                const meta = ACTION_META[entry.action]
                return (
                  <div key={i}
                    className="flex items-start gap-3 py-2"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <span className="text-base leading-none mt-0.5 flex-shrink-0">
                      {meta?.icon ?? '📌'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ color: 'var(--text)' }}>
                        {meta?.label ?? entry.action}
                      </p>
                      {entry.detail && (
                        <p className="text-xs truncate" style={{ color: 'var(--text-m)' }}>
                          {entry.detail}
                        </p>
                      )}
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-m)' }}>
                      {timeAgo(entry.createdAt)}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm py-8 text-center" style={{ color: 'var(--text-m)' }}>
              No activity logged yet. Activity is recorded when visitors interact with your portfolio.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
