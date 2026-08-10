import { useEffect, useState } from 'react'

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

export type StepAnimState = 'pending' | 'running' | 'done'

/**
 * Animates a list of step labels through pending -> running -> done, matching
 * runPlan's timing (620ms/step, 85%-through mark for the running->done flip,
 * 60ms under reduced motion — see mockControlsApi's PER_STEP_MS).
 */
export function useStepRunner(stepCount: number, perStepMs = 620): StepAnimState[] {
  const [states, setStates] = useState<StepAnimState[]>(() => Array(stepCount).fill('pending'))

  useEffect(() => {
    setStates(Array(stepCount).fill('pending'))
    if (stepCount === 0) return

    const per = prefersReducedMotion() ? 60 : perStepMs
    const timers: ReturnType<typeof setTimeout>[] = []

    for (let i = 0; i < stepCount; i++) {
      timers.push(
        setTimeout(() => {
          setStates((prev) => prev.map((s, idx) => (idx === i ? 'running' : s)))
        }, i * per),
      )
      timers.push(
        setTimeout(
          () => {
            setStates((prev) => prev.map((s, idx) => (idx === i ? 'done' : s)))
          },
          i * per + per * 0.85,
        ),
      )
    }

    return () => timers.forEach(clearTimeout)
  }, [stepCount, perStepMs])

  return states
}
