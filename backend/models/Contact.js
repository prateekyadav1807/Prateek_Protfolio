import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  email:     { type: String, default: '' },
  phone:     { type: String, default: '' },
  location:  { type: String, default: '' },
  github:    { type: String, default: '' },
  linkedin:  { type: String, default: '' },
  instagram: { type: String, default: '' },
  twitter:   { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Contact', contactSchema)
