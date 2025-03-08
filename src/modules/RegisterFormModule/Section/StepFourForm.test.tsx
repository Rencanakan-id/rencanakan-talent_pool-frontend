import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StepFourForm } from './register-4';
import { RegisterFormData } from '@/lib/register';

jest.mock('@/components', () => ({
  Typography: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className}>{children}</div>
  ),
  Stepper: ({ currentStep }: { currentStep: number }) => (
    <div data-testid="stepper">{`Current step: ${currentStep}`}</div>
  ),
  Input: ({ 
    name, 
    label, 
    placeholder,
    type,
    value,
    onChange,
    error
  }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input 
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        data-testid={name}
      />
      {error && <div data-testid={`${name}-error`} className="error-message">{error}</div>}
    </div>
  ),
}));

describe('StepFourForm Component', () => {
  const defaultProps = {
    formData: {} as RegisterFormData,
    updateFormData: jest.fn(),
    updateValidationStatus: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText, getByTestId } = render(<StepFourForm {...defaultProps} />);
    
    expect(getByText('Semuanya udah oke, yuk buat akun!')).toBeInTheDocument();
    expect(getByTestId('stepper')).toBeInTheDocument();
    expect(getByTestId('password')).toBeInTheDocument();
    expect(getByTestId('passwordConfirmation')).toBeInTheDocument();
  });

  it('displays error when password is empty', async () => {
    const { getByTestId } = render(
      <StepFourForm 
        {...defaultProps} 
        formData={{ password: '' }}
      />
    );
    
    fireEvent.change(getByTestId('password'), { target: { value: '' } });
    
    await waitFor(() => {
      const passwordInput = getByTestId('password');
      fireEvent.blur(passwordInput);
      expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
    });
  });

  it('displays error when passwords don\'t match', async () => {
    const { getByTestId, findByTestId } = render(
      <StepFourForm 
        {...defaultProps} 
        formData={{ password: 'Password123', passwordConfirmation: 'Password124' }}
      />
    );
    
    fireEvent.change(getByTestId('passwordConfirmation'), { target: { value: 'Password124' } });
    
    const errorElement = await findByTestId('passwordConfirmation-error');
    expect(errorElement).toHaveTextContent('Kata sandi tidak cocok');
    expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
  });

  it('updates form data when user types in password field', () => {
    const { getByTestId } = render(<StepFourForm {...defaultProps} />);
    
    fireEvent.change(getByTestId('password'), { target: { value: 'NewPassword123' } });
    
    expect(defaultProps.updateFormData).toHaveBeenCalledWith({ password: 'NewPassword123' });
  });

  it('validates form as valid with correct password and terms accepted', async () => {
    const validFormData: Partial<RegisterFormData> = {
      password: 'Password123',
      passwordConfirmation: 'Password123',
      termsAndConditions: true
    };

    render(
      <StepFourForm
        {...defaultProps}
        formData={validFormData as RegisterFormData} />
    );
    
    await waitFor(() => {
      expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: true });
    });
  });
});
