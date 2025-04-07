import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditProfileModule } from '@/modules/EditProfileModule';
import { UserProfile } from '@/components/ui/profile';
import '@testing-library/jest-dom';

const mockUserProfile: UserProfile = {
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

describe('EditProfileModule', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    render(<EditProfileModule userProfile={mockUserProfile} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders form after loading', async () => {
    render(<EditProfileModule userProfile={mockUserProfile} />);
    await waitFor(() => {
      expect(screen.getByText('Kembali')).toBeInTheDocument();
      expect(screen.getByText('Simpan Perubahan')).toBeInTheDocument();
    });
  });

  it('handles save button click', async () => {
    render(<EditProfileModule userProfile={mockUserProfile} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Simpan Perubahan'));
    });
    // Add your assertions for save behavior here
  });

  it('handles photo change', async () => {
    const file = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });
    render(<EditProfileModule userProfile={mockUserProfile} />);
    
    await waitFor(() => {
      const input = screen.getByLabelText('Foto Diri') as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });
    });
    
    // Add assertions for photo change
  });
});