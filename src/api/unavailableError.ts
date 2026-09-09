/** Thrown by API methods that have no real data source yet — never fabricate a value instead. */
export class UnavailableError extends Error {
  reason: string

  constructor(reason: string) {
    super(reason)
    this.reason = reason
  }
}

export function unavailable(reason: string): Promise<never> {
  return Promise.reject(new UnavailableError(reason))
}
