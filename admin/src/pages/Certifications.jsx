import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiBadgeCheck, HiExternalLink } from 'react-icons/hi'
import {
  getCertifications, createCertification, updateCertification, deleteCertification,
} from '../api/services.js'
import PageHeader    from '../components/PageHeader.jsx'
import Modal         from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState    from '../components/EmptyState.jsx'
import FileUpload    from '../components/FileUpload.jsx'
import Spinner       from '../components/Spinner.jsx'

function CertForm({ defaultValues, onSubmit, loading }) {
  const [imageFile, setImageFile] = useState(null)
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  const submit = (data) => onSubmit(data, imageFile)

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="label">Certification Name *</label>
        <input className={`input ${errors.name ? 'border-red-500' : ''}`}
          placeholder="AWS Certified Cloud Practitioner"
          {...register('name', { required: 'Name is required' })} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Issuing Organization *</label>
          <input className={`input ${errors.organization ? 'border-red-500' : ''}`}
            placeholder="Amazon Web Services"
            {...register('organization', { required: 'Organization is required' })} />
          {errors.organization && <p className="text-red-400 text-xs mt-1">{errors.organization.message}</p>}
        </div>
        <div>
          <label className="label">Date Earned</label>
          <input className="input" type="month" {...register('date')} />
        </div>
      </div>

      <div>
        <label className="label">Credential URL</label>
        <input className="input" type="url"
          placeholder="https://www.credly.com/badges/..."
          {...register('link')} />
      </div>

      <FileUpload
        label="Badge / Certificate Image"
        value={defaultValues?.image}
        onChange={setImageFile}
        accept="image/*"
      />

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {loading && <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
          {defaultValues?._id ? 'Update Certification' : 'Add Certification'}
        </button>
      </div>
    </form>
  )
}

export default function CertificationsPage() {
  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [confirm,  setConfirm]  = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () =>
    getCertifications()
      .then(r => setItems(r.data))
      .catch(() => toast.error('Failed to load certifications'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openAdd    = () => { setEditing(null); setModal(true) }
  const openEdit   = (c)  => { setEditing(c);  setModal(true) }
  const closeModal = () => { setModal(false);  setEditing(null) }

  const onSubmit = async (formData, imageFile) => {
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => { if (v !== undefined) fd.append(k, v) })
      if (imageFile) fd.append('image', imageFile)

      if (editing) {
        await updateCertification(editing._id, fd)
        toast.success('Certification updated!')
      } else {
        await createCertification(fd)
        toast.success('Certification added!')
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
      await deleteCertification(confirm)
      toast.success('Certification deleted')
      setConfirm(null)
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  // Format month input: YYYY-MM → "YYYY-MM" for input, readable for display
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return ''
    // if it's already "YYYY-MM" pass it through
    if (/^\d{4}-\d{2}$/.test(dateStr)) return dateStr
    // if it's a full ISO date
    return new Date(dateStr).toISOString().slice(0, 7)
  }

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return ''
    try {
      return new Date(dateStr + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    } catch { return dateStr }
  }

  if (loading) return <Spinner center />

  return (
    <div>
      <PageHeader
        title="Certifications"
        subtitle={`${items.length} certification${items.length !== 1 ? 's' : ''}`}
        action={
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <HiPlus size={15} /> Add Certification
          </button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={HiBadgeCheck}
          title="No certifications yet"
          message="Add your professional certifications and credentials."
          actionLabel="Add Certification"
          onAction={openAdd}
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((cert) => (
            <div key={cert._id} className="card hover:border-yellow-500/20 transition-colors flex flex-col gap-3">
              {cert.image && (
                <img src={cert.image} alt={cert.name}
                  className="w-14 h-14 object-contain rounded-xl"
                  style={{ border: '1px solid var(--border)' }} />
              )}
              {!cert.image && (
                <div className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
                  <HiBadgeCheck size={28} className="text-yellow-400" />
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-semibold text-sm leading-snug mb-1" style={{ color: 'var(--text)' }}>
                  {cert.name}
                </h3>
                <p className="text-xs text-yellow-400 font-medium mb-0.5">{cert.organization}</p>
                {cert.date && (
                  <p className="text-xs" style={{ color: 'var(--text-m)' }}>
                    {formatDateForDisplay(cert.date)}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1"
                style={{ borderTop: '1px solid var(--border)' }}>
                {cert.link ? (
                  <a href={cert.link} target="_blank" rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 text-yellow-400 hover:text-yellow-300">
                    <HiExternalLink size={12} /> View Credential
                  </a>
                ) : <div />}
                <div className="flex gap-1">
                  <button onClick={() => openEdit({ ...cert, date: formatDateForInput(cert.date) })}
                    className="p-1.5 rounded-lg hover:bg-yellow-400/10 text-yellow-400 transition-colors">
                    <HiPencil size={13} />
                  </button>
                  <button onClick={() => setConfirm(cert._id)}
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
        title={editing ? 'Edit Certification' : 'Add Certification'}>
        <CertForm defaultValues={editing || {}} onSubmit={onSubmit} loading={saving} />
      </Modal>

      <ConfirmDialog
        open={!!confirm} onClose={() => setConfirm(null)}
        onConfirm={onDelete} loading={deleting}
        title="Delete Certification"
        message="This will permanently remove this certification."
      />
    </div>
  )
}
