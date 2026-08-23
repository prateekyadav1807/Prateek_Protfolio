import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'

import authRouter      from './routes/auth.js'
import portfolioRouter from './routes/portfolio.js'
import messagesRouter  from './routes/messages.js'
import analyticsRouter from './routes/analytics.js'
import visitorsRouter  from './routes/visitors.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security
app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, mobile)
    if (!origin) return callback(null, true)
    // Allow any localhost for local dev
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true)
    }
    // Allow explicitly configured origins (deployed frontend + admin)
    const allowed = [
      process.env.CLIENT_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean)
    if (allowed.includes(origin)) return callback(null, true)
    // In development (no CLIENT_URL set), allow everything
    if (!process.env.CLIENT_URL) return callback(null, true)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))
app.use(express.json())
app.use(morgan('dev'))

// Disable caching on all API responses so the portfolio always gets fresh data
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  next()
})

// Rate limiting
app.use('/api/messages', rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many requests' } }))
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many login attempts' } }))

// Routes
app.get('/', (req, res) => res.json({ message: 'Portfolio API running' }))
app.use('/api/auth',      authRouter)
app.use('/api/portfolio', portfolioRouter)
app.use('/api/messages',  messagesRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/visitors',  visitorsRouter)

// MongoDB + Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })
