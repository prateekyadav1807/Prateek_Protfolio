import { useEffect, useRef } from 'react'

export default function CursorSpotlight() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const move = (e) => {
      el.style.left = e.clientX + 'px'
      el.style.top = e.clientY + 'px'
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-0 hidden lg:block"
      style={{
        width: 400,
        height: 400,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(234,179,8,0.07) 0%, transparent 70%)',
        transition: 'left 0.08s ease, top 0.08s ease',
      }}
    />
  )
}
