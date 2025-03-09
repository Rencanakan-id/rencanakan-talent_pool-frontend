import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StepThreeForm } from '@/modules/RegisterFormModule/Section/register-3';
import { RegisterFormData } from '@/lib/register';
import { yearsOfExperience } from '@/data/yearsOfExperience';

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

jest.mock('@/components', () => ({
  Typography: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
    variant?: string;
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
        placeholder={placeholder || ''}
        type={type}
        value={value || ''}
        onChange={onChange}
        aria-label={label}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  ),
}));

jest.mock('@/data/hargaJasa', () => ({
    hargaJasa: {
      operator: {
        "1": { min: 200000, max: 500000 },
      },
    },
  }));
  
  jest.mock('@/data/skkLevels', () => ({
    skkLevels: [{ value: 'operator', label: 'Operator' }],
  }));
  
  jest.mock('@/data/yearsOfExperience', () => ({
    yearsOfExperience: [{ value: '1', label: '1 Tahun' }],
  }));
  

describe('StepThreeForm Component', () => {
  const defaultFormData: RegisterFormData = {
    skkLevel: 'operator',
    yearsOfExperience: '1 Tahun',
    price: '',
  };
  
  const mockUpdateFormData = jest.fn();
  
  const setup = (formData: Partial<RegisterFormData> = {}) => {
    return render(<StepThreeForm formData={{ ...defaultFormData, ...formData }} updateFormData={mockUpdateFormData} />);
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with expected elements', () => {
    setup();
    expect(screen.getByText('Kira-kira begini perkiraan harga kamu, cocok gak?')).toBeInTheDocument();
    expect(screen.getByText('Perkiraan Harga')).toBeInTheDocument();
    expect(screen.getByLabelText('Tentukan Harga Kamu')).toBeInTheDocument();
  });
  
  test('displays formatted price range based on form data', () => {
    setup({ skkLevel: 'operator', yearsOfExperience: '1' });
    expect(
      screen.getByText((content) => content.includes("Rp200.000") && content.includes("Rp500.000"))
    ).toBeInTheDocument();
  });
  
  
  test('updates price field correctly', () => {
    setup();
    const input = screen.getByLabelText('Tentukan Harga Kamu');
    fireEvent.change(input, { target: { value: '500000' } });
    expect(mockUpdateFormData).toHaveBeenCalledWith({ price: '500000' });
  });
});
