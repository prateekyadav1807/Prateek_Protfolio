import Analytics from '../models/Analytics.js'
import Message from '../models/Message.js'
import Project from '../models/Project.js'

const getOrCreate = async () => {
  let doc = await Analytics.findOne()
  if (!doc) doc = await Analytics.create({})
  return doc
}

export const getAnalytics = async (req, res) => {
  try {
    const analytics = await getOrCreate()
    const totalMessages = await Message.countDocuments()
    const unreadMessages = await Message.countDocuments({ read: false })
    const totalProjects = await Project.countDocuments()
    res.json({ ...analytics.toObject(), totalMessages, unreadMessages, totalProjects })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const trackVisitor = async (req, res) => {
  try {
    const analytics = await getOrCreate()
    analytics.visitors += 1
    analytics.activityLog.unshift({ action: 'visitor', detail: `Visitor #${analytics.visitors}` })
    if (analytics.activityLog.length > 50) analytics.activityLog = analytics.activityLog.slice(0, 50)
    await analytics.save()
    res.json({ count: analytics.visitors })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const trackResumeDownload = async (req, res) => {
  try {
    const analytics = await getOrCreate()
    analytics.resumeDownloads += 1
    analytics.activityLog.unshift({ action: 'resume_download', detail: 'Resume downloaded' })
    if (analytics.activityLog.length > 50) analytics.activityLog = analytics.activityLog.slice(0, 50)
    await analytics.save()
    res.json({ count: analytics.resumeDownloads })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const trackProjectView = async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const logActivity = async (action, detail) => {
  try {
    const analytics = await getOrCreate()
    analytics.activityLog.unshift({ action, detail })
    if (analytics.activityLog.length > 50) analytics.activityLog = analytics.activityLog.slice(0, 50)
    await analytics.save()
  } catch {}
}
