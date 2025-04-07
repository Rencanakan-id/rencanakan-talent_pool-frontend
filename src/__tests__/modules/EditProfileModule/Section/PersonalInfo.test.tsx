import { render, screen, fireEvent } from '@testing-library/react';
import { PersonalInfoSection } from '@/modules/EditProfileModule/Section/personalInfo';
import { UserProfile } from '@/components/ui/profile';
import '@testing-library/jest-dom';

const completeMockUserProfile: UserProfile = {
    id: "user123",
    firstName: "Rudy",
    lastName: "Handoko",
    email: "dummy@example.com",
    phoneNumber: "08123456789",
    address: "Jakarta Kota, DKI Jakarta",
    job: "Ahli Bangunan Gedung",
    photo: "image-3.png",
    aboutMe: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi...",
    price: 7550000,
    nik: "1234567890123456",
    npwp: "123456789012345",
    photoKtp: "image-3.png",
    photoNpwp: "image-3.png",
    photoIjazah: "image-3.png",
    experienceYears: 2,
    skkLevel: "profesional",
    currentLocation: "surabaya",
    preferredLocations: ["Jakarta", "Bandung", "Surabaya"],
    skill: "arsitektur",
};

const completeMockInitialData: UserProfile = {
  ...completeMockUserProfile,
  firstName: 'Initial',
  lastName: 'Name',
  email: 'initial@example.com',
  phoneNumber: '0987654321',
  nik: '9876543210987654',
  npwp: '987654321098765',
};

describe('PersonalInfoSection', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    render(
      <PersonalInfoSection
        data={completeMockUserProfile}
        initialData={completeMockInitialData}
        onChange={mockOnChange}
      />
    );
  });

  it('renders all input fields', () => {
    expect(screen.getByLabelText('Nama Depan')).toBeInTheDocument();
    expect(screen.getByLabelText('Nama Belakang')).toBeInTheDocument();
    expect(screen.getByLabelText('No. Telepon')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('No. NIK')).toBeInTheDocument();
    expect(screen.getByLabelText('No. NPWP')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const firstNameInput = screen.getByLabelText('Nama Depan');
    fireEvent.change(firstNameInput, { target: { value: 'New', name: 'firstName' } });
    expect(mockOnChange).toHaveBeenCalledWith({ firstName: 'New' });

    const emailInput = screen.getByLabelText('Email');
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