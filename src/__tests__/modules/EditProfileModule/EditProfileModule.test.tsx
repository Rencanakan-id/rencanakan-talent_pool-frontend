import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditProfileModule } from '@/modules/EditProfileModule';
import { UserProfile } from '@/components/ui/profile';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock necessary hooks
jest.mock('@/components/hooks/useUserProfile', () => ({
  useUserProfile: () => ({
    userProfile: mockUserProfile,
    isLoading: false,
  }),
}));

jest.mock('@/components/context/authContext', () => ({
  useAuth: () => ({
    token: 'dummy-token',
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockUserProfile: UserProfile = {
  id: "user123",
  firstName: "Rudy",
  lastName: "Handoko",
  email: "dummy@example.com",
  phoneNumber: "08123456789",
  address: "Jakarta Kota, DKI Jakarta",
  job: "Ahli Bangunan Gedung",
  photo: "",
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

test('renders EditProfileModule and displays user data', async () => {
  render(<EditProfileModule />);
  
  expect(screen.getByText('Simpan Perubahan')).toBeInTheDocument();
  expect(screen.getByText('Kembali')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Rudy')).toBeInTheDocument(); // Input for first name
});

test('updates profile on save', async () => {
  mockedAxios.put.mockResolvedValueOnce({
    data: { data: { ...mockUserProfile, firstName: 'Jane' } },
  });

  render(<EditProfileModule />);

  const input = screen.getByDisplayValue('Rudy'); // original value
  fireEvent.change(input, { target: { value: 'Jane' } });

  fireEvent.click(screen.getByText('Simpan Perubahan'));

  await waitFor(() => {
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BASE_URL}/users/user123`,
      expect.objectContaining({ firstName: 'Jane' }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer dummy-token',
        }),
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith('/preview');
  });
});
