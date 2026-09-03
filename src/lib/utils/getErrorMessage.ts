// Pulls a readable message out of an unknown thrown value, with a safe fallback.
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
