import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Use a plain object (not async function) to avoid signature mismatch
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:        'portfolio',
    resource_type: 'auto',   // handles both images and PDFs automatically
  },
})

const multerUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`File type not allowed. Use JPG, PNG, WebP, or PDF.`))
    }
  },
})

// Wrap with proper JSON error responses
export const upload = {
  single: (field) => (req, res, next) => {
    multerUpload.single(field)(req, res, (err) => {
      if (err) {
        console.error('Upload error:', err.message)
        return res.status(400).json({ error: `Upload failed: ${err.message}` })
      }
      next()
    })
  },
  fields: (fields) => (req, res, next) => {
    multerUpload.fields(fields)(req, res, (err) => {
      if (err) {
        console.error('Upload error:', err.message)
        return res.status(400).json({ error: `Upload failed: ${err.message}` })
      }
      next()
    })
  },
}

export { cloudinary }
