import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  longDesc:    { type: String, default: '' },
  tech:        { type: [String], default: [] },
  features:    { type: [String], default: [] },
  image:       { type: String, default: '' },
  github:      { type: String, default: '' },
  demo:        { type: String, default: '' },
  category:    { type: String, default: 'Web' },
  featured:    { type: Boolean, default: false },
  icon:        { type: String, default: '🚀' },
  views:       { type: Number, default: 0 },
  order:       { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Project', projectSchema)
