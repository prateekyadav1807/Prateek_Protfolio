import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

import Sidebar from './components/Sidebar.jsx'
import TopBar  from './components/TopBar.jsx'

import Login              from './pages/Login.jsx'
import Dashboard          from './pages/Dashboard.jsx'
import HeroPage           from './pages/Hero.jsx'
import AboutPage          from './pages/About.jsx'
import SkillsPage         from './pages/Skills.jsx'
import ProjectsPage       from './pages/Projects.jsx'
import ExperiencePage     from './pages/Experience.jsx'
import EducationPage      from './pages/Education.jsx'
import CertificationsPage from './pages/Certifications.jsx'
import AchievementsPage   from './pages/Achievements.jsx'
import ContactPage        from './pages/Contact.jsx'
import MessagesPage       from './pages/Messages.jsx'
import AnalyticsPage      from './pages/Analytics.jsx'

/* ── Protected layout — redirects to /login if not authenticated ── */
function AdminLayout() {
  const { admin, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!admin) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/* ── Guest route — redirects to / if already logged in ── */
function GuestRoute() {
  const { admin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (admin) return <Navigate to="/" replace />
  return <Outlet />
}

/* ── Routes tree — must be inside BrowserRouter ── */
function AppRoutes() {
  return (
    <>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/"               element={<Dashboard />} />
          <Route path="/hero"           element={<HeroPage />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/skills"         element={<SkillsPage />} />
          <Route path="/projects"       element={<ProjectsPage />} />
          <Route path="/experience"     element={<ExperiencePage />} />
          <Route path="/education"      element={<EducationPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/achievements"   element={<AchievementsPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="/messages"       element={<MessagesPage />} />
          <Route path="/analytics"      element={<AnalyticsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1a1a', color: '#e5e5e5', border: '1px solid #2a2a2a', fontSize: '13px' },
          success: { iconTheme: { primary: '#eab308', secondary: '#000' } },
        }}
      />
    </>
  )
}

export default function App() {
  return (
    // BrowserRouter wraps everything so useNavigate works inside AuthProvider
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
