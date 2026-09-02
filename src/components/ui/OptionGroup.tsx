type OptionGroupProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  allowed?: string[];
};

// A row of choices where only one can be picked. Options outside allowed are greyed out.
export default function OptionGroup({ label, options, value, onChange, allowed }: OptionGroupProps) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isDisabled = allowed ? !allowed.includes(option) : false;
          const isActive = option === value;

          return (
            <button
              key={option}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(option)}
              className={`min-w-28 flex-1 rounded-xl border px-2 py-2.5 text-center text-sm font-medium transition-colors ${
                isActive
                  ? "cursor-pointer border-brand bg-brand text-on-brand"
                  : isDisabled
                    ? "cursor-not-allowed border-line bg-surface text-muted opacity-40"
                    : "cursor-pointer border-line bg-card text-ink hover:border-brand"
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
