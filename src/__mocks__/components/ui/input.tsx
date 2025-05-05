interface InputProps {
    name?: string;
    label?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    className?: string;
    dataTestId?: string;
  }

export const mockInput = ({ name, label, dataTestId, placeholder, type, value, onChange, error, className }: InputProps) => (
  <div className={className}>
    {label && <label htmlFor={name}>{label}</label>}
    <input
      id={name}
      name={name}
      placeholder={placeholder ?? ''}
      type={type}
      value={value ?? ''}
      onChange={onChange}
      aria-label={label}
      data-testid={dataTestId}
    />
    {error && <div className="error-message">{error}</div>}
  </div>
);