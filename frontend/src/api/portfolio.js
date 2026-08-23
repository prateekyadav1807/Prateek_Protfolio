const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Always bypass browser cache so we get fresh data on every poll
async function get(path) {
  const res = await fetch(`${BASE}${path}`, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache' },
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

export const api = {
  hero:           () => get('/api/portfolio/hero'),
  about:          () => get('/api/portfolio/about'),
  skills:         () => get('/api/portfolio/skills'),
  projects:       () => get('/api/portfolio/projects'),
  experience:     () => get('/api/portfolio/experience'),
  education:      () => get('/api/portfolio/education'),
  certifications: () => get('/api/portfolio/certifications'),
  achievements:   () => get('/api/portfolio/achievements'),
  contact:        () => get('/api/portfolio/contact'),

  trackVisitor:        () => fetch(`${BASE}/api/analytics/visitor`, { method: 'POST' }),
  trackResumeDownload: () => fetch(`${BASE}/api/analytics/resume`,  { method: 'POST' }),
  trackProjectView:    (id) => fetch(`${BASE}/api/analytics/project/${id}`, { method: 'POST' }),

  sendMessage: (body) =>
    fetch(`${BASE}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(async r => {
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Failed to send message')
      return data
    }),
}
