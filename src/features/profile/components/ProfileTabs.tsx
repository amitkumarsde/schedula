"use client";

import type { ComponentType } from "react";

export type ProfileTab = {
  key: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

type ProfileTabsProps = {
  tabs: ProfileTab[];
  activeKey: string;
  onSelect: (key: string) => void;
};

// The row of tabs across the top of the profile.
export default function ProfileTabs({ tabs, activeKey, onSelect }: ProfileTabsProps) {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelect(tab.key)}
            className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "bg-card text-brand shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            <tab.Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
