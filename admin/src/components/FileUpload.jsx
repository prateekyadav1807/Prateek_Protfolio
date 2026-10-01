import { useRef, useState } from 'react'
import { HiUpload, HiX, HiPhotograph, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

/**
 * Uploads directly to Cloudinary from the browser (unsigned upload).
 * No backend involved — no signature issues.
 *
 * Props:
 *   value       – current URL string (existing saved file)
 *   onUpload    – called with the Cloudinary URL string after upload
 *   accept      – MIME types string
 *   label       – display label
 *   previewType – 'image' | 'pdf' | 'avatar'
 */
export default function FileUpload({
  value,
  onUpload,
  accept = 'image/*',
  label = 'Upload File',
  previewType = 'image',
}) {
  const inputRef  = useRef(null)
  const [preview,  setPreview]  = useState(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const [error, setError] = useState('')

  const uploadToCloudinary = async (file) => {
    setError('')
    setUploading(true)

    // Show local preview immediately
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', UPLOAD_PRESET)
      fd.append('folder', 'portfolio')

      const resourceType = file.type === 'application/pdf' ? 'raw' : 'image'
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
        { method: 'POST', body: fd }
      )
      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error?.message || 'Upload failed')
      }

      const url = data.secure_url
      setUploadedUrl(url)
      onUpload(url)
    } catch (err) {
      setError(err.message)
      setPreview(null)
      onUpload(null)
    } finally {
      setUploading(false)
    }
  }

  const handleFile = (file) => {
    if (!file) return
    uploadToCloudinary(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const clear = (e) => {
    e.stopPropagation()
    setPreview(null)
    setUploadedUrl(null)
    setError('')
    onUpload(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const displaySrc = uploadedUrl || preview || value
  const isPdf = (accept.includes('pdf') && !displaySrc?.startsWith('data:image') && !displaySrc?.startsWith('https://res.cloudinary'))
    || displaySrc?.includes('/raw/upload/')

  return (
    <div>
      <label className="label">{label}</label>

      {/* Preview / Uploaded state */}
      {displaySrc && !uploading && (
        <div className="relative mb-3 inline-block">
          {!isPdf ? (
            <img
              src={displaySrc}
              alt="Preview"
              className="object-cover rounded-lg"
              style={{
                border: '2px solid var(--border)',
                width:  previewType === 'avatar' ? 80  : 160,
                height: previewType === 'avatar' ? 80  : 100,
              }}
            />
          ) : (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-m)' }}
            >
              <HiPhotograph size={16} className="text-yellow-400" />
              PDF ready
            </div>
          )}
          {/* Uploaded badge */}
          {uploadedUrl && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5">
              <HiCheckCircle size={14} />
            </div>
          )}
          <button
            type="button"
            onClick={clear}
            className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <HiX size={10} />
          </button>
        </div>
      )}

      {/* Upload success message */}
      {uploadedUrl && (
        <p className="text-xs text-green-400 flex items-center gap-1 mb-2">
          <HiCheckCircle size={13} /> Uploaded successfully
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mb-2">
          <HiExclamationCircle size={13} /> {error}
        </p>
      )}

      {/* Drop zone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center gap-2 rounded-lg transition-colors py-5"
        style={{
          border: `2px dashed ${dragging ? '#eab308' : error ? '#ef4444' : 'var(--border)'}`,
          background: dragging ? 'rgba(234,179,8,0.05)' : 'var(--bg)',
          cursor: uploading ? 'not-allowed' : 'pointer',
          opacity: uploading ? 0.7 : 1,
        }}
      >
        {uploading ? (
          <>
            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-yellow-400 font-medium">Uploading to Cloudinary…</p>
          </>
        ) : (
          <>
            <HiUpload size={20} className="text-yellow-400" />
            <p className="text-xs" style={{ color: 'var(--text-m)' }}>
              Drag & drop or <span className="text-yellow-400 font-medium">click to browse</span>
            </p>
            <p className="text-xs" style={{ color: 'var(--text-d, #555)' }}>
              {accept.includes('pdf')
                ? 'JPG, PNG, WebP, PDF — max 10MB'
                : 'JPG, PNG, WebP — max 10MB'}
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  )
}
