import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Warn clearly in logs if Cloudinary is not configured
if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name_here') {
  console.warn('⚠️  Cloudinary not configured — file uploads will fail. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env')
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:           'portfolio',
    allowed_formats:  ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
    resource_type:    file.mimetype === 'application/pdf' ? 'raw' : 'image',
    transformation:   file.mimetype.startsWith('image/') ? [{ quality: 'auto', fetch_format: 'auto' }] : [],
  }),
})

// Custom error handler for multer
const multerUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed. Use JPG, PNG, WebP, or PDF.`))
    }
  },
})

// Wrap multer to return proper JSON errors instead of crashing
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
