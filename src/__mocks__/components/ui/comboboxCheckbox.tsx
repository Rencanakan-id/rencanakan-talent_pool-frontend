interface ComboboxCheckBoxProps {
    label: string;
    onChange: (values: string[]) => void;
    values?: string[];
    placeholder?: string;
    error?: string;
  }

export const mockComboboxCheckBox = ({ label, onChange, values, placeholder, error }: ComboboxCheckBoxProps) => {
  const displayValues = (values || []).map((v) => v.charAt(0).toUpperCase() + v.slice(1));
  return (
    <div>
      <label>{label}</label>
      <input
        value={displayValues.join(', ')}
        onChange={(e) => onChange(e.target.value.split(', '))}
        placeholder={placeholder ?? ''}
        aria-label={label}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};