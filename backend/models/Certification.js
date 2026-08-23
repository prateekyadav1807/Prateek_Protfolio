import mongoose from 'mongoose'

const certSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  organization: { type: String, required: true },
  date:         { type: String, default: '' },
  link:         { type: String, default: '' },
  image:        { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Certification', certSchema)
