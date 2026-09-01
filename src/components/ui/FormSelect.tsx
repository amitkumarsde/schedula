type FormSelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
};

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select",
  required = false,
}: FormSelectProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
