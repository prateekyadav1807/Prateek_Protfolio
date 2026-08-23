import nodemailer from 'nodemailer'

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message)
    return res.status(400).json({ error: 'All fields are required' })

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact — ${name}`,
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br/>${message}</p>`,
    })

    res.json({ success: true, message: 'Message sent successfully' })
  } catch (err) {
    console.error('Nodemailer error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
