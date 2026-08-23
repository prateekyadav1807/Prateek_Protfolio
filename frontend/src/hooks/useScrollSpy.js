import { useState, useEffect } from 'react'

const TITLES = {
  home: 'Prateek Yadav — Portfolio',
  about: 'About — Prateek Yadav',
  skills: 'Skills — Prateek Yadav',
  projects: 'Projects — Prateek Yadav',
  achievements: 'Achievements — Prateek Yadav',
  coding: 'Coding Profiles — Prateek Yadav',
  certifications: 'Certifications — Prateek Yadav',
  contact: 'Contact — Prateek Yadav',
}

export function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const observers = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id)
            document.title = TITLES[id] || 'Prateek Yadav — Portfolio'
          }
        },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [ids])

  return active
}
