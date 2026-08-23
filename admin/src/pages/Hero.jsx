import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiPlus, HiTrash } from 'react-icons/hi'
import { getHero, updateHero } from '../api/services.js'
import { notifyPortfolioUpdated } from '../utils/broadcast.js'
import PageHeader  from '../components/PageHeader.jsx'
import FileUpload  from '../components/FileUpload.jsx'
import Spinner     from '../components/Spinner.jsx'

export default function HeroPage() {
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [photoFile,  setPhotoFile]  = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [heroData,   setHeroData]   = useState(null)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      name: '', tagline: '',
      roles: [{ value: '' }],
      github: '', linkedin: '', instagram: '',
      stats: [{ value: '', label: '' }],
    },
  })

  const { fields: roleFields, append: addRole, remove: removeRole } =
    useFieldArray({ control, name: 'roles' })
  const { fields: statFields, append: addStat, remove: removeStat } =
    useFieldArray({ control, name: 'stats' })

  useEffect(() => {
    getHero()
      .then(r => {
        const d = r.data
        setHeroData(d)
        reset({
          name:      d.name      || '',
          tagline:   d.tagline   || '',
          roles:     d.roles?.length ? d.roles.map(v => ({ value: v })) : [{ value: '' }],
          github:    d.github    || '',
          linkedin:  d.linkedin  || '',
          instagram: d.instagram || '',
          // Strip _id from stats so useFieldArray doesn't get confused
          stats: d.stats?.length
            ? d.stats.map(s => ({ value: s.value || '', label: s.label || '' }))
            : [{ value: '', label: '' }],
        })
      })
      .catch(() => toast.error('Failed to load hero data'))
      .finally(() => setLoading(false))
  }, [reset])

  const onSubmit = async (formData) => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name',      formData.name)
      fd.append('tagline',   formData.tagline)
      fd.append('github',    formData.github)
      fd.append('linkedin',  formData.linkedin)
      fd.append('instagram', formData.instagram)
      // Roles as JSON array
      fd.append('roles', JSON.stringify(formData.roles.map(r => r.value).filter(Boolean)))
      // Stats as JSON array
      fd.append('stats', JSON.stringify(formData.stats.filter(s => s.value && s.label)))
      if (photoFile)  fd.append('photo',  photoFile)
      if (resumeFile) fd.append('resume', resumeFile)

      await updateHero(fd)
      toast.success('Hero section updated!')
      notifyPortfolioUpdated()
      setPhotoFile(null)
      setResumeFile(null)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner center />

  return (
    <div>
      <PageHeader title="Hero Section" subtitle="Update your name, tagline, photo, and social links." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

        {/* Basic info */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>Basic Info</h3>

          <div>
            <label className="label">Full Name *</label>
            <input className={`input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Prateek Yadav"
              {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Tagline / Bio *</label>
            <textarea className="input resize-none" rows={3}
              placeholder="Full Stack Developer specializing in..."
              {...register('tagline', { required: 'Tagline is required' })} />
          </div>
        </div>

        {/* Roles (typewriter) */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
              Roles <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-m)' }}>(typewriter effect)</span>
            </h3>
            <button type="button" onClick={() => addRole({ value: '' })}
              className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
              <HiPlus size={13} /> Add Role
            </button>
          </div>
          {roleFields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input className="input flex-1" placeholder="e.g. Full Stack Developer"
                {...register(`roles.${i}.value`)} />
              {roleFields.length > 1 && (
                <button type="button" onClick={() => removeRole(i)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
                  <HiTrash size={15} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Stats Cards</h3>
            <button type="button" onClick={() => addStat({ value: '', label: '' })}
              className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
              <HiPlus size={13} /> Add Stat
            </button>
          </div>
          {statFields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input className="input w-28 flex-shrink-0" placeholder="Value e.g. 300+"
                {...register(`stats.${i}.value`)} />
              <input className="input flex-1" placeholder="Label e.g. DSA Problems"
                {...register(`stats.${i}.label`)} />
              {statFields.length > 1 && (
                <button type="button" onClick={() => removeStat(i)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
                  <HiTrash size={15} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Social links */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>Social Links</h3>
          {[
            { name: 'github',    label: 'GitHub URL',    placeholder: 'https://github.com/username' },
            { name: 'linkedin',  label: 'LinkedIn URL',  placeholder: 'https://linkedin.com/in/username' },
            { name: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/username' },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="label">{label}</label>
              <input className="input" placeholder={placeholder} {...register(name)} />
            </div>
          ))}
        </div>

        {/* Photo upload */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>Profile Photo</h3>
          <FileUpload
            label="Profile Picture (JPG / PNG / WebP)"
            value={heroData?.photo}
            onChange={setPhotoFile}
            accept="image/*"
            previewType="avatar"
          />
        </div>

        {/* Resume upload */}
        <div className="card">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>Resume PDF</h3>
          {heroData?.resumeUrl && (
            <p className="text-xs mb-3" style={{ color: 'var(--text-m)' }}>
              Current:{' '}
              <a href={heroData.resumeUrl} target="_blank" rel="noopener noreferrer"
                className="text-yellow-400 hover:underline">
                View current resume ↗
              </a>
            </p>
          )}
          <FileUpload
            label="Upload New Resume (PDF)"
            onChange={setResumeFile}
            accept="application/pdf,image/*"
            previewType="pdf"
          />
        </div>

        <button type="submit" disabled={saving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving && <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
          {saving ? 'Saving…' : 'Save Hero Section'}
        </button>
      </form>
    </div>
  )
}
