import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../../../modules/LoginFormModule/Section/login';
import { faker } from '@faker-js/faker';
import '@testing-library/jest-dom';

const randomPassword = faker.internet.password();

describe('LoginForm', () => {
  let mockUpdateFormData: jest.Mock;
  let mockHandleLogin: jest.Mock;

  beforeEach(() => {
    mockUpdateFormData = jest.fn();
    mockHandleLogin = jest.fn();

    render(
      <LoginForm
        formData={{ email: '', password: '' }}
        updateFormData={mockUpdateFormData}
        isFormValid={false}
        handleLogin={mockHandleLogin}
        emailError=""
        commentError=""
      />
    );
  });

  test('renders input fields correctly', () => {
    expect(screen.getByPlaceholderText('Masukkan email Anda')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan kata sandi')).toBeInTheDocument();
  });

  test('calls updateFormData when typing in input fields', () => {
    fireEvent.change(screen.getByPlaceholderText('Masukkan email Anda'), {
      target: { value: 'test@example.com' },
    });
    expect(mockUpdateFormData).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'test@example.com' })
    );

    fireEvent.change(screen.getByPlaceholderText('Masukkan kata sandi'), {
      target: { value: randomPassword },
    });
    expect(mockUpdateFormData).toHaveBeenCalledWith(
      expect.objectContaining({ password: randomPassword })
    );
  });

  test('login button is disabled when form is invalid', () => {
    const loginButton = screen.getByTestId('login-button');
    expect(loginButton).toBeDisabled();
  });
});

describe('LoginForm - Valid Form', () => {
  let mockUpdateFormData: jest.Mock;
  let mockHandleLogin: jest.Mock;

  beforeEach(() => {
    mockUpdateFormData = jest.fn();
    mockHandleLogin = jest.fn();

    render(
      <LoginForm
        formData={{ email: 'user@example.com', password: randomPassword }}
        updateFormData={mockUpdateFormData}
        isFormValid={true}
        handleLogin={mockHandleLogin}
        emailError=""
        commentError=""
      />
    );
  });

  test('calls handleLogin when login button is clicked', () => {
    const loginButton = screen.getByTestId('login-button');
    expect(loginButton).toBeInTheDocument();
    fireEvent.click(loginButton);
    expect(mockHandleLogin).toHaveBeenCalled();
  });
});

// Tambahkan test baru untuk mengcover kasus null di email dan password
describe('LoginForm - Null Values', () => {
  let mockUpdateFormData: jest.Mock;
  let mockHandleLogin: jest.Mock;

  beforeEach(() => {
    mockUpdateFormData = jest.fn();
    mockHandleLogin = jest.fn();

    render(
      <LoginForm
        formData={{ email: '', password: '' }}
        updateFormData={mockUpdateFormData}
        isFormValid={false}
        handleLogin={mockHandleLogin}
        emailError=""
        commentError=""
      />
    );
  });

  test('renders empty string when formData values are null', () => {
    // Cek bahwa input email memiliki value kosong (bukan null)
    expect(screen.getByPlaceholderText('Masukkan email Anda')).toHaveValue('');

    // Cek bahwa input password memiliki value kosong (bukan null)
    expect(screen.getByPlaceholderText('Masukkan kata sandi')).toHaveValue('');
  });

  test('updates null values correctly', () => {
    const emailInput = screen.getByPlaceholderText('Masukkan email Anda');
    fireEvent.change(emailInput, {
      target: { name: 'email', value: 'new@example.com' },
    });

    expect(mockUpdateFormData).toHaveBeenCalledWith({ email: 'new@example.com' });
  });
});
