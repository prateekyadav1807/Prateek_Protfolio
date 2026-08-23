import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  HiInbox, HiSearch, HiTrash, HiMail, HiMailOpen,
  HiChevronLeft, HiChevronRight, HiFilter,
} from 'react-icons/hi'
import { getMessages, markRead, deleteMessage } from '../api/services.js'
import PageHeader    from '../components/PageHeader.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState    from '../components/EmptyState.jsx'
import Spinner       from '../components/Spinner.jsx'

const LIMIT = 10

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

export default function MessagesPage() {
  const [messages,  setMessages]  = useState([])
  const [total,     setTotal]     = useState(0)
  const [page,      setPage]      = useState(1)
  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState('all')   // 'all' | 'unread' | 'read'
  const [loading,   setLoading]   = useState(true)
  const [expanded,  setExpanded]  = useState(null)    // message._id
  const [confirm,   setConfirm]   = useState(null)    // message._id to delete
  const [deleting,  setDeleting]  = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, limit: LIMIT, search }
    if (filter === 'unread') params.read = false
    if (filter === 'read')   params.read = true

    getMessages(params)
      .then(r => {
        setMessages(r.data.messages || [])
        setTotal(r.data.total || 0)
      })
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false))
  }, [page, search, filter])

  useEffect(() => { load() }, [load])

  // Debounced search: reset to page 1 when search changes
  const handleSearch = (val) => {
    setSearch(val)
    setPage(1)
  }

  const handleExpand = async (msg) => {
    if (expanded === msg._id) {
      setExpanded(null)
      return
    }
    setExpanded(msg._id)
    // Auto mark as read when opened
    if (!msg.read) {
      try {
        await markRead(msg._id, true)
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, read: true } : m))
      } catch {}
    }
  }

  const toggleRead = async (e, msg) => {
    e.stopPropagation()
    try {
      await markRead(msg._id, !msg.read)
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, read: !m.read } : m))
    } catch {
      toast.error('Failed to update status')
    }
  }

  const onDelete = async () => {
    setDeleting(true)
    try {
      await deleteMessage(confirm)
      toast.success('Message deleted')
      setConfirm(null)
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const totalPages = Math.ceil(total / LIMIT)
  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div>
      <PageHeader
        title="Messages"
        subtitle={`${total} total message${total !== 1 ? 's' : ''}${unreadCount > 0 ? ` · ${unreadCount} unread` : ''}`}
      />

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <HiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-m)' }} />
          <input
            className="input pl-8"
            placeholder="Search by name, email, or message..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>

        {/* Read filter */}
        <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {(['all', 'unread', 'read']).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1) }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                filter === f ? 'bg-yellow-400 text-black' : ''
              }`}
              style={filter !== f ? { color: 'var(--text-m)' } : {}}
            >
              {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : 'Read'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Spinner center /> : messages.length === 0 ? (
        <EmptyState
          icon={HiInbox}
          title={search ? 'No messages match your search' : 'No messages yet'}
          message={search ? 'Try a different search term.' : 'When someone fills out your contact form, messages will appear here.'}
        />
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`card cursor-pointer transition-all duration-200 hover:border-yellow-500/30 ${
                  !msg.read ? 'border-l-yellow-400' : ''
                }`}
                style={!msg.read ? { borderLeft: '3px solid #eab308' } : {}}
              >
                {/* Header row */}
                <div
                  className="flex items-center gap-3"
                  onClick={() => handleExpand(msg)}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>
                    {msg.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${!msg.read ? 'text-yellow-400' : ''}`}
                        style={msg.read ? { color: 'var(--text)' } : {}}>
                        {msg.name}
                      </span>
                      {!msg.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs truncate" style={{ color: 'var(--text-m)' }}>{msg.email}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs hidden sm:block" style={{ color: 'var(--text-m)' }}>
                      {timeAgo(msg.createdAt)}
                    </span>
                    {/* Toggle read */}
                    <button
                      onClick={(e) => toggleRead(e, msg)}
                      className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                      style={{ color: 'var(--text-m)' }}
                      title={msg.read ? 'Mark as unread' : 'Mark as read'}
                    >
                      {msg.read ? <HiMailOpen size={14} /> : <HiMail size={14} />}
                    </button>
                    {/* Delete */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirm(msg._id) }}
                      className="p-1.5 rounded-lg hover:bg-red-400/10 text-red-400 transition-colors"
                      title="Delete"
                    >
                      <HiTrash size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded message body */}
                {expanded === msg._id && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <p className="text-xs font-mono mb-2" style={{ color: 'var(--text-m)' }}>
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: 'var(--text)' }}>
                      {msg.message}
                    </p>
                    <a
                      href={`mailto:${msg.email}?subject=Re: Message from ${msg.name}`}
                      className="inline-flex items-center gap-1.5 mt-3 text-xs text-yellow-400 hover:text-yellow-300 font-medium"
                    >
                      <HiMail size={13} /> Reply via Email
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: 'var(--text-m)' }}>
                Page {page} of {totalPages} · {total} messages
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-ghost p-1.5 disabled:opacity-40"
                >
                  <HiChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-ghost p-1.5 disabled:opacity-40"
                >
                  <HiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={onDelete} loading={deleting}
        title="Delete Message"
        message="This will permanently delete this message."
        confirmLabel="Delete"
      />
    </div>
  )
}
