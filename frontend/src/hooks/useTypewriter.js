import { useState, useEffect } from 'react'

export function useTypewriter(words, speed = 80, pause = 1800) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    if (!deleting && subIndex === words[index].length) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }
    if (deleting && subIndex === 0) {
      setDeleting(false)
      setIndex(i => (i + 1) % words.length)
      return
    }
    const t = setTimeout(() => {
      setSubIndex(s => s + (deleting ? -1 : 1))
      setText(words[index].substring(0, subIndex + (deleting ? -1 : 1)))
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(t)
  }, [subIndex, deleting, index, words, speed, pause])

  return text
}
