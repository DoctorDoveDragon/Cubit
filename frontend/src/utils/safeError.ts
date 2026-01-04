/**
 * Helper to convert unknown errors into a safe string message.
 * Use in catch blocks before logging or returning messages to clients.
 */
export function safeErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message || String(err)
  try {
    return String(err)
  } catch {
    return 'Unknown error'
  }
}

export default safeErrorMessage
