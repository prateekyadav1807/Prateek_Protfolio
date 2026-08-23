import { Router } from 'express'
import { getVisitors } from '../controllers/visitors.js'

const router = Router()
router.get('/', getVisitors)
export default router
