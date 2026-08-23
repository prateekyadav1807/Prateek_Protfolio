import mongoose from 'mongoose'

const analyticsSchema = new mongoose.Schema({
  visitors:        { type: Number, default: 0 },
  resumeDownloads: { type: Number, default: 0 },
  activityLog: [{
    action:    { type: String },
    detail:    { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true })

export default mongoose.model('Analytics', analyticsSchema)
