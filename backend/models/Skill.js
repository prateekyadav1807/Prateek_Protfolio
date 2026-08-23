import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name:     { type: String, required: true },
  icon:     { type: String, default: '' },
  level:    { type: Number, default: 80, min: 0, max: 100 },
  order:    { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Skill', skillSchema)
