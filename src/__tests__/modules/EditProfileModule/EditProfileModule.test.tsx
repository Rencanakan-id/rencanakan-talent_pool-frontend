import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditProfileModule } from '@/modules/EditProfileModule';
import { UserProfile } from '@/components/ui/profile';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import axios from 'axios';

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


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  fetchMock.resetMocks();
  localStorage.setItem('authToken', 'dummy-token');
});

test('renders EditProfileModule and displays user data', async () => {
  render(<EditProfileModule userProfile={mockUserProfile} />);
  
  expect(screen.getByText('Simpan Perubahan')).toBeInTheDocument();
  expect(screen.getByText('Kembali')).toBeInTheDocument();
});

test('updates profile on save', async () => {
  mockedAxios.put.mockResolvedValueOnce({
    data: { data: { ...mockUserProfile, firstName: 'Jane' } },
  });

  render(<EditProfileModule userProfile={mockUserProfile} />);

  const input = screen.getByTestId('first-name');
  fireEvent.change(input, { target: { value: 'Jane' } });

  fireEvent.click(screen.getByText('Simpan Perubahan'));

  await waitFor(() => {
    expect(mockedAxios.put).toHaveBeenCalledWith(
      '/users/user123',
      expect.objectContaining({ firstName: 'Jane' }),
      expect.any(Object)
    );
  });
});
