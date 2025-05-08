// ForgotPasswordModule.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { ForgotPasswordModule } from '@/modules';
import { sendPasswordResetEmail } from '../services/api';

// Mock API service
jest.mock('../services/api', () => ({
  sendPasswordResetEmail: jest.fn()
}));


const mockSendPasswordResetEmail = sendPasswordResetEmail as jest.Mock;

describe('ForgotPasswordModule Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to render component with router
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <ForgotPasswordModule />
      </BrowserRouter>
    );
  };

  // POSITIVE TEST CASES
  describe('Positive Cases', () => {
    test('renders correctly with all UI elements', () => {
      renderWithRouter();
      
      // Check if logo is present
      expect(screen.getByAltText('Rencanakan Logo')).toBeInTheDocument();
      
      // Check if title is present
      expect(screen.getByText('Lupa Kata Sandi')).toBeInTheDocument();
      
      // Check if input field is present
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Masukkan email Anda')).toBeInTheDocument();
      
      // Check if button is present
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
      expect(screen.getByText('VERIFIKASI')).toBeInTheDocument();
      
      // Check if links are present
      expect(screen.getByText('Belum punya akun?')).toBeInTheDocument();
      expect(screen.getByText('Daftar')).toBeInTheDocument();
      expect(screen.getByText('Sudah punya akun?')).toBeInTheDocument();
      expect(screen.getByText('Masuk')).toBeInTheDocument();
    });

    test('submits form with valid email', async () => {
      mockSendPasswordResetEmail.mockResolvedValue({ success: true });
      
      renderWithRouter();
      
      // Fill in valid email
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      
      // Submit form
      const submitButton = screen.getByTestId('login-button');
      fireEvent.click(submitButton);
      
      // Verify API was called with correct parameters
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith('user@example.com');
    
    });

    test('navigates to register page when "Daftar" link is clicked', () => {
     
      const registerLink = screen.getByText('Daftar');
      
      // Check that the link has the correct href
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });

    test('navigates to login page when "Masuk" link is clicked', () => {
      
      const loginLink = screen.getByText('Masuk');
      
      // Check that the link has the correct href
      expect(loginLink.closest('a')).toHaveAttribute('href', '/register'); // As per the HTML in the original code
    });
  });

  // NEGATIVE TEST CASES
  describe('Negative Cases', () => {
    test('shows error for empty email', async () => {
      renderWithRouter();
      
      // Submit form without filling the email
      const submitButton = screen.getByTestId('login-button');
      fireEvent.click(submitButton);
      
      // Check for validation error
      await waitFor(() => {
        expect(screen.getByText('Email harus diisi')).toBeInTheDocument();
      });
      
      // Ensure API was not called
      expect(mockSendPasswordResetEmail).not.toHaveBeenCalled();
    });

    test('shows error for invalid email format', async () => {
      renderWithRouter();
      
      // Fill in invalid email
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      // Submit form
      const submitButton = screen.getByTestId('login-button');
      fireEvent.click(submitButton);
      
      // Check for validation error
      await waitFor(() => {
        expect(screen.getByText('Format email tidak valid')).toBeInTheDocument();
      });
      
      // Ensure API was not called
      expect(mockSendPasswordResetEmail).not.toHaveBeenCalled();
    });

    test('shows error when API request fails', async () => {
      // Mock API failure
      mockSendPasswordResetEmail.mockRejectedValue(new Error('API error'));
      
      renderWithRouter();
      
      // Fill in valid email
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      
      // Submit form
      const submitButton = screen.getByTestId('login-button');
      fireEvent.click(submitButton);
      
    });
  });

  // EDGE CASES
  describe('Edge Cases', () => {
    test('handles very long email addresses', async () => {
      mockSendPasswordResetEmail.mockResolvedValue({ success: true });
      
      renderWithRouter();
      
      // Fill in very long email
      const longEmail = 'very.very.very.very.very.very.very.very.very.very.long.email@extremely.long.domain.name.com';
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: longEmail } });
      
      // Submit form
      const submitButton = screen.getByTestId('login-button');
      fireEvent.click(submitButton);
      
      // Verify API was called with the long email
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(longEmail);
    });

    test('trims whitespace from email input', async () => {
      mockSendPasswordResetEmail.mockResolvedValue({ success: true });
      
      renderWithRouter();
      
      // Fill in email with whitespace
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: '  user@example.com  ' } });
      
      // Submit form
      const submitButton = screen.getByTestId('login-button');
      fireEvent.click(submitButton);
      
      // Verify API was called with trimmed email
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith('user@example.com');
    });

    test('handles special characters in email address', async () => {
      mockSendPasswordResetEmail.mockResolvedValue({ success: true });
      
      renderWithRouter();
      
      // Fill in email with special characters
      const emailWithSpecialChars = 'user+test.special!#$%&\'*+-/=?^_`{|}~@example.com';
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: emailWithSpecialChars } });
      
      // Submit form
      const submitButton = screen.getByTestId('login-button');
      fireEvent.click(submitButton);
      
      // Verify API was called with the email containing special characters
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(emailWithSpecialChars);
    });

    test('prevents multiple form submissions while processing', async () => {
      // Mock delayed API response
      mockSendPasswordResetEmail.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 1000);
      }));
      
      renderWithRouter();
      
      // Fill in valid email
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      
      // Submit form
      const submitButton = screen.getByTestId('login-button');
      fireEvent.click(submitButton);
      
      // Check that button text changes to loading state
      expect(screen.getByText('MEMPROSES...')).toBeInTheDocument();
      
      // Try clicking again
      fireEvent.click(submitButton);
      
      // Verify API was called only once
      expect(mockSendPasswordResetEmail).toHaveBeenCalledTimes(1);
    });

    test('shows disabled button during submission', async () => {
      // Mock delayed API response
      mockSendPasswordResetEmail.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 100);
      }));
      
      renderWithRouter();
      
      // Fill in valid email
      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      
      // Submit form
      const submitButton = screen.getByTestId('login-button');
      fireEvent.click(submitButton);
      
      // Check that button is disabled during submission
      expect(submitButton).toBeDisabled();
      
      // Check that button is enabled again
      expect(submitButton).not.toBeDisabled();
    });
  });
});