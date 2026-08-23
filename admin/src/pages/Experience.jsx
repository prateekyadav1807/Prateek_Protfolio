import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiBriefcase } from 'react-icons/hi'
import {
  getExperience, createExperience, updateExperience, deleteExperience,
} from '../api/services.js'
import PageHeader    from '../components/PageHeader.jsx'
import Modal         from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState    from '../components/EmptyState.jsx'
import Spinner       from '../components/Spinner.jsx'

function ExperienceForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Company Name *</label>
          <input className={`input ${errors.company ? 'border-red-500' : ''}`}
            placeholder="Google, Startup X, etc."
            {...register('company', { required: 'Company is required' })} />
          {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}
        </div>
        <div>
          <label className="label">Role / Title *</label>
          <input className={`input ${errors.role ? 'border-red-500' : ''}`}
            placeholder="Software Engineer Intern"
            {...register('role', { required: 'Role is required' })} />
          {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Duration *</label>
          <input className={`input ${errors.duration ? 'border-red-500' : ''}`}
            placeholder="Jan 2024 – Present"
            {...register('duration', { required: 'Duration is required' })} />
          {errors.duration && <p className="text-red-400 text-xs mt-1">{errors.duration.message}</p>}
        </div>
        <div className="flex items-center gap-3 mt-5">
          <input type="checkbox" id="current" className="w-4 h-4 accent-yellow-400"
            {...register('current')} />
          <label htmlFor="current" className="text-sm cursor-pointer" style={{ color: 'var(--text)' }}>
            Currently working here
          </label>
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={3}
          placeholder="What you did, what you built, impact..."
          {...register('description')} />
      </div>

      <div>
        <label className="label">Skills Used (comma-separated)</label>
        <input className="input" placeholder="React, Node.js, AWS, TypeScript"
          {...register('skillsStr')} />
      </div>

      <div>
        <label className="label">Display Order</label>
        <input className="input" type="number" placeholder="0"
          {...register('order', { valueAsNumber: true })} />
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {loading && <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
          {defaultValues?._id ? 'Update Experience' : 'Add Experience'}
        </button>
      </div>
    </form>
  )
}

export default function ExperiencePage() {
  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [confirm,  setConfirm]  = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () =>
    getExperience()
      .then(r => setItems(r.data))
      .catch(() => toast.error('Failed to load experience'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openAdd    = () => { setEditing(null); setModal(true) }
  const openEdit   = (e)  => { setEditing(e);  setModal(true) }
  const closeModal = () => { setModal(false);  setEditing(null) }

  const onSubmit = async (formData) => {
    setSaving(true)
    try {
      const payload = {
        ...formData,
        skills: formData.skillsStr
          ? formData.skillsStr.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      }
      delete payload.skillsStr

      if (editing) {
        await updateExperience(editing._id, payload)
        toast.success('Experience updated!')
      } else {
        await createExperience(payload)
        toast.success('Experience added!')
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
      await deleteExperience(confirm)
      toast.success('Experience deleted')
      setConfirm(null)
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const editDefaults = editing
    ? { ...editing, skillsStr: Array.isArray(editing.skills) ? editing.skills.join(', ') : '' }
    : { order: 0, current: false }

  if (loading) return <Spinner center />

  return (
    <div>
      <PageHeader
        title="Experience"
        subtitle={`${items.length} experience entr${items.length !== 1 ? 'ies' : 'y'}`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <HiPlus size={15} /> Add Experience
          </button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={HiBriefcase}
          title="No experience entries yet"
          message="Add your work experience, internships, or freelance work."
          actionLabel="Add Experience"
          onAction={openAdd}
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="card hover:border-yellow-500/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{item.role}</h3>
                    {item.current && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-yellow-400 mb-1">{item.company}</p>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-m)' }}>{item.duration}</p>
                  {item.description && (
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-m)' }}>
                      {item.description}
                    </p>
                  )}
                  {item.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.skills.map(s => (
                        <span key={s} className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-yellow-400/10 text-yellow-400 transition-colors">
                    <HiPencil size={14} />
                  </button>
                  <button onClick={() => setConfirm(item._id)}
                    className="p-1.5 rounded-lg hover:bg-red-400/10 text-red-400 transition-colors">
                    <HiTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={closeModal}
        title={editing ? 'Edit Experience' : 'Add Experience'}>
        <ExperienceForm defaultValues={editDefaults} onSubmit={onSubmit} loading={saving} />
      </Modal>

      <ConfirmDialog
        open={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={onDelete} loading={deleting}
        title="Delete Experience"
        message="This will permanently remove this experience entry."
      />
    </div>
  )
}
