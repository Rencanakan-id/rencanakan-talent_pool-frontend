interface InputProps {
    name?: string;
    label?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    className?: string;
  }

export const mockComponents = {
  Typography: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
    Input: ({ name, label, placeholder, type, value, onChange, error, className }: InputProps) => (
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
          />
          {error && <div className="error-message">{error}</div>}
        </div>
    )
  };