// Groups items into date buckets. dateKey returns a "2026-09-01" string.
export function groupByDate<T>(items: T[], dateKey: (item: T) => string, newestFirst = true) {
  const buckets = new Map<string, T[]>();

  for (const item of items) {
    const key = dateKey(item);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(item);
  }

  return Array.from(buckets.entries())
    .map(([date, list]) => ({ date, items: list }))
    .sort((a, b) => (a.date < b.date ? (newestFirst ? 1 : -1) : newestFirst ? -1 : 1));
}
