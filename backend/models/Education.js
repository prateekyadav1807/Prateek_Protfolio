import mongoose from 'mongoose'

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree:      { type: String, required: true },
  duration:    { type: String, required: true },
  score:       { type: String, default: '' },
  description: { type: String, default: '' },
  order:       { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Education', educationSchema)
