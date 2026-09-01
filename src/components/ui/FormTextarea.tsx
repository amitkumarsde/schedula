type FormTextareaProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  grow?: boolean;
};

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  hint,
  rows = 4,
  grow = false,
}: FormTextareaProps) {
  return (
    <div className={grow ? "flex flex-1 flex-col" : ""}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full resize-none rounded-xl border border-transparent bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus:bg-card ${
          grow ? "min-h-32 flex-1" : ""
        }`}
      />

      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
