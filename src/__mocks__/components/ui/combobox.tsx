interface ComboboxProps {
  label: string;
  onChange: (value: string) => void;
  value?: string;
  error?: string;
}

export const mockCombobox = ({ label, onChange, value, error }: ComboboxProps) => (
  <div>
    <label>{label}</label>
    <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} aria-label={label} />
    {error && <div className="error-message">{error}</div>}
  </div>
);