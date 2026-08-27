import type { ClusterNode, InfraNode } from '@/api'
import { DOTS, LINKS, NODE_CARDS } from './topologyLayout'
import { TopologyNode } from './TopologyNode'

interface TopologyCanvasProps {
  infraNodes: InfraNode[]
  clusterNodes: ClusterNode[]
  selectedKey: string | null
  onSelect: (key: string) => void
}

export function TopologyCanvas({ infraNodes, clusterNodes, selectedKey, onSelect }: TopologyCanvasProps) {
  return (
    <article className="card card--plain">
      <div className="topo-wrap">
        <span className="topology__grid" aria-hidden="true" />
        <p className="topo-hint">Click any node to expand · click a device for full detail</p>

        <div className="topo-scroll v2-scrollbars" tabIndex={0} role="group" aria-label="Network diagram">
          <div className="topo-canvas">
            <svg className="topo-canvas__links" viewBox="0 0 1160 830" aria-hidden="true">
              <g fill="none" strokeWidth={1.6}>
                {LINKS.map((link, i) => (
                  <path key={i} className={`topology__link topology__link--${link.kind}`} d={link.d} />
                ))}
              </g>
              <g>
                {DOTS.map((dot, i) =>
                  dot.shape === 'rect' ? (
                    <rect
                      key={i}
                      x={dot.x}
                      y={dot.y}
                      width={dot.size}
                      height={dot.size}
                      rx={dot.rx}
                      fill={dot.color}
                      transform={dot.rotate ? `rotate(${dot.rotate.deg} ${dot.rotate.cx} ${dot.rotate.cy})` : undefined}
                    />
                  ) : (
                    <path key={i} d={dot.d} fill={dot.color} />
                  ),
                )}
              </g>
            </svg>

            {NODE_CARDS.map((config) => {
              const infra = infraNodes.find((n) => n.key === config.key)
              if (infra) {
                return (
                  <TopologyNode
                    key={config.key}
                    config={config}
                    name={infra.title}
                    current={selectedKey === config.key}
                    onClick={() => onSelect(config.key)}
                  />
                )
              }
              const cluster = clusterNodes.find((n) => n.key === config.key)
              if (!cluster) return null
              return (
                <TopologyNode
                  key={config.key}
                  config={config}
                  name={config.name ?? cluster.crumb}
                  count={cluster.devices.length}
                  current={selectedKey === config.key}
                  onClick={() => onSelect(config.key)}
                />
              )
            })}
          </div>
        </div>

        <div className="topo-legend">
          <div className="legend">
            <span className="legend__item legend__item--wired">
              <i className="legend__swatch" />
              <span>Wired LAN</span>
            </span>
            <span className="legend__item legend__item--wireless">
              <i className="legend__swatch" />
              <span>Wireless</span>
            </span>
            <span className="legend__item legend__item--iot">
              <i className="legend__swatch" />
              <span>IoT / Access VLAN</span>
            </span>
            <span className="legend__item legend__item--fault">
              <i className="legend__swatch" />
              <span>Fault</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
