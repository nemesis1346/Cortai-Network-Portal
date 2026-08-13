import type { MonthlyReport, ReportApi } from './reportTypes'

const NETWORK_DELAY_MS = 280

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS))
}

const SEED_REPORT: MonthlyReport = {
  month: 'July 2026',
  grade: 'A',
  headline_html:
    'TownePlace Suites Vaughan · Prepared by COrtai Managed Services. Your network ran at <b>99.98% uptime</b>, we blocked <b>1,284 threats</b>, and resolved <b>6 issues</b> — 5 of them before anyone on site noticed.',
  kpis: [
    { label: 'Uptime', value: '99.98%', colorClass: 'green', sub: '8 min total, all overnight' },
    { label: 'Threats blocked', value: '1,284', colorClass: 'red', sub: '↑ 12% vs June' },
    { label: 'Avg response time', value: '12 min', sub: 'alert → engineer engaged' },
    { label: 'Issues resolved', value: '6', sub: '5 found by us, 1 reported' },
    { label: 'Patch compliance', value: '100%', colorClass: 'green', sub: 'firewall, switches, APs current' },
  ],
  highlights: [
    {
      message_html:
        '<b>Blocked 1,284 attacks</b> including 3 zero-day malware samples caught by cloud sandbox — none reached a device.',
    },
    {
      message_html:
        '<b>Kept you online through a Bell latency incident (Jul 12)</b> — automatic LTE failover, zero perceived downtime, credit claim filed on your behalf.',
    },
    {
      message_html:
        '<b>Detected loading-dock camera failure at 08:47 (Jul 17)</b>, dispatched remote PoE reset, replaced injector same day — before your morning shift needed footage.',
    },
    {
      message_html:
        '<b>Patched FortiOS across the stack</b> during the maintenance window, including the July security advisory — 4 days after release.',
    },
    {
      message_html:
        '<b>Flagged shadow IT</b> — a personal file-sync app on two laptops moving 40 GB/mo — and worked with your GM on policy.',
    },
    {
      message_html:
        '<b>Verified backups &amp; segmentation</b> — nightly config backups tested, camera and door-access VLANs confirmed isolated from guest and corporate traffic.',
    },
  ],
  comparison: [
    { label: 'Monitoring', us: '24/7, every device', telco: 'modem only' },
    { label: 'Security', us: 'NGFW, IPS, sandbox included', telco: '"buy antivirus"' },
    { label: 'Who finds problems', us: 'We do — before you', telco: 'You do, then wait on hold' },
    { label: 'Response', us: '12 min, named engineer', telco: 'days, ticket queue' },
    { label: 'ISP accountability', us: 'Evidence + credits filed', telco: 'they are the ISP' },
    { label: 'Reporting', us: 'This report, monthly', telco: 'an invoice' },
  ],
}

export const mockReportApi: ReportApi = {
  getMonthlyReport() {
    return delay(SEED_REPORT)
  },
  exportPdf() {
    return delay({ message: 'Report exported — branded PDF ready to share' })
  },
}
