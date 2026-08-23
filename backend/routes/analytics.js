import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import { getAnalytics, trackVisitor, trackResumeDownload, trackProjectView } from '../controllers/analytics.js'

const r = Router()
r.get('/', protect, getAnalytics)
r.post('/visitor', trackVisitor)
r.post('/resume', trackResumeDownload)
r.post('/project/:id', trackProjectView)
export default r
