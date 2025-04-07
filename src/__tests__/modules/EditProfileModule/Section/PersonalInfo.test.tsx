import { render, screen, fireEvent } from '@testing-library/react';
import { PersonalInfoSection } from '@/modules/EditProfileModule/Section/personalInfo';
import { UserProfile } from '@/components/ui/profile';
import { mockUserProfile } from '@/mocks/mockProfile';

import '@testing-library/jest-dom';

const completeMockInitialData: UserProfile = mockUserProfile

describe('PersonalInfoSection', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    render(
      <PersonalInfoSection
        data={mockUserProfile}
        initialData={completeMockInitialData}
        onChange={mockOnChange}
      />
    );
  });

  it('renders all input fields', () => {
    expect(screen.getByTestId('first-name')).toBeInTheDocument();
    expect(screen.getByTestId('last-name')).toBeInTheDocument();
    expect(screen.getByTestId('phone-number')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('nik-input')).toBeInTheDocument();
    expect(screen.getByTestId('npwp-input')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const firstNameInput = screen.getByTestId('first-name');
    fireEvent.change(firstNameInput, { target: { value: 'New', name: 'firstName' } });
    expect(mockOnChange).toHaveBeenCalledWith({ firstName: 'New' });

    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'new@example.com', name: 'email' } });
    expect(mockOnChange).toHaveBeenCalledWith({ email: 'new@example.com' });
  });

  it('resets form when reset button is clicked', () => {
    fireEvent.click(screen.getByText('Reset Perubahan'));
    expect(mockOnChange).toHaveBeenCalledWith({
      firstName: completeMockInitialData.firstName,
      lastName: completeMockInitialData.lastName,
      email: completeMockInitialData.email,
      phoneNumber: completeMockInitialData.phoneNumber,
      nik: completeMockInitialData.nik,
      npwp: completeMockInitialData.npwp,
    });
  });
});