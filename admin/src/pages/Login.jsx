import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import { login } from '../api/services.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { loginAdmin } = useAuth()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await login(data)
      // loginAdmin sets admin state → GuestRoute sees admin is truthy
      // → automatically redirects to "/" without a manual navigate()
      loginAdmin(res.data.token, res.data.admin)
      toast.success('Welcome back!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 mb-4">
            <HiLockClosed size={24} className="text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            PY <span className="text-yellow-400">Admin</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-m)' }}>
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className={`input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="admin@example.com"
                autoComplete="off"
                {...register('email', {
                  required: 'Email is required',
                })}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className={`input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  autoComplete="off"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-m)' }}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 mt-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-m)' }}>
          Admin access only. If this is your first time,{' '}
          <span className="text-yellow-400">register via API</span>.
        </p>
      </div>
    </div>
  )
}
