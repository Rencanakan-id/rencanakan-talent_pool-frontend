import { render, screen, fireEvent } from '@testing-library/react';
import { JobInfoSection } from '@/modules/EditProfileModule/Section/jobInfo';
import '@testing-library/jest-dom';
import { UserProfile } from '@/components/ui/profile';
import { mockUserProfile } from '@/mocks/mockProfile';

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

const completeMockInitialData: UserProfile = mockUserProfile

describe('JobInfoSection', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    render(
      <JobInfoSection
        data={mockUserProfile}
        initialData={completeMockInitialData}
        onChange={mockOnChange}
      />
    );
  });

  it('renders all form fields', () => {
    expect(screen.getByTestId('about-me')).toBeInTheDocument();
    expect(screen.getByLabelText('Lama Pengalaman *')).toBeInTheDocument();
    expect(screen.getByLabelText('Level Sertifikasi SKK *')).toBeInTheDocument();
    expect(screen.getByLabelText('Lokasi Saat Ini *')).toBeInTheDocument();
    expect(screen.getByText('Bersedia Ditempatkan Di Mana *')).toBeInTheDocument();
    expect(screen.getByLabelText('Keahlian *')).toBeInTheDocument();
    expect(screen.getByTestId('price-input')).toBeInTheDocument();
  });

  it('handles about me change', () => {
    const textarea = screen.getByTestId('about-me');
    fireEvent.change(textarea, { target: { value: 'New about me' } });
    expect(mockOnChange).toHaveBeenCalledWith({ aboutMe: 'New about me' });
  });

  it('handles price change and formats correctly', () => {
    const priceInput = screen.getByTestId('price-input');
    fireEvent.change(priceInput, { target: { value: '2000000' } });
    expect(mockOnChange).toHaveBeenCalledWith({ price: '2000000' });
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