import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiCollection, HiStar, HiExternalLink } from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'
import {
  getProjects, createProject, updateProject, deleteProject,
} from '../api/services.js'
import PageHeader    from '../components/PageHeader.jsx'
import Modal         from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState    from '../components/EmptyState.jsx'
import FileUpload    from '../components/FileUpload.jsx'
import Spinner       from '../components/Spinner.jsx'

const CATEGORIES = ['MERN', 'Frontend', 'Backend', 'Full Stack', 'AI/ML', 'Other']

function ProjectForm({ defaultValues, onSubmit, loading }) {
  const [imageFile, setImageFile] = useState(null)
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  const submit = (data) => onSubmit(data, imageFile)

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Project Title *</label>
          <input className={`input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="E-Commerce Platform"
            {...register('title', { required: 'Title is required' })} />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input" {...register('category')}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Short Description *</label>
        <textarea className="input resize-none" rows={2}
          placeholder="A brief one-liner about the project..."
          {...register('description', { required: 'Description is required' })} />
        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="label">Long Description</label>
        <textarea className="input resize-none" rows={3}
          placeholder="Detailed description for the project modal..."
          {...register('longDesc')} />
      </div>

      <div>
        <label className="label">Tech Stack (comma-separated)</label>
        <input className="input" placeholder="React, Node.js, MongoDB, Express.js"
          {...register('techStr')} />
        <p className="text-xs mt-1" style={{ color: 'var(--text-m)' }}>Separate with commas</p>
      </div>

      <div>
        <label className="label">Key Features (one per line)</label>
        <textarea className="input resize-none" rows={3}
          placeholder="JWT authentication&#10;Admin dashboard&#10;Product management"
          {...register('featuresStr')} />
        <p className="text-xs mt-1" style={{ color: 'var(--text-m)' }}>One feature per line</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">GitHub URL</label>
          <input className="input" placeholder="https://github.com/..."
            {...register('github')} />
        </div>
        <div>
          <label className="label">Live Demo URL</label>
          <input className="input" placeholder="https://your-project.vercel.app"
            {...register('demo')} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Icon (emoji)</label>
          <input className="input" placeholder="🛒" {...register('icon')} />
        </div>
        <div>
          <label className="label">Display Order</label>
          <input className="input" type="number" placeholder="0"
            {...register('order', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="featured" className="w-4 h-4 accent-yellow-400"
          {...register('featured')} />
        <label htmlFor="featured" className="text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
          Featured project <span className="text-yellow-400">⭐</span>
        </label>
      </div>

      <FileUpload
        label="Project Screenshot / Image"
        value={defaultValues?.image}
        onChange={setImageFile}
        accept="image/*"
      />

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {loading && <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
          {defaultValues?._id ? 'Update Project' : 'Add Project'}
        </button>
      </div>
    </form>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [confirm,  setConfirm]  = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () =>
    getProjects()
      .then(r => setProjects(r.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openAdd  = () => { setEditing(null); setModal(true) }
  const openEdit = (p)  => { setEditing(p);  setModal(true) }
  const closeModal = () => { setModal(false); setEditing(null) }

  const onSubmit = async (formData, imageFile) => {
    setSaving(true)
    try {
      const fd = new FormData()
      const fields = ['title', 'category', 'description', 'longDesc', 'github', 'demo', 'icon', 'order', 'featured']
      fields.forEach(k => {
        if (formData[k] !== undefined) fd.append(k, formData[k])
      })
      // Parse tech and features
      const tech = formData.techStr
        ? formData.techStr.split(',').map(s => s.trim()).filter(Boolean)
        : []
      const features = formData.featuresStr
        ? formData.featuresStr.split('\n').map(s => s.trim()).filter(Boolean)
        : []
      fd.append('tech',     JSON.stringify(tech))
      fd.append('features', JSON.stringify(features))
      if (imageFile) fd.append('image', imageFile)

      if (editing) {
        await updateProject(editing._id, fd)
        toast.success('Project updated!')
      } else {
        await createProject(fd)
        toast.success('Project added!')
      }
      closeModal()
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    setDeleting(true)
    try {
      await deleteProject(confirm)
      toast.success('Project deleted')
      setConfirm(null)
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  // Build defaultValues for edit (join arrays back to strings)
  const editDefaults = editing
    ? {
        ...editing,
        techStr:     Array.isArray(editing.tech)     ? editing.tech.join(', ')     : '',
        featuresStr: Array.isArray(editing.features) ? editing.features.join('\n') : '',
      }
    : { category: CATEGORIES[0], order: 0, featured: false }

  if (loading) return <Spinner center />

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''}`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <HiPlus size={15} /> Add Project
          </button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={HiCollection}
          title="No projects yet"
          message="Add your first project to showcase your work."
          actionLabel="Add Project"
          onAction={openAdd}
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(p => (
            <div key={p._id} className="card flex flex-col gap-3 group hover:border-yellow-500/30 transition-colors">
              {/* Image or icon */}
              {p.image ? (
                <img src={p.image} alt={p.title}
                  className="w-full h-32 object-cover rounded-lg"
                  style={{ border: '1px solid var(--border)' }} />
              ) : (
                <div className="w-full h-32 rounded-lg flex items-center justify-center text-4xl"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  {p.icon || '🚀'}
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{p.title}</h3>
                    {p.featured && <HiStar size={13} className="text-yellow-400 flex-shrink-0" />}
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--bg)', color: 'var(--text-m)' }}>
                    {p.category}
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--text-m)' }}>
                {p.description?.slice(0, 100)}{p.description?.length > 100 ? '…' : ''}
              </p>

              <div className="flex flex-wrap gap-1">
                {p.tech?.slice(0, 4).map(t => (
                  <span key={t} className="text-xs px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308' }}>
                    {t}
                  </span>
                ))}
                {p.tech?.length > 4 && (
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: 'var(--text-m)' }}>
                    +{p.tech.length - 4}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-1"
                style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex gap-2">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      className="text-xs flex items-center gap-1" style={{ color: 'var(--text-m)' }}>
                      <FaGithub size={12} /> GitHub
                    </a>
                  )}
                  {p.demo && p.demo !== '#' && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer"
                      className="text-xs flex items-center gap-1" style={{ color: 'var(--text-m)' }}>
                      <HiExternalLink size={12} /> Demo
                    </a>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)}
                    className="p-1.5 rounded-lg hover:bg-yellow-400/10 text-yellow-400 transition-colors">
                    <HiPencil size={13} />
                  </button>
                  <button onClick={() => setConfirm(p._id)}
                    className="p-1.5 rounded-lg hover:bg-red-400/10 text-red-400 transition-colors">
                    <HiTrash size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={closeModal}
        title={editing ? 'Edit Project' : 'Add New Project'} size="lg">
        <ProjectForm defaultValues={editDefaults} onSubmit={onSubmit} loading={saving} />
      </Modal>

      <ConfirmDialog
        open={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={onDelete} loading={deleting}
        title="Delete Project"
        message="This will permanently remove this project from your portfolio."
      />
    </div>
  )
}
