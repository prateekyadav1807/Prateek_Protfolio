import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getContact, updateContact } from '../api/services.js'
import { notifyPortfolioUpdated } from '../utils/broadcast.js'
import PageHeader from '../components/PageHeader.jsx'
import Spinner    from '../components/Spinner.jsx'

export default function ContactPage() {
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: '', phone: '', location: '',
      github: '', linkedin: '', instagram: '', twitter: '',
    },
  })

  useEffect(() => {
    getContact()
      .then(r => reset(r.data))
      .catch(() => toast.error('Failed to load contact data'))
      .finally(() => setLoading(false))
  }, [reset])

  const onSubmit = async (formData) => {
    setSaving(true)
    try {
      await updateContact(formData)
      toast.success('Contact section updated!')
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
      <PageHeader
        title="Contact Section"
        subtitle="Update your contact details and social media links shown on the portfolio."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

        {/* Contact details */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Contact Details</h3>

          <div>
            <label className="label">Email Address</label>
            <input className={`input ${errors.email ? 'border-red-500' : ''}`}
              type="email" placeholder="you@email.com"
              {...register('email', {})} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Phone Number</label>
              <input className="input" placeholder="+91 9999999999" {...register('phone')} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="Ghaziabad, India" {...register('location')} />
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Social Media Links</h3>

          {[
            { name: 'github',    label: 'GitHub',    placeholder: 'https://github.com/username' },
            { name: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/username' },
            { name: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
            { name: 'twitter',   label: 'Twitter / X', placeholder: 'https://x.com/username' },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="label">{label}</label>
              <input className="input" placeholder={placeholder}
                {...register(name)} />
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving && <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
          {saving ? 'Saving…' : 'Save Contact Section'}
        </button>
      </form>
    </div>
  )
}
