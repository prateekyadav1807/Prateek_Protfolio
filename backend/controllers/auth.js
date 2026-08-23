import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const register = async (req, res) => {
  try {
    const count = await Admin.countDocuments()
    if (count > 0) return res.status(403).json({ error: 'Admin already exists' })
    const admin = await Admin.create(req.body)
    res.status(201).json({ token: signToken(admin._id), admin: { id: admin._id, username: admin.username, email: admin.email } })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' })
    res.json({ token: signToken(admin._id), admin: { id: admin._id, username: admin.username, email: admin.email } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getMe = async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select('-password')
  res.json(admin)
}

export const changePassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id)
    if (!(await admin.matchPassword(req.body.currentPassword)))
      return res.status(400).json({ error: 'Current password is incorrect' })
    admin.password = req.body.newPassword
    await admin.save()
    res.json({ message: 'Password updated' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
