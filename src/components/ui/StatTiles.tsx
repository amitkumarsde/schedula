import type { ComponentType, ReactNode } from "react";

type StatTile = { Icon: ComponentType<{ className?: string }>; value: ReactNode; label: string };

export default function StatTiles({ tiles }: { tiles: StatTile[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-card p-5 text-center"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft">
            <tile.Icon className="h-5 w-5 text-brand" />
          </span>
          <span className="text-lg font-bold text-ink">{tile.value}</span>
          <span className="text-xs text-muted">{tile.label}</span>
        </div>
      ))}
    </div>
  );
}
