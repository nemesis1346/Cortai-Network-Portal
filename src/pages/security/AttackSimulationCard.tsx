import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui'
import { controlsApi, securityApi, type ChangeRecord, type SimulationScenario } from '@/api'
import { ChangeDetailDrawer } from '@/pages/controls/ChangeDetailDrawer'
import type { StepAnimState } from '@/hooks/useStepRunner'
import { useStepRunner } from '@/hooks/useStepRunner'

type Phase = 'idle' | 'running' | 'done'

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

function marker(animState: StepAnimState, tone: 'ok' | 'warn'): string {
  if (animState === 'pending') return '○'
  if (animState === 'running') return '◌'
  return tone === 'warn' ? '⚠' : '✓'
}

export function AttackSimulationCard() {
  const [scenario, setScenario] = useState<SimulationScenario | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [record, setRecord] = useState<ChangeRecord | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const { show: showToast } = useToast()

  useEffect(() => {
    securityApi.getSimulationScenario().then(setScenario)
  }, [])

  // Keep the same non-zero stepCount across 'running' -> 'done' so useStepRunner's
  // effect doesn't re-fire and reset the finished states back to empty.
  const stepStates = useStepRunner(phase === 'idle' ? 0 : (scenario?.steps.length ?? 0), 900)

  const run = async () => {
    if (!scenario) return
    setPhase('running')
    setRecord(null)
    const per = prefersReducedMotion() ? 80 : 900
    await new Promise((resolve) => setTimeout(resolve, scenario.steps.length * per + 300))
    const rec = await controlsApi.logContainment({
      title: scenario.journal_title,
      rationale: scenario.journal_rationale,
      steps: scenario.steps.map((s) => ({ state: s.tone === 'warn' ? 'warn' : 'ok', label: `${s.time} — ${s.description}` })),
      verify: scenario.verify,
    })
    setRecord(rec)
    setPhase('done')
    showToast('Simulation complete — contained in 3.1 s, blast radius zero')
  }

  const reset = () => {
    setPhase('idle')
    setRecord(null)
  }

  return (
    <div className="card" style={{ marginTop: 14 }}>
      <h3>
        Attack simulation — what if someone uses a camera port to get in?{' '}
        <span className="tagpill">DEMO — SAFE TO RUN</span>
      </h3>
      <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 12 }}>
        The classic physical attack: unplug an outdoor camera and plug a laptop into its network jack. This
        simulation replays exactly what the network does, second by second, if that happens at your loading dock
        tonight.
      </p>

      {phase === 'idle' && (
        <button className="btn primary" disabled={!scenario} onClick={run}>
          Run the simulation
        </button>
      )}

      {phase !== 'idle' && scenario && (
        <>
          <ul className="steps">
            {scenario.steps.map((step, i) => (
              <li key={i} className={stepStates[i] === 'done' ? (step.tone === 'warn' ? 'done warnf' : 'done') : stepStates[i] === 'running' ? 'run' : ''}>
                <span className="mk">{marker(stepStates[i] ?? 'pending', step.tone)}</span>
                <span>
                  <b style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--text-3)', marginRight: 8 }}>{step.time}</b>
                  {step.description}
                </span>
              </li>
            ))}
          </ul>

          {phase === 'done' && record && (
            <>
              <div className="dres ok" style={{ marginTop: 12 }}>
                {scenario.verdict}
              </div>
              <div className="guard-msg" dangerouslySetInnerHTML={{ __html: scenario.message_html }} />
              <div className="guard-btns" style={{ marginTop: 10 }}>
                <button className="btn" onClick={() => setShowDetail(true)}>
                  View the incident log entry
                </button>
                <button className="btn" onClick={reset}>
                  Reset
                </button>
              </div>
            </>
          )}
        </>
      )}

      <ChangeDetailDrawer record={showDetail ? record : null} onClose={() => setShowDetail(false)} onReverse={() => {}} />
    </div>
  )
}
