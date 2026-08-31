import { NextRequest } from "next/server";

// Reads the JSON body and returns null if it is empty, broken, or not an object.
export async function readJsonBody(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return null;
    return body;
  } catch {
    return null;
  }
}

// True only for real text, so we never call string methods on a number.
export function isNonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
