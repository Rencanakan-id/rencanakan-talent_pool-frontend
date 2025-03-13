import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StepOneForm } from '@/modules/RegisterFormModule/Section/register-1';
import { RegisterFormData } from '@/lib/register';

interface InputFileProps {
  textLabel: string;
  accept?: string;
  state?: string;
  value?: string | null;
  onFileSelect: (file: File) => void;
}

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

interface ImageInputProps {
  label?: string;
  className?: string;
  onImageChange?: (file: File | null) => void;
}

jest.mock('@/components', () => ({
  Typography: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  Stepper: ({ currentStep }: { currentStep: number }) => (
    <div>{`Current step: ${currentStep}`}</div>
  ),
  ImageUpload: ({ label, className, onImageChange }: ImageInputProps) => (
    <div className={className}>
      {label && <label>{label}</label>}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            console.log('Image file selected:', file);
            onImageChange?.(file);
          }
        }}
      />
    </div>
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
  FileInput: ({ textLabel, accept, state, value, onFileSelect }: InputFileProps) => (
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
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nik: '',
    npwp: '',
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

      expect(screen.getByPlaceholderText('Nama Depan')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Nama Belakang')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Masukkan email Anda')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Masukkan nomor WhatsApp Anda')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Masukkan NIK Anda')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Masukkan NPWP Anda')).toBeInTheDocument();
    });

    test('updates firstName when input changes', () => {
      setup();
      const input = screen.getByLabelText('Nama Depan *');
      fireEvent.change(input, { target: { value: 'John' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ firstName: 'John' });
    });

    test('updates lastName when input changes', () => {
      setup();
      const input = screen.getByLabelText('Nama Belakang *');
      fireEvent.change(input, { target: { value: 'Cena' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ lastName: 'Cena' });
    });

    test('updates email when input changes', () => {
      setup();
      const input = screen.getByLabelText('Email *');
      fireEvent.change(input, { target: { value: 'dummy@example.com' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ email: 'dummy@example.com' });
    });

    test('updates phoneNumber when input changes', () => {
      setup();
      const input = screen.getByLabelText('Nomor Telepon *');
      fireEvent.change(input, { target: { value: '0129102301212' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ phoneNumber: '0129102301212' });
    });

    test('updates nik when input changes', () => {
      setup();
      const input = screen.getByLabelText('No. NIK *');
      fireEvent.change(input, { target: { value: '2312312413123' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ nik: '2312312413123' });
    });

    test('updates lastName when input changes', () => {
      setup();
      const input = screen.getByLabelText('No. NPWP *');
      fireEvent.change(input, { target: { value: '123123123123' } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ npwp: '123123123123' });
    });

    test('updates foto KTP when file is selected', () => {
      setup();
      const file = new File(['dummy content'], 'ktp.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText('Foto KTP');

      fireEvent.change(fileInput, { target: { files: [file] } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ ktpFile: file });

      setup({ ktpFile: file });
      expect(screen.getByText('ktp.pdf')).toBeInTheDocument();
    });

    test('updates foto NPWP when file is selected', () => {
      setup();
      const file = new File(['dummy content'], 'npwp.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText('Foto NPWP');

      fireEvent.change(fileInput, { target: { files: [file] } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ npwpFile: file });

      setup({ npwpFile: file });
      expect(screen.getByText('npwp.pdf')).toBeInTheDocument();
    });

    test('updates foto ijazah when file is selected', () => {
      setup();
      const file = new File(['dummy content'], 'ijazah.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText('Scan Ijazah');

      fireEvent.change(fileInput, { target: { files: [file] } });
      expect(mockUpdateFormData).toHaveBeenCalledWith({ diplomaFile: file });

      setup({ diplomaFile: file });
      expect(screen.getByText('ijazah.pdf')).toBeInTheDocument();
    });
  });

  describe('Negative Cases', () => {
    test('handles empty form data on step one', () => {
      const { container } = setup({
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        phoneNumber: undefined,
        nik: undefined,
        npwp: undefined,
        ktpFile: null,
        npwpFile: null,
        diplomaFile: null,
      } as Partial<RegisterFormData>);

      expect(container).toBeInTheDocument();
    });
  });
});
