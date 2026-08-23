import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiPlus, HiTrash } from 'react-icons/hi'
import { getAbout, updateAbout } from '../api/services.js'
import { notifyPortfolioUpdated } from '../utils/broadcast.js'
import PageHeader from '../components/PageHeader.jsx'
import Spinner    from '../components/Spinner.jsx'

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      bio:          '',
      location:     '',
      email:        '',
      phone:        '',
      highlights:   [{ value: '' }],
      learning:     [{ value: '' }],
    },
  })

  const { fields: highlightFields, append: addHighlight, remove: removeHighlight } =
    useFieldArray({ control, name: 'highlights' })
  const { fields: learningFields, append: addLearning, remove: removeLearning } =
    useFieldArray({ control, name: 'learning' })

  useEffect(() => {
    getAbout()
      .then(r => {
        const d = r.data
        reset({
          bio:        d.bio       || '',
          location:   d.location  || '',
          email:      d.email     || '',
          phone:      d.phone     || '',
          highlights: d.highlights?.length ? d.highlights.map(v => ({ value: v })) : [{ value: '' }],
          learning:   d.learning?.length   ? d.learning.map(v => ({ value: v }))   : [{ value: '' }],
        })
      })
      .catch(() => toast.error('Failed to load about data'))
      .finally(() => setLoading(false))
  }, [reset])

  const onSubmit = async (formData) => {
    setSaving(true)
    try {
      await updateAbout({
        bio:        formData.bio,
        location:   formData.location,
        email:      formData.email,
        phone:      formData.phone,
        highlights: formData.highlights.map(h => h.value).filter(Boolean),
        learning:   formData.learning.map(l => l.value).filter(Boolean),
      })
      toast.success('About section updated!')
      notifyPortfolioUpdated()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner center />

  return (
    <div>
      <PageHeader title="About Section" subtitle="Edit your bio, personal information, and focus areas." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

        {/* Bio */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Biography</h3>
          <div>
            <label className="label">About Me (bio text)</label>
            <textarea className="input resize-none" rows={5}
              placeholder="I'm a B.Tech Computer Science student and Full Stack Developer..."
              {...register('bio')} />
          </div>
        </div>

        {/* Personal info */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Personal Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="Ghaziabad, India" {...register('location')} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@email.com" {...register('email')} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" placeholder="+91 9999999999" {...register('phone')} />
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Highlights</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-m)' }}>Key bullet points shown in the about section</p>
            </div>
            <button type="button" onClick={() => addHighlight({ value: '' })}
              className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
              <HiPlus size={13} /> Add
            </button>
          </div>
          {highlightFields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input className="input flex-1"
                placeholder="e.g. 🎓 B.Tech CS, KIET (2023–2027)"
                {...register(`highlights.${i}.value`)} />
              {highlightFields.length > 1 && (
                <button type="button" onClick={() => removeHighlight(i)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
                  <HiTrash size={15} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Currently learning */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Currently Focused On</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-m)' }}>Tags shown in the about section cards</p>
            </div>
            <button type="button" onClick={() => addLearning({ value: '' })}
              className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
              <HiPlus size={13} /> Add
            </button>
          </div>
          {learningFields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input className="input flex-1"
                placeholder="e.g. Full Stack Development"
                {...register(`learning.${i}.value`)} />
              {learningFields.length > 1 && (
                <button type="button" onClick={() => removeLearning(i)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
                  <HiTrash size={15} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving && <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
          {saving ? 'Saving…' : 'Save About Section'}
        </button>
      </form>
    </div>
  )
}
