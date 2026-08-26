/**
 * Ported verbatim from network.html's traffic() (lines 217-233) — a
 * self-contained deterministic sine-wave generator, unrelated to this app's
 * seeded xorshift PRNG (src/api/seededRandom.ts). Returns SVG path `d`
 * strings for the area fill and the line stroke, viewBox 0 0 340 100.
 */
export interface Sparkline {
  areaPath: string
  linePath: string
}

export function buildSparkline(seed: number, danger?: boolean): Sparkline {
  const points: [number, number][] = []
  let v = 40
  for (let i = 0; i <= 24; i++) {
    v = Math.max(8, Math.min(92, v + (Math.sin(i * 1.7 + seed) * 22 + ((i % 3) - 1) * 9)))
    points.push([i * (340 / 24), 100 - v])
  }
  const adjusted = danger ? points.map(([x, y], i) => [x, i > 2 ? 99 : y] as [number, number]) : points

  const linePath = adjusted.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L340,100 L0,100 Z`

  return { areaPath, linePath }
}
