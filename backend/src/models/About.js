import mongoose from 'mongoose'

const aboutSchema = new mongoose.Schema({
  bio:        { type: String, default: '' },
  highlights: { type: [String], default: [] },
  learning:   { type: [String], default: [] },
  location:   { type: String, default: '' },
  email:      { type: String, default: '' },
  phone:      { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('About', aboutSchema)
