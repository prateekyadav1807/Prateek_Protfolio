import { Router } from 'express'
import { register, login, getMe, changePassword } from '../controllers/auth.js'
import { protect } from '../middleware/auth.js'

const r = Router()
r.post('/register', register)
r.post('/login', login)
r.get('/me', protect, getMe)
r.put('/password', protect, changePassword)
export default r
