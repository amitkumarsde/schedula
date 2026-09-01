// The shape every profile check gives back: an error message, or the fields ready to save.
export type CheckResult = { errorMessage: string; fields: Record<string, unknown> | null };

export function fail(message: string): CheckResult {
  return { errorMessage: message, fields: null };
}

export function ok(fields: Record<string, unknown>): CheckResult {
  return { errorMessage: "", fields };
}
