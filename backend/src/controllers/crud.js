/**
 * Generic CRUD factory functions.
 * Handles FormData with JSON-stringified array fields (roles, stats, tech, features, skills).
 */

// Fields that arrive as JSON strings when sent via FormData
const JSON_ARRAY_FIELDS = ['roles', 'stats', 'tech', 'features', 'skills', 'highlights', 'learning']

function parseBody(body) {
  const parsed = { ...body }
  for (const field of JSON_ARRAY_FIELDS) {
    if (typeof parsed[field] === 'string') {
      try { parsed[field] = JSON.parse(parsed[field]) } catch {}
    }
  }
  // boolean coercion for featured, current
  if (parsed.featured !== undefined) parsed.featured = parsed.featured === 'true' || parsed.featured === true
  if (parsed.current  !== undefined) parsed.current  = parsed.current  === 'true' || parsed.current  === true
  return parsed
}

// ── Singleton helpers ──────────────────────────────────────────────

export const getOne = (Model) => async (req, res) => {
  try {
    let doc = await Model.findOne()
    if (!doc) doc = await Model.create({})
    res.json(doc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateOne = (Model) => async (req, res) => {
  try {
    let doc = await Model.findOne()
    if (!doc) doc = new Model()

    const data = parseBody(req.body)
    Object.assign(doc, data)

    // Handle multiple possible file fields (photo, resume/image)
    if (req.files) {
      for (const [fieldname, files] of Object.entries(req.files)) {
        if (files?.[0]) doc[fieldname] = files[0].path
      }
    } else if (req.file) {
      const field = req.file.fieldname === 'resume' ? 'resumeUrl' : req.file.fieldname
      doc[field] = req.file.path
    }

    await doc.save()
    res.json(doc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ── Collection helpers ─────────────────────────────────────────────

export const getAll = (Model) => async (req, res) => {
  try {
    const docs = await Model.find().sort({ order: 1, createdAt: -1 })
    res.json(docs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const createOne = (Model) => async (req, res) => {
  try {
    const data = parseBody(req.body)
    if (req.file) {
      const field = req.file.fieldname === 'resume' ? 'resumeUrl' : req.file.fieldname
      data[field] = req.file.path
    }
    const doc = await Model.create(data)
    res.status(201).json(doc)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const updateById = (Model) => async (req, res) => {
  try {
    const data = parseBody(req.body)
    if (req.file) {
      const field = req.file.fieldname === 'resume' ? 'resumeUrl' : req.file.fieldname
      data[field] = req.file.path
    }
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    )
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json(doc)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const deleteById = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
