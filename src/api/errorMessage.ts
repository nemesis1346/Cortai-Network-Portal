export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to load.'
}
