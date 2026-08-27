import { useCallback, useEffect, useState } from 'react'
import { Badge, Card, CardHeader, CardTitle } from '@/components/ui-v2'
import { useToast } from '@/components/ui'
import { controlsApi, type ChangeRecord, type TriageResult } from '@/api'
import type { ScreenProps } from '@/shell/nav-data'
import { BlockAndPauseCard } from './BlockAndPauseCard'
import { ChangeDetailModal } from './ChangeDetailModal'
import { GuardianForm } from './GuardianForm'
import { GuardianReplyCard } from './GuardianReplyCard'
import { NetworkPoliciesCard } from './NetworkPoliciesCard'
import { RecentChangesCard } from './RecentChangesCard'
import { TierRail } from './TierRail'
import { TrySuggestions } from './TrySuggestions'

export function Controls(_props: ScreenProps) {
  const [text, setText] = useState('')
  const [triaging, setTriaging] = useState(false)
  const [triage, setTriage] = useState<TriageResult | null>(null)
  const [running, setRunning] = useState(false)
  const [record, setRecord] = useState<ChangeRecord | null>(null)

  const [changes, setChanges] = useState<ChangeRecord[] | null>(null)
  const [detailNum, setDetailNum] = useState<number | null>(null)

  const { show: showToast } = useToast()

  const reloadChanges = useCallback(() => {
    controlsApi.listChanges().then(setChanges)
  }, [])

  useEffect(() => reloadChanges(), [reloadChanges])

  const closeGuard = () => {
    setTriage(null)
    setRecord(null)
    setRunning(false)
  }

  const handleTriage = (description: string) => {
    setTriaging(true)
    setRecord(null)
    setRunning(false)
    controlsApi.triage(description).then((result) => {
      setTriage(result)
      setTriaging(false)
    })
  }

  const handleRun = () => {
    if (!triage?.intent) return
    setRunning(true)
    controlsApi.runChange(triage).then((rec) => {
      setRecord(rec)
      setRunning(false)
      reloadChanges()
      if (rec.diagnosis) {
        showToast(
          rec.diagnosis.tone === 'ok'
            ? 'Resolved — root cause documented in the log'
            : rec.diagnosis.tone === 'ask'
              ? 'Diagnosed — waiting on your decision'
              : 'Handled — see the findings above',
        )
      } else {
        showToast(rec.passwordReveal ? 'Rotated & verified — passphrase shown above, poster ready' : 'Applied and verified — rollback available in one tap')
      }
    })
  }

  const handleSchedule = () => {
    if (!triage) return
    controlsApi.scheduleChange(triage).then(() => {
      closeGuard()
      reloadChanges()
      showToast('Scheduled for 4:00 AM — new passphrase and QR poster ready before the morning shift')
    })
  }

  const handleSendToEngineer = () => {
    if (!triage) return
    const isWorkOrder = triage.tier === 4
    controlsApi.submitToEngineer(triage).then(() => {
      closeGuard()
      reloadChanges()
      showToast(isWorkOrder ? "Work order opened — we'll call to schedule the visit" : "Submitted with Guardian's prepared change plan attached")
    })
  }

  const handleUnblock = () => {
    if (!triage) return
    controlsApi.unblockFromDiagnosis(triage.description).then(() => {
      closeGuard()
      reloadChanges()
      showToast('Unblocked for the staff VLAN — live in 8 s, logged as a policy exception')
    })
  }

  const handleKeepBlocked = () => {
    closeGuard()
    showToast('No exception created — policy stays as-is')
  }

  const handleReverse = (num: number) => {
    controlsApi.reverseChange(num).then((rec) => {
      reloadChanges()
      setDetailNum(num)
      if (record?.num === num) closeGuard()
      showToast(rec.revNote ?? 'Change reversed.')
    })
  }

  const detailRecord = changes?.find((c) => c.num === detailNum) ?? null

  const pickSuggestion = (suggestionText: string) => {
    setText(suggestionText)
    handleTriage(suggestionText)
  }

  return (
    <>
      <div className="row" style={{ gridTemplateColumns: 'minmax(0,1fr)', flex: '0 0 auto' }}>
        <Card data-step={triage ? 'active' : 'default'}>
          <CardHeader>
            <CardTitle>Make a change</CardTitle>
            <span className="spacer" />
            <Badge variant="neutral">Guardian Triage · Four-Tier Model</Badge>
          </CardHeader>
          <TierRail activeTier={triage?.tier ?? null} />
          <TrySuggestions onPick={pickSuggestion} submitting={triaging} />
          {triage && (
            <GuardianReplyCard
              triage={triage}
              running={running}
              record={record}
              onRun={handleRun}
              onSchedule={handleSchedule}
              onSendToEngineer={handleSendToEngineer}
              onUnblock={handleUnblock}
              onKeepBlocked={handleKeepBlocked}
              onReverse={handleReverse}
              onViewInLog={setDetailNum}
              onClose={closeGuard}
            />
          )}
          <GuardianForm
            text={text}
            onTextChange={setText}
            onTriage={handleTriage}
            onEmpty={() => showToast('Describe what you need first')}
            submitting={triaging}
          />
        </Card>
      </div>

      <div className="row" style={{ gridTemplateColumns: '535fr 535fr 500fr', flex: '0 0 auto', minBlockSize: 481 }}>
        <NetworkPoliciesCard onChanged={reloadChanges} />
        <div className="stack stack--split">
          <BlockAndPauseCard onChanged={reloadChanges} />
        </div>
        <RecentChangesCard changes={changes} onOpen={setDetailNum} />
      </div>

      <ChangeDetailModal record={detailRecord} onClose={() => setDetailNum(null)} onReverse={handleReverse} />
    </>
  )
}
