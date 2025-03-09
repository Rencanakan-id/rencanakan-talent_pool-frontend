import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
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
    updateFormCompleteness: jest.fn(),
    validationErrors: {},
  };
  
  
  const renderFormWithData = (
    formData: Partial<RegisterFormData> = {},
    validationErrors = {}
  ): RenderResult => {
    return render(
      <StepFourForm 
        formData={formData as RegisterFormData}
        updateFormData={defaultProps.updateFormData}
        updateFormCompleteness={defaultProps.updateFormCompleteness}
        validationErrors={validationErrors}
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
    it('shows error from validation errors prop when present', async () => {
      const validationErrors = {
        password: 'Password has an error'
      };
      
      const { findByTestId } = renderFormWithData(
        { password: 'test' },
        validationErrors
      );
      
      const errorElement = await findByTestId('password-error');
      expect(errorElement).toHaveTextContent('Password has an error');
    });

    it('checks form completeness when password is empty', () => {
      renderFormWithData({ password: '' });
      
      expect(defaultProps.updateFormCompleteness).toHaveBeenCalledWith(false);
    });

    it('marks form as incomplete with empty password', async () => {
      renderFormWithData({ password: '', passwordConfirmation: 'Password123' });
      
      expect(defaultProps.updateFormCompleteness).toHaveBeenCalledWith(false);
    });
  });

  describe('Password Confirmation Validations', () => {
    it('marks form as incomplete with empty password confirmation', async () => {
      renderFormWithData({
        password: generateValidPassword(),
        passwordConfirmation: ''
      });
      
      expect(defaultProps.updateFormCompleteness).toHaveBeenCalledWith(false);
    });

    it('shows error when passwords don\'t match from validation errors', async () => {
      const validationErrors = {
        passwordConfirmation: 'Kata sandi tidak cocok'
      };
      
      const { findByTestId } = renderFormWithData(
        { 
          password: generateValidPassword(), 
          passwordConfirmation: 'differentPassword' 
        },
        validationErrors
      );
      
      const errorElement = await findByTestId('passwordConfirmation-error');
      expect(errorElement).toHaveTextContent('Kata sandi tidak cocok');
    });
  });

  describe('Terms and Conditions', () => {
    it('marks form as incomplete when terms not accepted', async () => {
      const validPassword = generateValidPassword();
      
      renderFormWithData({
        password: validPassword,
        passwordConfirmation: validPassword,
        termsAndConditions: false
      });
      
      expect(defaultProps.updateFormCompleteness).toHaveBeenCalledWith(false);
    });

    it('marks form as complete when all fields valid and terms accepted', async () => {
      const validPassword = generateValidPassword();
      
      renderFormWithData({
        password: validPassword,
        passwordConfirmation: validPassword,
        termsAndConditions: true
      });
      
      expect(defaultProps.updateFormCompleteness).toHaveBeenCalledWith(true);
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

  describe('Form Completeness Status', () => {
    it('updates completeness status when all fields are filled correctly', async () => {
      const validPassword = generateValidPassword();
      
      renderFormWithData({
        password: validPassword,
        passwordConfirmation: validPassword,
        termsAndConditions: true
      });
      
      expect(defaultProps.updateFormCompleteness).toHaveBeenCalledWith(true);
    });
    
    it('updates completeness status when some fields are missing', async () => {
      const validPassword = generateValidPassword();
      
      renderFormWithData({
        password: validPassword,
        termsAndConditions: true
      });
      
      expect(defaultProps.updateFormCompleteness).toHaveBeenCalledWith(false);
    });
    
    it('updates completeness status when terms are not accepted', async () => {
      const validPassword = generateValidPassword();
      
      renderFormWithData({
        password: validPassword,
        passwordConfirmation: validPassword,
        termsAndConditions: false
      });
      
      expect(defaultProps.updateFormCompleteness).toHaveBeenCalledWith(false);
    });
  });

  describe('Component with undefined validationErrors', () => {
    it('renders correctly when validationErrors prop is undefined', () => {
      const { queryByTestId } = render(
        <StepFourForm 
          formData={{}} 
          updateFormData={defaultProps.updateFormData}
          updateFormCompleteness={defaultProps.updateFormCompleteness}
        />
      );
      
      expect(queryByTestId('password-error')).not.toBeInTheDocument();
      expect(queryByTestId('passwordConfirmation-error')).not.toBeInTheDocument();
      
      expect(defaultProps.updateFormCompleteness).toHaveBeenCalledWith(false);
    });
  });
});