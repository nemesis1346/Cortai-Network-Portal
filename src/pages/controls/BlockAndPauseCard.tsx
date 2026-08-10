import { useEffect, useRef, useState } from 'react'
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
    <div className="card">
      <h3>Block a website</h3>
      <div className="blk-input">
        <input
          ref={domainInputRef}
          placeholder="e.g. bet365.com"
          value={domainInput}
          onChange={(e) => setDomainInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && block()}
        />
        <button className="btn primary" onClick={block}>
          Block
        </button>
      </div>
      <div className="chips">
        {domains?.map((domain) => (
          <span key={domain} className="chip">
            {domain} <button onClick={() => unblock(domain)}>✕</button>
          </span>
        ))}
      </div>
      <div className="gov-note">{BLOCK_PUSH_NOTE}</div>

      <h3 style={{ marginTop: 20 }}>Pause a device</h3>
      <div className="blk-input">
        <select className="devsel" style={{ flex: 1 }} value={selectedMac} onChange={(e) => setSelectedMac(e.target.value)}>
          {devices?.map((d) => (
            <option key={d.mac} value={d.mac}>
              {displayName(d)}
            </option>
          ))}
        </select>
        <button className="btn" disabled={!selectedMac} onClick={pause}>
          {PAUSE_BUTTON_LABEL}
        </button>
      </div>
      <div className="gov-note">
        Cuts internet access for that device only — useful for a misbehaving laptop or during an HR conversation.
        Auto-restores.
      </div>
    </div>
  )
}
