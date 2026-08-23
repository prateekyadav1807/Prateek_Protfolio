import Message from '../models/Message.js'
import nodemailer from 'nodemailer'
import { logActivity } from './analytics.js'

export const getMessages = async (req, res) => {
  try {
    const { search, read, page = 1, limit = 20 } = req.query
    const filter = {}
    if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { message: new RegExp(search, 'i') }]
    if (read !== undefined) filter.read = read === 'true'
    const total = await Message.countDocuments(filter)
    const messages = await Message.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit))
    res.json({ messages, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const markRead = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: req.body.read }, { new: true })
    res.json(msg)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required' })
  try {
    await Message.create({ name, email, message })

    // Log activity for dashboard
    await logActivity('message_received', `New message from ${name} (${email})`)

    // Send email notification — non-fatal if it fails
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      })
      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_USER,
        subject: `Portfolio Contact — ${name}`,
        html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br/>${message}</p>`,
      })
    } catch (mailErr) {
      console.error('Email send failed (message still saved):', mailErr.message)
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
