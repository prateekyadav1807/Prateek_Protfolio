import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiStar } from 'react-icons/hi'
import {
  getAchievements, createAchievement, updateAchievement, deleteAchievement,
} from '../api/services.js'
import PageHeader    from '../components/PageHeader.jsx'
import Modal         from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState    from '../components/EmptyState.jsx'
import Spinner       from '../components/Spinner.jsx'

function AchievementForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Title *</label>
        <input className={`input ${errors.title ? 'border-red-500' : ''}`}
          placeholder="300+ DSA Problems Solved"
          {...register('title', { required: 'Title is required' })} />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={2}
          placeholder="Brief description of this achievement..."
          {...register('description')} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Stat Value</label>
          <input className="input" placeholder="300+" {...register('value')} />
          <p className="text-xs mt-1" style={{ color: 'var(--text-m)' }}>Shown in stat counter</p>
        </div>
        <div>
          <label className="label">Icon (emoji)</label>
          <input className="input" placeholder="💻" {...register('icon')} />
        </div>
        <div>
          <label className="label">Display Order</label>
          <input className="input" type="number" placeholder="0"
            {...register('order', { valueAsNumber: true })} />
        </div>
      </div>

      <div>
        <label className="label">Date</label>
        <input className="input" type="month" {...register('date')} />
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {loading && <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
          {defaultValues?._id ? 'Update Achievement' : 'Add Achievement'}
        </button>
      </div>
    </form>
  )
}

export default function AchievementsPage() {
  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [confirm,  setConfirm]  = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () =>
    getAchievements()
      .then(r => setItems(r.data))
      .catch(() => toast.error('Failed to load achievements'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openAdd    = () => { setEditing(null); setModal(true) }
  const openEdit   = (a)  => { setEditing(a);  setModal(true) }
  const closeModal = () => { setModal(false);  setEditing(null) }

  const onSubmit = async (formData) => {
    setSaving(true)
    try {
      if (editing) {
        await updateAchievement(editing._id, formData)
        toast.success('Achievement updated!')
      } else {
        await createAchievement(formData)
        toast.success('Achievement added!')
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
      await deleteAchievement(confirm)
      toast.success('Achievement deleted')
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
        title="Achievements"
        subtitle={`${items.length} achievement${items.length !== 1 ? 's' : ''}`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <HiPlus size={15} /> Add Achievement
          </button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={HiStar}
          title="No achievements yet"
          message="Add milestones, stats, and notable accomplishments."
          actionLabel="Add Achievement"
          onAction={openAdd}
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="card hover:border-yellow-500/20 transition-colors flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {item.icon && <span className="text-2xl">{item.icon}</span>}
                  <div>
                    {item.value && (
                      <p className="text-xl font-extrabold font-mono text-yellow-400 leading-none mb-0.5">
                        {item.value}
                      </p>
                    )}
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{item.title}</h3>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-yellow-400/10 text-yellow-400 transition-colors">
                    <HiPencil size={13} />
                  </button>
                  <button onClick={() => setConfirm(item._id)}
                    className="p-1.5 rounded-lg hover:bg-red-400/10 text-red-400 transition-colors">
                    <HiTrash size={13} />
                  </button>
                </div>
              </div>
              {item.description && (
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-m)' }}>
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={closeModal}
        title={editing ? 'Edit Achievement' : 'Add Achievement'}>
        <AchievementForm
          defaultValues={editing || { order: 0 }}
          onSubmit={onSubmit} loading={saving}
        />
      </Modal>

      <ConfirmDialog
        open={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={onDelete} loading={deleting}
        title="Delete Achievement"
        message="This will permanently remove this achievement."
      />
    </div>
  )
}
