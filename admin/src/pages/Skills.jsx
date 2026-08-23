import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiCode } from 'react-icons/hi'
import {
  getSkills, createSkill, updateSkill, deleteSkill,
} from '../api/services.js'
import { notifyPortfolioUpdated } from '../utils/broadcast.js'
import PageHeader     from '../components/PageHeader.jsx'
import Modal          from '../components/Modal.jsx'
import ConfirmDialog  from '../components/ConfirmDialog.jsx'
import EmptyState     from '../components/EmptyState.jsx'
import Spinner        from '../components/Spinner.jsx'

const CATEGORIES = [
  'Frontend', 'Backend', 'Database', 'Cloud & Tools',
  'Languages', 'Core CS', 'DevOps', 'Other',
]

function SkillForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Skill Name *</label>
          <input className={`input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="e.g. React.js"
            {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label">Category *</label>
          <select className="input" {...register('category', { required: true })}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Icon (emoji or text)</label>
          <input className="input" placeholder="e.g. ⚛️ or React" {...register('icon')} />
        </div>
        <div>
          <label className="label">Proficiency Level (0–100)</label>
          <input className="input" type="number" min={0} max={100}
            placeholder="85" {...register('level', { min: 0, max: 100, valueAsNumber: true })} />
        </div>
      </div>

      <div>
        <label className="label">Display Order</label>
        <input className="input" type="number" placeholder="0"
          {...register('order', { valueAsNumber: true })} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {loading && <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
          {defaultValues?._id ? 'Update Skill' : 'Add Skill'}
        </button>
      </div>
    </form>
  )
}

export default function SkillsPage() {
  const [skills,  setSkills]  = useState([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState(null)     // skill object | null
  const [confirm, setConfirm] = useState(null)     // skill._id to delete
  const [deleting, setDeleting] = useState(false)

  const load = () =>
    getSkills()
      .then(r => setSkills(r.data))
      .catch(() => toast.error('Failed to load skills'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openAdd  = () => { setEditing(null); setModal(true) }
  const openEdit = (s)  => { setEditing(s);  setModal(true) }
  const closeModal = () => { setModal(false); setEditing(null) }

  const onSubmit = async (formData) => {
    setSaving(true)
    try {
      if (editing) {
        await updateSkill(editing._id, formData)
        toast.success('Skill updated!')
      } else {
        await createSkill(formData)
        toast.success('Skill added!')
      }
      closeModal()
      notifyPortfolioUpdated()
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
      await deleteSkill(confirm)
      toast.success('Skill deleted')
      setConfirm(null)
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  // Group skills by category for display
  const grouped = skills.reduce((acc, s) => {
    ;(acc[s.category] = acc[s.category] || []).push(s)
    return acc
  }, {})

  if (loading) return <Spinner center />

  return (
    <div>
      <PageHeader
        title="Skills"
        subtitle={`${skills.length} skill${skills.length !== 1 ? 's' : ''} across ${Object.keys(grouped).length} categories`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <HiPlus size={15} /> Add Skill
          </button>
        }
      />

      {skills.length === 0 ? (
        <EmptyState
          icon={HiCode}
          title="No skills yet"
          message="Add your first skill to get started."
          actionLabel="Add Skill"
          onAction={openAdd}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="card">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                {category}
                <span className="text-xs font-normal" style={{ color: 'var(--text-m)' }}>
                  ({items.length})
                </span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Skill', 'Icon', 'Level', 'Order', ''].map(h => (
                        <th key={h} className="text-left py-2 px-2 text-xs font-medium"
                          style={{ color: 'var(--text-m)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(skill => (
                      <tr key={skill._id}
                        className="transition-colors"
                        style={{ borderBottom: '1px solid var(--border)' }}
                      >
                        <td className="py-2.5 px-2 font-medium" style={{ color: 'var(--text)' }}>
                          {skill.name}
                        </td>
                        <td className="py-2.5 px-2" style={{ color: 'var(--text-m)' }}>
                          {skill.icon || '—'}
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full overflow-hidden"
                              style={{ background: 'var(--border)' }}>
                              <div className="h-full bg-yellow-400 rounded-full"
                                style={{ width: `${skill.level || 0}%` }} />
                            </div>
                            <span className="text-xs" style={{ color: 'var(--text-m)' }}>
                              {skill.level ?? 0}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-xs" style={{ color: 'var(--text-m)' }}>
                          {skill.order ?? 0}
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => openEdit(skill)}
                              className="p-1.5 rounded-lg hover:bg-yellow-400/10 text-yellow-400 transition-colors"
                              title="Edit">
                              <HiPencil size={13} />
                            </button>
                            <button onClick={() => setConfirm(skill._id)}
                              className="p-1.5 rounded-lg hover:bg-red-400/10 text-red-400 transition-colors"
                              title="Delete">
                              <HiTrash size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal
        open={modal}
        onClose={closeModal}
        title={editing ? 'Edit Skill' : 'Add New Skill'}
      >
        <SkillForm
          defaultValues={editing || { category: CATEGORIES[0], level: 80, order: 0 }}
          onSubmit={onSubmit}
          loading={saving}
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={onDelete}
        loading={deleting}
        title="Delete Skill"
        message="This will permanently remove this skill from your portfolio."
      />
    </div>
  )
}
