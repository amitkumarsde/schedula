"use client";

type ChipToggleGroupProps = {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
};

// A row of chips where more than one can be turned on.
export default function ChipToggleGroup({ label, options, selected, onToggle }: ChipToggleGroupProps) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isOn = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isOn
                  ? "border-brand bg-brand text-on-brand"
                  : "border-line bg-card text-muted hover:border-brand hover:text-brand"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
