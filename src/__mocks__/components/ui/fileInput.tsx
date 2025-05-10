interface FileInputProps {
    textLabel: string;
    accept?: string;
    state?: string;
    value?: string | null;
    onFileSelect: (file: File) => void;
    error?: string;
  }
  
export const mockFileInput = ({ textLabel, accept, state, value, onFileSelect, error }: FileInputProps) => (
    <div>
        <label>{textLabel}</label>
        <input
            type="file"
            accept={accept}
            onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
            aria-label={textLabel}
        />
        {state === 'filled' && <span>{value}</span>}
        {error && <div className="error-message">{error}</div>}
    </div>
);