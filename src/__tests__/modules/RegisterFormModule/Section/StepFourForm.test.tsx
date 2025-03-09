import React from 'react';
import { render, fireEvent, waitFor, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StepFourForm } from '../../../../modules/RegisterFormModule/Section/register-4';
import { RegisterFormData } from '@/lib/register';
import { faker } from '@faker-js/faker';

const generateValidPassword = () => {
  return `${faker.string.alpha(1).toUpperCase()}${faker.string.alpha(5).toLowerCase()}${faker.string.numeric(3)}`;
};

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
    onBlur,
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
        onBlur={onBlur}
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
  
  const testPasswordValidationError = async (
    testValue: string,
    expectedError: string
  ) => {
    const { getByTestId, findByTestId } = render(
      <StepFourForm 
        {...defaultProps} 
        formData={{ password: testValue }}
      />
    );
    
    fireEvent.change(getByTestId('password'), { target: { value: testValue } });
    
    const errorElement = await findByTestId('password-error');
    expect(errorElement).toHaveTextContent(expectedError);
    expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
  };
  
  const renderFormWithData = (formData: Partial<RegisterFormData> = {}): RenderResult => {
    return render(
      <StepFourForm 
        formData={formData as RegisterFormData}
        updateFormData={defaultProps.updateFormData}
        updateValidationStatus={defaultProps.updateValidationStatus}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText, getByTestId, queryByTestId } = renderFormWithData();
    
    expect(getByText('Semuanya udah oke, yuk buat akun!')).toBeInTheDocument();
    expect(getByTestId('stepper')).toBeInTheDocument();
    expect(getByTestId('password')).toBeInTheDocument();
    expect(getByTestId('passwordConfirmation')).toBeInTheDocument();
    
    expect(queryByTestId('password-error')).not.toBeInTheDocument();
    expect(queryByTestId('passwordConfirmation-error')).not.toBeInTheDocument();
  });

  describe('Password Field Validations', () => {
    it('displays error when password is empty after interaction', async () => {
      const { getByTestId } = renderFormWithData({ password: '' });
      
      fireEvent.change(getByTestId('password'), { target: { value: ' ' } });
      fireEvent.change(getByTestId('password'), { target: { value: '' } });
      
      await waitFor(() => {
        expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
      });
    });

    it('displays error when password is less than 8 characters', async () => {
      await testPasswordValidationError('1234567', 'Kata sandi minimal 8 karakter');
    });

    it('displays error when password doesn\'t have uppercase letters', async () => {
      await testPasswordValidationError('password123', 'Kata sandi harus memiliki huruf kapital');
    });

    it('displays error when password doesn\'t have lowercase letters', async () => {
      await testPasswordValidationError('PASSWORD123', 'Kata sandi harus memiliki huruf kecil');
    });

    it('displays error when password doesn\'t have numbers', async () => {
      await testPasswordValidationError('Password', 'Kata sandi harus memiliki angka');
    });

    it('displays error when password contains spaces', async () => {
      await testPasswordValidationError('Password 123', 'Kata sandi tidak boleh mengandung spasi');
    });
  });

  describe('Password Confirmation Validations', () => {
    it('validates that password confirmation cannot be empty', async () => {
      const validPassword = generateValidPassword();
      renderFormWithData({
        password: validPassword,
        passwordConfirmation: ''
      });
      
      await waitFor(() => {
        expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
      });
      
      const { validatePasswordMatch } = require('@/lib/validation/passwordValidation');
      expect(validatePasswordMatch(validPassword, '')).toBe("Konfirmasi kata sandi tidak boleh kosong");
    });

    it('displays error when passwords don\'t match', async () => {
      const validPassword = generateValidPassword();
      const differentPassword = generateValidPassword() + 'X';
      
      const { getByTestId, findByTestId } = renderFormWithData({ 
        password: validPassword, 
        passwordConfirmation: differentPassword 
      });
      
      fireEvent.change(getByTestId('passwordConfirmation'), { target: { value: differentPassword } });
      
      const errorElement = await findByTestId('passwordConfirmation-error');
      expect(errorElement).toHaveTextContent('Kata sandi tidak cocok');
      expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
    });
  });

  describe('Form Data Updates', () => {
    it('updates form data when user types in password field', () => {
      const { getByTestId } = renderFormWithData();
      const newPassword = generateValidPassword();
      
      fireEvent.change(getByTestId('password'), { target: { value: newPassword } });
      
      expect(defaultProps.updateFormData).toHaveBeenCalledWith({ password: newPassword });
    });

    it('updates form data when user types in password confirmation field', () => {
      const { getByTestId } = renderFormWithData();
      const newPassword = generateValidPassword();
      
      fireEvent.change(getByTestId('passwordConfirmation'), { target: { value: newPassword } });
      
      expect(defaultProps.updateFormData).toHaveBeenCalledWith({ passwordConfirmation: newPassword });
    });

    it('updates form data when user toggles terms and conditions checkbox', () => {
      const { container } = renderFormWithData();
      
      const checkbox = container.querySelector('#termsAndConditions') as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();
      
      fireEvent.click(checkbox);
      
      expect(defaultProps.updateFormData).toHaveBeenCalledWith({ termsAndConditions: true });
    });
  });

  describe('Form Validation Status', () => {
    it('validates form as valid with correct password and terms accepted', async () => {
      const validPassword = generateValidPassword();
      
      renderFormWithData({
        password: validPassword,
        passwordConfirmation: validPassword,
        termsAndConditions: true
      });
      
      await waitFor(() => {
        expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: true });
      });
    });

    it('validates form as invalid when terms not accepted', async () => {
      const validPassword = generateValidPassword();
      
      renderFormWithData({
        password: validPassword,
        passwordConfirmation: validPassword,
        termsAndConditions: false
      });
      
      await waitFor(() => {
        expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
      });
    });

    it('shows no errors with valid password but validation fails without terms', async () => {
      const validPassword = generateValidPassword();
      
      const { queryByTestId } = renderFormWithData({
        password: validPassword,
        passwordConfirmation: validPassword,
        termsAndConditions: false
      });
      
      await waitFor(() => {
        expect(queryByTestId('password-error')).not.toBeInTheDocument();
        expect(queryByTestId('passwordConfirmation-error')).not.toBeInTheDocument();
        expect(defaultProps.updateValidationStatus).toHaveBeenCalledWith({ step4Valid: false });
      });
    });
  });
});