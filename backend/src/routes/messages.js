import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import { getMessages, markRead, deleteMessage, sendMessage } from '../controllers/messages.js'

const r = Router()
r.post('/', sendMessage)                        // public — contact form
r.get('/', protect, getMessages)                // admin
r.put('/:id/read', protect, markRead)           // admin
r.delete('/:id', protect, deleteMessage)        // admin
export default r
