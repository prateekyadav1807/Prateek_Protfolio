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
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
      await transporter.sendMail({
        // Gmail forces 'from' to be your own account — using sender's email here causes auth errors
        from:     `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to:       process.env.EMAIL_USER,
        replyTo:  email,   // so you can hit Reply to respond to the sender
        subject:  `📩 New message from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px">
            <h2 style="color:#1a1a1a;margin-bottom:4px">New Portfolio Message</h2>
            <p style="color:#666;font-size:13px;margin-bottom:24px">Someone reached out via your portfolio contact form.</p>
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:10px 0;color:#888;font-size:13px;width:80px">Name</td>
                <td style="padding:10px 0;color:#1a1a1a;font-weight:600">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;font-size:13px">Email</td>
                <td style="padding:10px 0"><a href="mailto:${email}" style="color:#eab308">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top">Message</td>
                <td style="padding:10px 0;color:#1a1a1a;line-height:1.6">${message.replace(/\n/g, '<br/>')}</td>
              </tr>
            </table>
            <a href="mailto:${email}?subject=Re: Your message" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#eab308;color:#000;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px">
              Reply to ${name}
            </a>
          </div>
        `,
      })
    } catch (mailErr) {
      // Log the actual error so you can debug from Render logs
      console.error('Email send failed:', mailErr.message)
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
