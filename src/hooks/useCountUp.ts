import { useEffect, useState } from 'react'

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Ease-out-cubic count-up to `target`. Instant if target is null or the OS prefers reduced motion. */
export function useCountUp(target: number | null, ms = 1100): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === null) return
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }
    let frame: number
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / ms)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, ms])

  return value
}
