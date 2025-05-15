interface TextareaProps {
    textLabel: string;
    placeholder?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
  }

export const mockTextarea = ({ textLabel, placeholder, value, onChange, error }: TextareaProps) => (
  <div>
    <label>{textLabel}</label>
    <textarea
      placeholder={placeholder ?? ''}
      value={value ?? ''}
      onChange={onChange}
      aria-label={textLabel}
    />
    {error && <div className="error-message">{error}</div>}
  </div>
);