import { CheckResult, fail, ok } from "@/lib/profile/checkResult";

const MAX_LINKS = 20;

export function validateFileLinks(fieldName: string, body: Record<string, unknown>): CheckResult {
  const rawLinks = Array.isArray(body.links) ? body.links : [];

  if (rawLinks.length > MAX_LINKS) {
    return fail(`You can save at most ${MAX_LINKS} links`);
  }

  const cleanLinks = [];

  for (const item of rawLinks) {
    const link = item as { name?: unknown; url?: unknown };
    const name = typeof link.name === "string" ? link.name.trim() : "";
    const url = typeof link.url === "string" ? link.url.trim() : "";

    if (!name) return fail("Please give every link a name");
    if (!url.startsWith("https://")) return fail("Every link must start with https://");

    cleanLinks.push({ name, url });
  }

  return ok({ [fieldName]: cleanLinks });
}
