import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StepOneForm } from '@/modules/RegisterFormModule/Section/register-1';
import { RegisterFormData } from '@/lib/register';
import '@testing-library/jest-dom';

jest.mock('@/components', () => ({
  Typography: ({ children, variant }: { children: React.ReactNode, variant: string }) => (
    <div data-testid={`typography-${variant}`}>{children}</div>
  ),
  Stepper: ({ currentStep }: { currentStep: number }) => (
    <div data-testid="stepper" data-step={currentStep}>Stepper</div>
  ),
  Input: ({ name, label, value, onChange }: { name: string, label: string, value: string, onChange: any }) => (
    <div data-testid={`input-${name}`}>
      <label>{label}</label>
      <input name={name} value={value} onChange={onChange} data-testid={`input-field-${name}`} />
    </div>
  ),
  FileInput: ({ textLabel, onChange, state }: { textLabel: string, onChange: any, state: string }) => (
    <div data-testid={`file-input-${textLabel.replace(/\s+/g, '-').toLowerCase()}`}>
      <label>{textLabel}</label>
      <input type="file" onChange={onChange} data-state={state} data-testid={`file-input-field-${textLabel.replace(/\s+/g, '-').toLowerCase()}`} />
    </div>
  )
}));

describe('StepOneForm', () => {
  const mockFormData: RegisterFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nik: '',
    npwp: '',
    ktpFile: null,
    npwpFile: null,
    diplomaFile: null,
    address: '',
    city: '',
    price: ''
  };
  
  const mockUpdateFormData = jest.fn();
  
  beforeEach(() => {
    mockUpdateFormData.mockClear();
  });
  
  test('renders the form with empty fields initially', () => {
    render(<StepOneForm formData={mockFormData} updateFormData={mockUpdateFormData} />);

    expect(screen.getByTestId('stepper')).toHaveAttribute('data-step', '0');

    expect(screen.getByTestId('typography-h5')).toHaveTextContent('Lengkapi formulir dan mulai perjalanan karier kamu!');
    
    expect(screen.getByTestId('input-firstName')).toBeInTheDocument();
    expect(screen.getByTestId('input-lastName')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-phoneNumber')).toBeInTheDocument();
    expect(screen.getByTestId('input-nik')).toBeInTheDocument();
    expect(screen.getByTestId('input-npwp')).toBeInTheDocument();
    
    expect(screen.getByTestId('file-input-foto-ktp')).toBeInTheDocument();
    expect(screen.getByTestId('file-input-foto-npwp')).toBeInTheDocument();
    expect(screen.getByTestId('file-input-scan-ijazah')).toBeInTheDocument();
    
    expect(screen.getByTestId('file-input-foto-ktp').querySelector('input')).toHaveAttribute('data-state', 'empty');
    expect(screen.getByTestId('file-input-foto-npwp').querySelector('input')).toHaveAttribute('data-state', 'empty');
    expect(screen.getByTestId('file-input-scan-ijazah').querySelector('input')).toHaveAttribute('data-state', 'empty');
  });
  
  test('updates form data when files are uploaded', async () => {
    render(<StepOneForm formData={mockFormData} updateFormData={mockUpdateFormData} />);
    
    const ktpFile = new File(['ktp content'], 'ktp.jpg', { type: 'image/jpeg' });
    const npwpFile = new File(['npwp content'], 'npwp.jpg', { type: 'image/jpeg' });
    const diplomaFile = new File(['diploma content'], 'diploma.pdf', { type: 'application/pdf' });

    const ktpInput = screen.getByTestId('file-input-field-foto-ktp');
    await userEvent.upload(ktpInput, ktpFile);
    expect(mockUpdateFormData).toHaveBeenCalledWith({ ktpFile });

    const npwpInput = screen.getByTestId('file-input-field-foto-npwp');
    await userEvent.upload(npwpInput, npwpFile);
    expect(mockUpdateFormData).toHaveBeenCalledWith({ npwpFile });

    const diplomaInput = screen.getByTestId('file-input-field-scan-ijazah');
    await userEvent.upload(diplomaInput, diplomaFile);
    expect(mockUpdateFormData).toHaveBeenCalledWith({ diplomaFile });
  });
  
  test('displays pre-filled values when provided in formData', () => {
    const prefilledData: RegisterFormData = {
      ...mockFormData,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      nik: '1234567890123456',
      npwp: '12345678901234567',
      ktpFile: new File(['ktp content'], 'ktp.jpg', { type: 'image/jpeg' }),
      npwpFile: new File(['npwp content'], 'npwp.jpg', { type: 'image/jpeg' }),
      diplomaFile: new File(['diploma content'], 'diploma.pdf', { type: 'application/pdf' })
    };
    
    render(<StepOneForm formData={prefilledData} updateFormData={mockUpdateFormData} />);

    expect(screen.getByTestId('input-field-firstName')).toHaveValue('John');
    expect(screen.getByTestId('input-field-lastName')).toHaveValue('Doe');
    expect(screen.getByTestId('input-field-email')).toHaveValue('john@example.com');
    expect(screen.getByTestId('input-field-phoneNumber')).toHaveValue('1234567890');
    expect(screen.getByTestId('input-field-nik')).toHaveValue('1234567890123456');
    expect(screen.getByTestId('input-field-npwp')).toHaveValue('12345678901234567');

    expect(screen.getByTestId('file-input-foto-ktp').querySelector('input')).toHaveAttribute('data-state', 'filled');
    expect(screen.getByTestId('file-input-foto-npwp').querySelector('input')).toHaveAttribute('data-state', 'filled');
    expect(screen.getByTestId('file-input-scan-ijazah').querySelector('input')).toHaveAttribute('data-state', 'filled');
  });
});