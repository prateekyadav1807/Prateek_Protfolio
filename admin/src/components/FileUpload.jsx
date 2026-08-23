import { useRef, useState } from 'react'
import { HiUpload, HiX, HiPhotograph } from 'react-icons/hi'

/**
 * Drag-and-drop file upload component with preview.
 * Props:
 *   value       – current file URL string (for existing image)
 *   onChange    – called with the File object when user picks one
 *   accept      – MIME types (default 'image/*')
 *   label       – display label
 *   previewType – 'image' | 'pdf' | 'avatar' (default 'image')
 */
export default function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  label = 'Upload File',
  previewType = 'image',
}) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file) => {
    if (!file) return
    onChange(file)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
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
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const displaySrc = preview || value
  const isPdf = accept.includes('pdf') && !displaySrc?.startsWith('data:image')

  return (
    <div>
      <label className="label">{label}</label>

      {/* Preview area */}
      {displaySrc && (
        <div className="relative mb-3 inline-block">
          {!isPdf ? (
            <img
              src={displaySrc}
              alt="Preview"
              className={`object-cover rounded-lg border`}
              style={{
                border: '1px solid var(--border)',
                width: previewType === 'avatar' ? 80 : 160,
                height: previewType === 'avatar' ? 80 : 100,
              }}
            />
          ) : (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-m)' }}
            >
              <HiPhotograph size={16} className="text-yellow-400" />
              PDF selected
            </div>
          )}
          <button
            type="button"
            onClick={clear}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <HiX size={10} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer transition-colors py-5"
        style={{
          border: `2px dashed ${dragging ? '#eab308' : 'var(--border)'}`,
          background: dragging ? 'rgba(234,179,8,0.05)' : 'var(--bg)',
        }}
      >
        <HiUpload size={20} className="text-yellow-400" />
        <p className="text-xs" style={{ color: 'var(--text-m)' }}>
          Drag & drop or <span className="text-yellow-400 font-medium">click to browse</span>
        </p>
        <p className="text-xs" style={{ color: 'var(--text-d, #555)' }}>
          {accept.replace('image/*', 'JPG, PNG, WebP').replace('application/pdf', 'PDF')}
        </p>
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
