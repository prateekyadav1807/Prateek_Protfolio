import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  HiHome, HiUser, HiCode, HiCollection, HiBriefcase,
  HiAcademicCap, HiBadgeCheck, HiStar, HiMail, HiInbox,
  HiChartBar, HiLogout, HiX
} from 'react-icons/hi'

const links = [
  { to: '/',                icon: HiHome,        label: 'Dashboard' },
  { to: '/hero',            icon: HiUser,        label: 'Hero' },
  { to: '/about',           icon: HiUser,        label: 'About' },
  { to: '/skills',          icon: HiCode,        label: 'Skills' },
  { to: '/projects',        icon: HiCollection,  label: 'Projects' },
  { to: '/experience',      icon: HiBriefcase,   label: 'Experience' },
  { to: '/education',       icon: HiAcademicCap, label: 'Education' },
  { to: '/certifications',  icon: HiBadgeCheck,  label: 'Certifications' },
  { to: '/achievements',    icon: HiStar,        label: 'Achievements' },
  { to: '/contact',         icon: HiMail,        label: 'Contact' },
  { to: '/messages',        icon: HiInbox,       label: 'Messages' },
  { to: '/analytics',       icon: HiChartBar,    label: 'Analytics' },
]

export default function Sidebar({ open, onClose }) {
  const { admin, logout } = useAuth()

  return (
    <>
      {/* Overlay */}
      {open && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 h-full z-30 w-60 flex flex-col transition-transform duration-300
        lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--sidebar)', borderRight: '1px solid var(--border)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-14" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="font-bold text-lg font-mono">
            <span style={{ color: 'var(--text)' }}>P</span><span className="text-yellow-400">Y</span>
            <span className="text-xs font-sans font-normal ml-2" style={{ color: 'var(--text-m)' }}>Admin</span>
          </span>
          <button onClick={onClose} className="lg:hidden text-neutral-400 hover:text-white"><HiX size={18} /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-yellow-400/10 text-yellow-400' : 'hover:bg-white/5'
                }`
              }
              style={({ isActive }) => ({ color: isActive ? '#eab308' : 'var(--text-m)' })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs font-medium truncate mb-0.5" style={{ color: 'var(--text)' }}>{admin?.username}</p>
          <p className="text-xs truncate mb-3" style={{ color: 'var(--text-m)' }}>{admin?.email}</p>
          <button onClick={logout} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors">
            <HiLogout size={14} /> Logout
          </button>
        </div>
      </aside>
    </>
  )
}
