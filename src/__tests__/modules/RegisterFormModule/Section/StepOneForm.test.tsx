import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StepOneForm } from '@/modules/RegisterFormModule/Section/register-1';
import { RegisterFormData } from '@/lib/register';

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

interface FileInputProps {
  textLabel: string;
  accept?: string;
  state?: string;
  value?: string | null;
  onFileSelect: (file: File) => void;
}

jest.mock('@/components', () => ({
  Typography: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  Stepper: ({ currentStep }: { currentStep: number }) => (
    <div>{`Current step: ${currentStep}`}</div>
  ),
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
  ),
  FileInput: ({ textLabel, accept, state, value, onFileSelect }: FileInputProps) => (
    <div>
      <label>{textLabel}</label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        aria-label={textLabel}
      />
      {state === 'filled' && <span>{value}</span>}
    </div>
  ),
}));

describe('StepOneForm Component', () => {

  const initialFormData: RegisterFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nik: "",
    npwp: "",
    ktpFile: null,
    npwpFile: null,
    diplomaFile: null,
  };

  const mockUpdateFormData = jest.fn();

  const setup = (formData: Partial<RegisterFormData> = {}) => {
    const props = {
      formData: { ...initialFormData, ...formData },
      updateFormData: mockUpdateFormData,
    };
    return render(<StepOneForm {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive Cases', () => {
    test('renders form with all fields', () => {
      setup();

      expect(screen.getByPlaceholderText("Nama Depan")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Nama Belakang")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Masukkan email Anda")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Masukkan NIK Anda")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Masukkan NPWP Anda")).toBeInTheDocument();
    });

    test('updates firstName when input changes', () => {
      setup();
      const input = screen.getByLabelText('Nama Depan');
      fireEvent.change(input, { target: { value: 'John' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ firstName: 'John' });
    });

    test('updates lastName when input changes', () => {
      setup();
      const input = screen.getByLabelText('Nama Belakang');
      fireEvent.change(input, { target: { value: 'Cena' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ lastName: 'Cena' });
    });

  });


});

