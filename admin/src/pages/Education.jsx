import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiAcademicCap } from 'react-icons/hi'
import {
  getEducation, createEducation, updateEducation, deleteEducation,
} from '../api/services.js'
import PageHeader    from '../components/PageHeader.jsx'
import Modal         from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState    from '../components/EmptyState.jsx'
import Spinner       from '../components/Spinner.jsx'

function EducationForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Institution Name *</label>
        <input className={`input ${errors.institution ? 'border-red-500' : ''}`}
          placeholder="KIET Group of Institutions"
          {...register('institution', { required: 'Institution is required' })} />
        {errors.institution && <p className="text-red-400 text-xs mt-1">{errors.institution.message}</p>}
      </div>

      <div>
        <label className="label">Degree / Program *</label>
        <input className={`input ${errors.degree ? 'border-red-500' : ''}`}
          placeholder="B.Tech Computer Science"
          {...register('degree', { required: 'Degree is required' })} />
        {errors.degree && <p className="text-red-400 text-xs mt-1">{errors.degree.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Duration *</label>
          <input className={`input ${errors.duration ? 'border-red-500' : ''}`}
            placeholder="2023 – 2027"
            {...register('duration', { required: 'Duration is required' })} />
          {errors.duration && <p className="text-red-400 text-xs mt-1">{errors.duration.message}</p>}
        </div>
        <div>
          <label className="label">Score / CGPA / Percentage</label>
          <input className="input" placeholder="82.55% or 8.5 CGPA" {...register('score')} />
        </div>
      </div>

      <div>
        <label className="label">Additional Notes</label>
        <textarea className="input resize-none" rows={2}
          placeholder="Relevant coursework, honors, etc."
          {...register('description')} />
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
          {defaultValues?._id ? 'Update Education' : 'Add Education'}
        </button>
      </div>
    </form>
  )
}

export default function EducationPage() {
  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [confirm,  setConfirm]  = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () =>
    getEducation()
      .then(r => setItems(r.data))
      .catch(() => toast.error('Failed to load education'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openAdd    = () => { setEditing(null); setModal(true) }
  const openEdit   = (e)  => { setEditing(e);  setModal(true) }
  const closeModal = () => { setModal(false);  setEditing(null) }

  const onSubmit = async (formData) => {
    setSaving(true)
    try {
      if (editing) {
        await updateEducation(editing._id, formData)
        toast.success('Education updated!')
      } else {
        await createEducation(formData)
        toast.success('Education added!')
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
      await deleteEducation(confirm)
      toast.success('Education deleted')
      setConfirm(null)
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Spinner center />

  return (
    <div>
      <PageHeader
        title="Education"
        subtitle={`${items.length} education entr${items.length !== 1 ? 'ies' : 'y'}`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <HiPlus size={15} /> Add Education
          </button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={HiAcademicCap}
          title="No education entries yet"
          message="Add your degree, diploma, or certification courses."
          actionLabel="Add Education"
          onAction={openAdd}
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="card hover:border-yellow-500/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <HiAcademicCap size={16} className="text-yellow-400 flex-shrink-0" />
                    <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{item.degree}</h3>
                  </div>
                  <p className="text-sm font-medium text-yellow-400 mb-1">{item.institution}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: 'var(--text-m)' }}>
                    <span>{item.duration}</span>
                    {item.score && (
                      <>
                        <span style={{ color: 'var(--border)' }}>·</span>
                        <span className="font-semibold text-green-400">{item.score}</span>
                      </>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs mt-2" style={{ color: 'var(--text-m)' }}>{item.description}</p>
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
        title={editing ? 'Edit Education' : 'Add Education'}>
        <EducationForm
          defaultValues={editing || { order: 0 }}
          onSubmit={onSubmit} loading={saving}
        />
      </Modal>

      <ConfirmDialog
        open={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={onDelete} loading={deleting}
        title="Delete Education"
        message="This will permanently remove this education entry."
      />
    </div>
  )
}
