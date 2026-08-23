import mongoose from 'mongoose'

const achievementSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  value:       { type: String, default: '' },
  icon:        { type: String, default: '🏆' },
  date:        { type: String, default: '' },
  order:       { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Achievement', achievementSchema)
