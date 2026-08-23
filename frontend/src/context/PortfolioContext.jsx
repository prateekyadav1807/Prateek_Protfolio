import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { api } from '../api/portfolio.js'

const Ctx = createContext(null)

const FALLBACK = {
  hero: {
    name:      'Prateek Yadav',
    tagline:   'Full Stack Developer specializing in React, Node.js, MongoDB, and Cloud Technologies.',
    roles:     ['Full Stack Developer', 'React Developer', 'MERN Stack Dev', 'Problem Solver'],
    github:    'https://github.com/prateekyadav1807',
    linkedin:  'https://www.linkedin.com/in/prateekyadav18/',
    instagram: 'https://www.instagram.com/ig.prateekyadav/',
    photo:     '/photo.jpeg',
    resumeUrl: '/resume.pdf',
    stats: [
      { value: '300+', label: 'DSA Problems Solved' },
      { value: '1470', label: 'LeetCode Rating' },
      { value: '5+',   label: 'Projects Built' },
      { value: 'AWS',  label: 'Certified' },
    ],
  },
  about: {
    bio:        "I'm a B.Tech Computer Science student and Full Stack Developer passionate about building scalable web applications.",
    highlights: [
      '🎓 B.Tech Computer Science, KIET (2023–2027)',
      '⚡ Full Stack Developer — MERN Stack',
      '🧩 300+ DSA problems on LeetCode & GFG',
      '🚀 Passionate about scalable, user-friendly apps',
    ],
    learning: ['Full Stack Development', 'Cloud (AWS)', 'DSA', 'System Design'],
    location: 'Ghaziabad, India',
    email:    'prateekyadav1807@gmail.com',
  },
  skills: [], projects: [], experience: [],
  education: [{
    _id: 'fallback-edu', degree: 'B.Tech Computer Science',
    institution: 'KIET Group of Institutions', duration: '2023 – 2027', score: '82.55%',
  }],
  certifications: [], achievements: [],
  contact: {
    email:     'prateekyadav1807@gmail.com',
    location:  'Ghaziabad, India',
    github:    'https://github.com/prateekyadav1807',
    linkedin:  'https://www.linkedin.com/in/prateekyadav18/',
    instagram: 'https://www.instagram.com/ig.prateekyadav/',
  },
}

const KEYS = [
  'hero','about','skills','projects','experience',
  'education','certifications','achievements','contact',
]

async function fetchAll() {
  const results = await Promise.allSettled([
    api.hero(), api.about(), api.skills(), api.projects(),
    api.experience(), api.education(), api.certifications(),
    api.achievements(), api.contact(),
  ])
  return KEYS.reduce((acc, key, i) => {
    acc[key] = results[i].status === 'fulfilled'
      ? results[i].value
      : FALLBACK[key]
    return acc
  }, {})
}

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState(FALLBACK)
  const [loading,   setLoading]   = useState(true)
  const fetching = useRef(false) // prevent overlapping fetches

  const refresh = useCallback(async () => {
    if (fetching.current) return
    fetching.current = true
    try {
      const data = await fetchAll()
      setPortfolio(data)
    } catch {
      // keep existing data
    } finally {
      fetching.current = false
    }
  }, [])

  // Initial load
  useEffect(() => {
    refresh().finally(() => setLoading(false))
    api.trackVisitor().catch(() => {})
  }, [refresh])

  // Re-fetch when tab becomes visible (switching tabs in browser)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [refresh])

  // Re-fetch when window gets focus (alt+tab between windows)
  useEffect(() => {
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [refresh])

  // Poll every 5 seconds — reliable fallback that always works
  // regardless of tabs, windows, or cross-origin restrictions
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refresh()
    }, 5000)
    return () => clearInterval(id)
  }, [refresh])

  return (
    <Ctx.Provider value={{ portfolio, loading, refresh }}>
      {children}
    </Ctx.Provider>
  )
}

export function usePortfolio() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider')
  return ctx
}
