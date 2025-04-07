import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobInfoSection } from '@/modules/EditProfileModule/Section/jobInfo';
import '@testing-library/jest-dom';
import { UserProfile } from '@/components/ui/profile';

interface ComboboxProps {
  label: string;
  onChange: (value: string) => void;
  value?: string;
  error?: string;
}

jest.mock('@/components/ui/combobox', () => ({
  Combobox: ({ label, onChange, value, error }: ComboboxProps) => (
    <div>
      <label>{label}</label>
      <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} aria-label={label} />
      {error && <div className="error-message">{error}</div>}
    </div>
  ),
}));

interface ComboboxCheckBoxProps {
  label: string;
  onChange: (values: string[]) => void;
  values?: string[];
  placeholder?: string;
  error?: string;
}

jest.mock('@/components/ui/comboboxCheckbox', () => ({
  ComboboxCheckBox: ({ label, onChange, values, placeholder, error }: ComboboxCheckBoxProps) => {
    const displayValues = (values || []).map((v) => v.charAt(0).toUpperCase() + v.slice(1));

    return (
      <div>
        <label>{label}</label>
        <input
          value={displayValues.join(', ')}
          onChange={(e) => onChange(e.target.value.split(', '))}
          placeholder={placeholder ?? ''}
          aria-label={label}
        />
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  },
}));

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

interface TextareaProps {
  textLabel: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

jest.mock('@/components', () => ({
  Typography: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  Button: ({ children, onClick, variant }: { children: React.ReactNode; onClick: () => void; variant?: string }) => (
    <button onClick={onClick} className={variant}>
      {children}
    </button>
  ),
  Stepper: ({ currentStep }: { currentStep: number }) => (
    <div>{`Current step: ${currentStep}`}</div>
  ),
  Input: ({ name, label, placeholder, type, value, onChange, error, className }: InputProps) => (
    <div className={className}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        placeholder={placeholder ?? ''}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        aria-label={label}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  ),
  Textarea: ({ textLabel, placeholder, value, onChange, error }: TextareaProps) => (
    <div>
      <label>{textLabel}</label>
      <textarea
        placeholder={placeholder ?? ''}
        value={value ?? ''}
        onChange={onChange}
        aria-label={textLabel}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  ),
}));

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
  aboutMe: 'Initial about me',
  experienceYears: 2,
  skkLevel: 'SKK Level 2',
};

describe('JobInfoSection', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    render(
      <JobInfoSection
        data={completeMockUserProfile}
        initialData={completeMockInitialData}
        onChange={mockOnChange}
      />
    );
  });

  it('renders all form fields', () => {
    expect(screen.getByLabelText('Tentang Saya')).toBeInTheDocument();
    expect(screen.getByLabelText('Lama Pengalaman *')).toBeInTheDocument();
    expect(screen.getByLabelText('Level Sertifikasi SKK *')).toBeInTheDocument();
    expect(screen.getByLabelText('Lokasi Saat Ini *')).toBeInTheDocument();
    expect(screen.getByText('Bersedia Ditempatkan Di Mana *')).toBeInTheDocument();
    expect(screen.getByLabelText('Keahlian *')).toBeInTheDocument();
    expect(screen.getByLabelText('Harga')).toBeInTheDocument();
  });

  it('handles about me change', () => {
    const textarea = screen.getByLabelText('Tentang Saya');
    fireEvent.change(textarea, { target: { value: 'New about me' } });
    expect(mockOnChange).toHaveBeenCalledWith({ aboutMe: 'New about me' });
  });

  it('handles price change and formats correctly', () => {
    const priceInput = screen.getByLabelText('Harga');
    fireEvent.change(priceInput, { target: { value: 'Rp2.000.000' } });
    expect(mockOnChange).toHaveBeenCalledWith({ price: 2000000 });
  });

  it('resets form when reset button is clicked', () => {
    fireEvent.click(screen.getByText('Reset Perubahan'));
    expect(mockOnChange).toHaveBeenCalledWith({
      aboutMe: completeMockInitialData.aboutMe,
      experienceYears: completeMockInitialData.experienceYears,
      skkLevel: completeMockInitialData.skkLevel,
      currentLocation: completeMockInitialData.currentLocation,
      preferredLocations: completeMockInitialData.preferredLocations,
      skill: completeMockInitialData.skill,
      price: completeMockInitialData.price,
    });
  });
});