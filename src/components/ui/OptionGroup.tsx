export default function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>

      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const isActive = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-xl border px-2 py-2.5 text-center text-sm font-medium transition-colors ${
                isActive
                  ? "border-brand bg-brand text-on-brand"
                  : "border-line bg-card text-ink hover:border-brand"
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
