export default function Spinner({ size = 'md', center = false }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  const el = (
    <div className={`${sizes[size]} border-2 border-yellow-400 border-t-transparent rounded-full animate-spin`} />
  )
  if (center) return <div className="flex items-center justify-center py-12">{el}</div>
  return el
}
