import { useEffect, useRef, useState } from 'react'
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Input, Select } from '@/components/ui-v2'
import { useToast } from '@/components/ui'
import { controlsApi, deviceApi, type Device } from '@/api'
import { displayName } from '@/pages/devices-awaiting/deviceDisplay'
import { useActionLauncher } from '@/shell/ActionLauncherContext'

interface BlockAndPauseCardProps {
  onChanged: () => void
}

const BLOCK_PUSH_NOTE =
  'Blocks push to the firewall in under 10 seconds and apply to every device on business VLANs. Guest network follows its own policy.'
const PAUSE_BUTTON_LABEL = 'Pause 1 h'

export function BlockAndPauseCard({ onChanged }: BlockAndPauseCardProps) {
  const [domains, setDomains] = useState<string[] | null>(null)
  const [domainInput, setDomainInput] = useState('')
  const [devices, setDevices] = useState<Device[] | null>(null)
  const [selectedMac, setSelectedMac] = useState('')
  const { show: showToast } = useToast()
  const domainInputRef = useRef<HTMLInputElement>(null)
  const { focusBlockInputRequested, consumeFocusBlockInput } = useActionLauncher()

  useEffect(() => {
    controlsApi.listBlockedDomains().then(setDomains)
    deviceApi.list({ status: 'approved' }).then((rows) => {
      setDevices(rows)
      setSelectedMac(rows[0]?.mac ?? '')
    })
  }, [])

  // Action Launcher's "Block a website" action lands here and just needs the input focused.
  useEffect(() => {
    if (!focusBlockInputRequested) return
    domainInputRef.current?.focus()
    consumeFocusBlockInput()
  }, [focusBlockInputRequested, consumeFocusBlockInput])

  const block = () => {
    const v = domainInput.trim().toLowerCase()
    if (!v) {
      showToast('Enter a domain to block')
      return
    }
    controlsApi.blockDomain(v).then((result) => {
      setDomains((prev) => [v, ...(prev ?? [])])
      setDomainInput('')
      showToast(result.outcomeMessage)
      onChanged()
    })
  }

  const unblock = (domain: string) => {
    controlsApi.unblockDomain(domain).then((result) => {
      setDomains((prev) => prev?.filter((d) => d !== domain) ?? null)
      showToast(result.outcomeMessage)
      onChanged()
    })
  }

  const pause = () => {
    const device = devices?.find((d) => d.mac === selectedMac)
    if (!device) return
    controlsApi.pauseDevice(device.mac, displayName(device)).then((result) => {
      showToast(result.outcomeMessage)
      onChanged()
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Block a website</CardTitle>
        </CardHeader>
        <CardBody fixed>
          <div className="field-row">
            <Input
              ref={domainInputRef}
              placeholder="e.g. bet365.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && block()}
            />
            <Button variant="secondary" onClick={block}>
              Block
            </Button>
          </div>
          <div className="chip-set">
            {domains?.map((domain) => (
              <Badge key={domain} variant="neutral" onRemove={() => unblock(domain)} removeLabel={`Unblock ${domain}`}>
                {domain}
              </Badge>
            ))}
          </div>
        </CardBody>
        <CardFooter>
          <p className="t-label c-tertiary">{BLOCK_PUSH_NOTE}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pause a device</CardTitle>
        </CardHeader>
        <CardBody fixed>
          <div className="field-row">
            <Select
              aria-label="Device"
              value={selectedMac}
              onChange={(e) => setSelectedMac(e.target.value)}
              options={(devices ?? []).map((d) => ({ value: d.mac, label: displayName(d) }))}
            />
            <Button variant="secondary" disabled={!selectedMac} onClick={pause}>
              {PAUSE_BUTTON_LABEL}
            </Button>
          </div>
        </CardBody>
        <CardFooter>
          <p className="t-label c-tertiary">
            Cuts internet access for that device only — useful for a misbehaving laptop or during an HR conversation.
            Auto-restores.
          </p>
        </CardFooter>
      </Card>
    </>
  )
}
