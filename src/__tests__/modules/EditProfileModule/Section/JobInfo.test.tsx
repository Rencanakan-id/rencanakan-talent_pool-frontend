import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { setupComponentMocks } from '@/__mocks__/components/setUpComponents';
setupComponentMocks(['combobox', 'comboboxCheckbox']);
import { JobInfoSection } from '@/modules/EditProfileModule/Section/jobInfo';
import '@testing-library/jest-dom';
import { UserProfile } from '@/components/ui/profile';
import { mockUserProfile } from '@/mocks/mockProfile';

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

  it('formats price correctly to Rupiah format', () => {
    const priceInput = screen.getByTestId('price-input') as HTMLInputElement;
    fireEvent.change(priceInput, { target: { value: '2000000' } });
    expect(priceInput.value).toBe('Rp2.000.000');
  });

  it('displays correct experience label from years', () => {
    cleanup();
    const updatedProfile = { ...mockUserProfile, experienceYears: 4 };
    render(
      <JobInfoSection
        data={updatedProfile}
        initialData={completeMockInitialData}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Lama Pengalaman *')).toHaveValue('> 5 Tahun');
  });
  
  it('handles preferred location changes', () => {
    fireEvent.change(screen.getByLabelText('Bersedia Ditempatkan Di Mana *'), {
      target: { value: 'jakarta, bandung' },
    });
    expect(mockOnChange).toHaveBeenCalledWith({
      preferredLocations: ['jakarta', 'bandung'],
    });
  });

  it('handles skkLevel change', () => {
    fireEvent.change(screen.getByLabelText('Level Sertifikasi SKK *'), {
      target: { value: 'SKK Level 2' },
    });
    expect(mockOnChange).toHaveBeenCalledWith({ skkLevel: 'SKK Level 2' });
  });

  it('handles current location change', () => {
    fireEvent.change(screen.getByLabelText('Lokasi Saat Ini *'), {
      target: { value: 'surabaya' },
    });
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ currentLocation: 'surabaya' }));
  });

  it('handles skill change', () => {
    fireEvent.change(screen.getByLabelText('Keahlian *'), {
      target: { value: 'Konstruksi' },
    });
    expect(mockOnChange).toHaveBeenCalledWith({ skill: 'Konstruksi' });
  });

  it('formats price to empty string for falsy input', () => {
    cleanup();
    render(
      <JobInfoSection
        data={{ ...mockUserProfile, price: null as any }}
        initialData={completeMockInitialData}
        onChange={mockOnChange}
      />
    );
    const priceInput = screen.getByTestId('price-input') as HTMLInputElement;
    expect(priceInput.value).toBe('');
  });

  it('handles invalid experience string (parseExperienceYearsToInt fallback)', () => {
    fireEvent.change(screen.getByLabelText('Lama Pengalaman *'), {
      target: { value: 'Invalid Label' },
    });
    expect(mockOnChange).toHaveBeenCalledWith({ experienceYears: undefined });
  });

  it('returns undefined when experienceYears is not mapped (parseExperienceYearsToString)', () => {
    cleanup();
    const updatedProfile = { ...mockUserProfile, experienceYears: 999 };
    render(
      <JobInfoSection
        data={updatedProfile}
        initialData={completeMockInitialData}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Lama Pengalaman *')).toHaveValue('');
  });
});

describe('JobInfoSection additional tests', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('handles zero value in formatToRupiah', () => {
    render(
      <JobInfoSection
        data={{ ...mockUserProfile, price: 0 }}
        initialData={mockUserProfile}
        onChange={mockOnChange}
      />
    );
    const priceInput = screen.getByTestId('price-input') as HTMLInputElement;
    expect(priceInput.value).toBe('');
    fireEvent.change(priceInput, { target: { value: '1' } });
    expect(mockOnChange).toHaveBeenCalledWith({ price: '1' });
    expect(priceInput.value).toBe('Rp1');
  });

  it('correctly handles price input with non-numeric characters', () => {
    render(
      <JobInfoSection
        data={mockUserProfile}
        initialData={mockUserProfile}
        onChange={mockOnChange}
      />
    );
    const priceInput = screen.getByTestId('price-input');
    fireEvent.change(priceInput, { target: { value: 'Rp1a2b3c4d5e' } });
    expect(mockOnChange).toHaveBeenCalledWith({ price: '12345' });
    expect((priceInput as HTMLInputElement).value).toBe('Rp12.345');
  });

  it('correctly converts experienceYears between string and number for all cases', () => {
    render(
      <JobInfoSection
        data={{ ...mockUserProfile, experienceYears: 0 }}
        initialData={mockUserProfile}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Lama Pengalaman *')).toHaveValue('< 1 Tahun');
    cleanup();

    render(
      <JobInfoSection
        data={{ ...mockUserProfile, experienceYears: 1 }}
        initialData={mockUserProfile}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Lama Pengalaman *')).toHaveValue('1 Tahun');
    cleanup();

    render(
      <JobInfoSection
        data={{ ...mockUserProfile, experienceYears: 2 }}
        initialData={mockUserProfile}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Lama Pengalaman *')).toHaveValue('2-3 Tahun');
    cleanup();

    render(
      <JobInfoSection
        data={{ ...mockUserProfile, experienceYears: 3 }}
        initialData={mockUserProfile}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Lama Pengalaman *')).toHaveValue('5 Tahun');
    cleanup();
  });

  it('sets correct initial value in price input ref', () => {
    const specificPrice = 750000;
    render(
      <JobInfoSection
        data={{ ...mockUserProfile, price: specificPrice }}
        initialData={{ ...mockUserProfile, price: specificPrice }}
        onChange={mockOnChange}
      />
    );
    const priceInput = screen.getByTestId('price-input') as HTMLInputElement;
    expect(priceInput.value).toBe('Rp750.000');
    fireEvent.click(screen.getByText('Reset Perubahan'));
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ price: specificPrice }));
    expect(priceInput.value).toBe('Rp750.000');
  });
});