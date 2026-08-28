import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui'
import { controlsApi, securityApi, type ChangeRecord, type SimulationScenario } from '@/api'
import { ChangeDetailModal } from '@/pages/controls/ChangeDetailModal'
import {
  Badge,
  Button,
  Checklist,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalFoot,
  ModalHead,
  ModalRule,
  ModalTitle,
  type ChecklistItem,
} from '@/components/ui-v2'
import { useStepRunner } from '@/hooks/useStepRunner'

type Phase = 'idle' | 'running' | 'done'

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

interface AttackSimulationCardProps {
  open: boolean
  onClose: () => void
}

export function AttackSimulationCard({ open, onClose }: AttackSimulationCardProps) {
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

  const close = () => {
    reset()
    onClose()
  }

  const checklistItems: ChecklistItem[] =
    scenario?.steps.map((step, i) => {
      if (phase === 'idle') return { label: step.description, state: 'pending' }
      const animState = stepStates[i] ?? 'pending'
      if (animState === 'done') return { label: step.description, state: step.tone === 'warn' ? 'warn' : 'done' }
      return { label: step.description, state: animState }
    }) ?? []

  return (
    <>
      <Modal open={open} onClose={close} size="sm" label="Attack simulation">
        <ModalHead>
          <ModalTitle>Attack simulation</ModalTitle>
          <span className="spacer" />
          <IconButton variant="ghost" size="sm" aria-label="Close" onClick={close}>
            <Icon name="x" />
          </IconButton>
        </ModalHead>
        <ModalRule />

        <ModalBody>
          <Badge variant="info">DEMO — SAFE TO RUN</Badge>
          <p className="t-h3 c-primary">What if someone uses a camera port to get in?</p>
          <p className="t-body-sm c-tertiary">
            The classic physical attack: unplug an outdoor camera and plug a laptop into its network jack. This
            simulation replays exactly what the network does, second by second, if that happens at your loading dock
            tonight.
          </p>

          {phase !== 'idle' && scenario && (
            <>
              <Checklist items={checklistItems} />
              {phase === 'done' && record && (
                <>
                  <p className="t-body c-primary">
                    <b>{scenario.verdict}</b>
                  </p>
                  <p className="t-body-sm c-tertiary" dangerouslySetInnerHTML={{ __html: scenario.message_html }} />
                </>
              )}
            </>
          )}
        </ModalBody>

        <ModalFoot>
          {phase === 'idle' && (
            <Button variant="primary" size="sm" disabled={!scenario} onClick={run}>
              Run the simulation
            </Button>
          )}
          {phase === 'done' && record && (
            <>
              <Button variant="secondary" size="sm" onClick={() => setShowDetail(true)}>
                View the incident log entry
              </Button>
              <Button variant="secondary" size="sm" onClick={reset}>
                Reset
              </Button>
            </>
          )}
          <Button variant="secondary" size="sm" onClick={close}>
            Close
          </Button>
        </ModalFoot>
      </Modal>

      <ChangeDetailModal record={showDetail ? record : null} onClose={() => setShowDetail(false)} onReverse={() => {}} />
    </>
  )
}
