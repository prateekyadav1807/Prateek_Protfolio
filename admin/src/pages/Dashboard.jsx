import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiEye, HiDownload, HiMail, HiCollection,
  HiCode, HiInbox, HiClock, HiExternalLink,
} from 'react-icons/hi'
import { getAnalytics } from '../api/services.js'
import StatCard   from '../components/StatCard.jsx'
import Spinner    from '../components/Spinner.jsx'
import PageHeader from '../components/PageHeader.jsx'

const ACTION_ICONS = {
  resume_download:  '📄',
  visitor:          '👀',
  message_received: '✉️',
  project_view:     '🚀',
}

const ACTION_LABELS = {
  resume_download:  'Resume downloaded',
  visitor:          'New visitor',
  message_received: 'New message received',
  project_view:     'Project viewed',
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  <  1)  return 'just now'
  if (mins  < 60)  return `${mins}m ago`
  if (hours < 24)  return `${hours}h ago`
  return `${days}d ago`
}

const quickLinks = [
  { to: '/hero',           label: 'Edit Hero',          icon: '🏠' },
  { to: '/skills',         label: 'Manage Skills',      icon: '⚡' },
  { to: '/projects',       label: 'Manage Projects',    icon: '🚀' },
  { to: '/messages',       label: 'View Messages',      icon: '✉️' },
  { to: '/experience',     label: 'Edit Experience',    icon: '💼' },
  { to: '/certifications', label: 'Certifications',     icon: '🏅' },
]

export default function Dashboard() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    getAnalytics()
      .then(r => setData(r.data))
      .catch(()  => setError('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner center />
  if (error)   return <p className="text-red-400 text-sm">{error}</p>

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, here's what's happening with your portfolio."
      />

      {/* Stats grid */}
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
          label="Unread Messages"
          value={data?.unreadMessages ?? 0}
          icon={HiInbox}
          color="red"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Total Projects"
          value={data?.totalProjects ?? 0}
          icon={HiCollection}
          color="purple"
        />
        <StatCard
          label="Skills Added"
          value="—"
          icon={HiCode}
          color="yellow"
        />
      </div>

      {/* Bottom two-col layout */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Activity log */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <HiClock size={15} className="text-yellow-400" /> Recent Activity
            </h2>
            <Link to="/analytics" className="text-xs text-yellow-400 hover:underline">
              View all
            </Link>
          </div>

          {data?.activityLog?.length ? (
            <ul className="space-y-3">
              {data.activityLog.slice(0, 8).map((entry, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-base leading-none mt-0.5 flex-shrink-0">
                    {ACTION_ICONS[entry.action] ?? '📌'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: 'var(--text)' }}>
                      {ACTION_LABELS[entry.action] ?? entry.action}
                    </p>
                    {entry.detail && (
                      <p className="text-xs truncate" style={{ color: 'var(--text-m)' }}>{entry.detail}</p>
                    )}
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-m)' }}>
                    {timeAgo(entry.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text-m)' }}>
              No activity yet
            </p>
          )}
        </div>

        {/* Quick links */}
        <div className="card">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <HiExternalLink size={15} className="text-yellow-400" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-yellow-400/5"
                style={{ border: '1px solid var(--border)', color: 'var(--text-m)' }}
              >
                <span className="text-base">{icon}</span>
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </div>

          {/* Unread messages callout */}
          {(data?.unreadMessages ?? 0) > 0 && (
            <Link
              to="/messages"
              className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
              style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.2)' }}
            >
              <HiInbox size={18} className="text-yellow-400 flex-shrink-0" />
              <p className="text-sm" style={{ color: 'var(--text)' }}>
                You have{' '}
                <span className="text-yellow-400 font-semibold">{data.unreadMessages}</span>{' '}
                unread {data.unreadMessages === 1 ? 'message' : 'messages'}
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
