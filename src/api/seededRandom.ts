/** Ported verbatim from cortai-network-topology.html's rng() (line 1741) — xorshift32 PRNG. */
export function rng(seed: number): () => number {
  let a = (seed * 2654435761) >>> 0
  return () => {
    a ^= a << 13
    a ^= a >>> 17
    a ^= a << 5
    a >>>= 0
    return a / 4294967296
  }
}
