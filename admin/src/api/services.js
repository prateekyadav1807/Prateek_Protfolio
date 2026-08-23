import api from './axios.js'

// Auth
export const login = (data) => api.post('/api/auth/login', data)
export const register = (data) => api.post('/api/auth/register', data)
export const getMe = () => api.get('/api/auth/me')
export const changePassword = (data) => api.put('/api/auth/password', data)

// Portfolio sections
export const getHero = () => api.get('/api/portfolio/hero')
export const updateHero = (data) => api.put('/api/portfolio/hero', data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
})

export const getAbout = () => api.get('/api/portfolio/about')
export const updateAbout = (data) => api.put('/api/portfolio/about', data)

export const getContact = () => api.get('/api/portfolio/contact')
export const updateContact = (data) => api.put('/api/portfolio/contact', data)

export const getSkills = () => api.get('/api/portfolio/skills')
export const createSkill = (data) => api.post('/api/portfolio/skills', data)
export const updateSkill = (id, data) => api.put(`/api/portfolio/skills/${id}`, data)
export const deleteSkill = (id) => api.delete(`/api/portfolio/skills/${id}`)

export const getProjects = () => api.get('/api/portfolio/projects')
export const createProject = (data) => api.post('/api/portfolio/projects', data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
})
export const updateProject = (id, data) => api.put(`/api/portfolio/projects/${id}`, data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
})
export const deleteProject = (id) => api.delete(`/api/portfolio/projects/${id}`)

export const getExperience = () => api.get('/api/portfolio/experience')
export const createExperience = (data) => api.post('/api/portfolio/experience', data)
export const updateExperience = (id, data) => api.put(`/api/portfolio/experience/${id}`, data)
export const deleteExperience = (id) => api.delete(`/api/portfolio/experience/${id}`)

export const getEducation = () => api.get('/api/portfolio/education')
export const createEducation = (data) => api.post('/api/portfolio/education', data)
export const updateEducation = (id, data) => api.put(`/api/portfolio/education/${id}`, data)
export const deleteEducation = (id) => api.delete(`/api/portfolio/education/${id}`)

export const getCertifications = () => api.get('/api/portfolio/certifications')
export const createCertification = (data) => api.post('/api/portfolio/certifications', data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
})
export const updateCertification = (id, data) => api.put(`/api/portfolio/certifications/${id}`, data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
})
export const deleteCertification = (id) => api.delete(`/api/portfolio/certifications/${id}`)

export const getAchievements = () => api.get('/api/portfolio/achievements')
export const createAchievement = (data) => api.post('/api/portfolio/achievements', data)
export const updateAchievement = (id, data) => api.put(`/api/portfolio/achievements/${id}`, data)
export const deleteAchievement = (id) => api.delete(`/api/portfolio/achievements/${id}`)

// Messages
export const getMessages = (params) => api.get('/api/messages', { params })
export const markRead = (id, read) => api.put(`/api/messages/${id}/read`, { read })
export const deleteMessage = (id) => api.delete(`/api/messages/${id}`)

// Analytics
export const getAnalytics = () => api.get('/api/analytics')
