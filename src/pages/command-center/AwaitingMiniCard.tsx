import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/components/ui'
import { deviceApi, type Device } from '@/api'
import { connectionLabel, deviceIcon, formatFirstSeen } from '@/pages/devices-awaiting/deviceDisplay'

interface AwaitingMiniCardProps {
  onNavigate: (tab: string) => void
}

export function AwaitingMiniCard({ onNavigate }: AwaitingMiniCardProps) {
  const [devices, setDevices] = useState<Device[] | null>(null)
  const { show: showToast } = useToast()

  const load = useCallback(() => {
    deviceApi.list({ status: 'awaiting' }).then(setDevices)
  }, [])

  useEffect(() => load(), [load])

  if (!devices || devices.length === 0) return null

  const block = (mac: string) => {
    deviceApi.block(mac).then((result) => {
      showToast(result.outcomeMessage)
      load()
    })
  }

  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <h3>
        Devices awaiting registration <span className="tagpill">{devices.length} HELD</span>
      </h3>
      {devices.map((device) => (
        <div key={device.mac} className="reg-row">
          <div className="reg-ic">{deviceIcon(device)}</div>
          <div className="reg-main">
            <div className="reg-t">Looks like: {device.inferred_type}</div>
            <div className="reg-meta">
              {connectionLabel(device)} · {device.mac} ({device.vendor}) · first seen{' '}
              {formatFirstSeen(device.first_seen)}
            </div>
            {device.suggested_name && (
              <div className="reg-sug">
                Guardian suggests: <b>&quot;{device.suggested_name}&quot;</b>
              </div>
            )}
          </div>
          <div className="reg-btns">
            <button className="btn primary" onClick={() => onNavigate('network')}>
              Review
            </button>
            <button className="btn danger" onClick={() => block(device.mac)}>
              Block
            </button>
          </div>
        </div>
      ))}
      <div className="reg-note">
        <span className="lock">⛨</span>Quarantine-first is ON — unknown devices get no internet or LAN
        access until you approve them. They can only request an address and wait.
      </div>
    </div>
  )
}
