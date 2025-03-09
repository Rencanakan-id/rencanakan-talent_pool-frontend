import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StepFourForm } from '../../../modules/RegisterFormModule/Section/register-4';
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
    
    fireEvent.change(getByTestId('password'), { target: { value: ' ' } });
    fireEvent.change(getByTestId('password'), { target: { value: '' } });
    
    await waitFor(() => {
      const passwordInput = getByTestId('password');
      fireEvent.blur(passwordInput);
      expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
    });
  });

  it('displays error when password is less than 8 characters', async () => {
    const { getByTestId, findByTestId } = render(
      <StepFourForm 
        {...defaultProps} 
        formData={{ password: '1234567' }}
      />
    );
    
    fireEvent.change(getByTestId('password'), { target: { value: '1234567' } });
    
    const errorElement = await findByTestId('password-error');
    expect(errorElement).toHaveTextContent('Kata sandi minimal 8 karakter');
    expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
  });

  it('displays error when password doesn\'t have uppercase letters', async () => {
    const { getByTestId, findByTestId } = render(
      <StepFourForm 
        {...defaultProps} 
        formData={{ password: 'password123' }}
      />
    );
    
    fireEvent.change(getByTestId('password'), { target: { value: 'password123' } });
    
    const errorElement = await findByTestId('password-error');
    expect(errorElement).toHaveTextContent('Kata sandi harus memiliki huruf kapital');
    expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
  });

  it('displays error when password doesn\'t have lowercase letters', async () => {
    const { getByTestId, findByTestId } = render(
      <StepFourForm 
        {...defaultProps} 
        formData={{ password: 'PASSWORD123' }}
      />
    );
    
    fireEvent.change(getByTestId('password'), { target: { value: 'PASSWORD123' } });
    
    const errorElement = await findByTestId('password-error');
    expect(errorElement).toHaveTextContent('Kata sandi harus memiliki huruf kecil');
    expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
  });

  it('displays error when password doesn\'t have numbers', async () => {
    const { getByTestId, findByTestId } = render(
      <StepFourForm 
        {...defaultProps} 
        formData={{ password: 'Password' }}
      />
    );
    
    fireEvent.change(getByTestId('password'), { target: { value: 'Password' } });
    
    const errorElement = await findByTestId('password-error');
    expect(errorElement).toHaveTextContent('Kata sandi harus memiliki angka');
    expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
  });

  it('displays error when password contains spaces', async () => {
    const { getByTestId, findByTestId } = render(
      <StepFourForm 
        {...defaultProps} 
        formData={{ password: 'Password 123' }}
      />
    );
    
    fireEvent.change(getByTestId('password'), { target: { value: 'Password 123' } });
    
    const errorElement = await findByTestId('password-error');
    expect(errorElement).toHaveTextContent('Kata sandi tidak boleh mengandung spasi');
    expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
  });

  it('validates that password confirmation cannot be empty', async () => {
    const { updateFormData, updateValidationStatus } = defaultProps;
    
    const testFormData = {
      password: 'Password123',
      passwordConfirmation: ''
    } as RegisterFormData;
    
    render(
      <StepFourForm 
        formData={testFormData}
        updateFormData={updateFormData}
        updateValidationStatus={updateValidationStatus}
      />
    );
    
    await waitFor(() => {
      expect(updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
    });
    
    const { validatePasswordMatch } = require('@/lib/validation/passwordValidation');
    expect(validatePasswordMatch('Password123', '')).toBe("Konfirmasi kata sandi tidak boleh kosong");
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

  it('updates form data when user types in password field', () => {
    const { getByTestId } = render(<StepFourForm {...defaultProps} />);
    
    fireEvent.change(getByTestId('password'), { target: { value: 'NewPassword123' } });
    
    expect(defaultProps.updateFormData).toHaveBeenCalledWith({ password: 'NewPassword123' });
  });

  it('updates form data when user types in password confirmation field', () => {
    const { getByTestId } = render(<StepFourForm {...defaultProps} />);
    
    fireEvent.change(getByTestId('passwordConfirmation'), { target: { value: 'NewPassword123' } });
    
    expect(defaultProps.updateFormData).toHaveBeenCalledWith({ passwordConfirmation: 'NewPassword123' });
  });

  it('updates form data when user toggles terms and conditions checkbox', () => {
    const { container } = render(<StepFourForm {...defaultProps} />);
    
    const checkbox = container.querySelector('#termsAndConditions') as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    
    fireEvent.click(checkbox);
    
    expect(defaultProps.updateFormData).toHaveBeenCalledWith({ termsAndConditions: true });
  });

  it('validates form as invalid when terms not accepted', async () => {
    const formDataNoTerms: Partial<RegisterFormData> = {
      password: 'Password123',
      passwordConfirmation: 'Password123',
      termsAndConditions: false
    };

    render(
      <StepFourForm
        {...defaultProps}
        formData={formDataNoTerms as RegisterFormData} />
    );
    
    await waitFor(() => {
      expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
    });
  });

  it('shows no errors with valid password but validation fails without terms', async () => {
    const formData: Partial<RegisterFormData> = {
      password: 'Password123',
      passwordConfirmation: 'Password123',
      termsAndConditions: false
    };

    const { queryByTestId } = render(
      <StepFourForm 
        {...defaultProps} 
        formData={formData as RegisterFormData}
      />
    );
    
    await waitFor(() => {
      expect(queryByTestId('password-error')).not.toBeInTheDocument();
      expect(queryByTestId('passwordConfirmation-error')).not.toBeInTheDocument();
      expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
    });
  });
});