// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { EditProfileModule } from '@/modules/EditProfileModule';
// import { UserProfile } from '@/components/ui/profile';
// import '@testing-library/jest-dom';
// import axios from 'axios';

// jest.mock('@/components/hooks/useUserProfile');
// jest.mock('@/components/context/authContext', () => ({
//   useAuth: () => ({
//     token: 'dummy-token',
//   }),
// }));
// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => mockNavigate,
// }));

// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// const mockUserProfile: UserProfile = {
//   id: "user123",
//   firstName: "Rudy",
//   lastName: "Handoko",
//   email: "dummy@example.com",
//   phoneNumber: "08123456789",
//   address: "Jakarta Kota, DKI Jakarta",
//   job: "Ahli Bangunan Gedung",
//   photo: "",
//   aboutMe: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi...",
//   price: 7550000,
//   nik: "1234567890123456",
//   npwp: "123456789012345",
//   photoKtp: "image-3.png",
//   photoNpwp: "image-3.png",
//   photoIjazah: "image-3.png",
//   experienceYears: 2,
//   skkLevel: "profesional",
//   currentLocation: "surabaya",
//   preferredLocations: ["Jakarta", "Bandung", "Surabaya"],
//   skill: "arsitektur",
// };

// const { useUserProfile } = jest.requireMock('@/components/hooks/useUserProfile');

// beforeEach(() => {
//   useUserProfile.mockReturnValue({
//     userProfile: mockUserProfile,
//     isLoading: false,
//   });
//   mockedAxios.put.mockReset();
//   mockNavigate.mockReset();
// });

// afterEach(() => {
//   jest.restoreAllMocks();
// });


// test('renders EditProfileModule and displays user data', () => {
//   render(<EditProfileModule />);
  
//   expect(screen.getByText('Simpan Perubahan')).toBeInTheDocument();
//   expect(screen.getByText('Kembali')).toBeInTheDocument();
//   expect(screen.getByDisplayValue('Rudy')).toBeInTheDocument();
// });

// test('updates profile on save', async () => {
//   mockedAxios.put.mockResolvedValueOnce({
//     data: { data: { ...mockUserProfile, firstName: 'Jane' } },
//   });

//   render(<EditProfileModule />);

//   const input = screen.getByDisplayValue('Rudy');
//   fireEvent.change(input, { target: { value: 'Jane' } });
//   fireEvent.click(screen.getByText('Simpan Perubahan'));

//   await waitFor(() => {
//     expect(mockedAxios.put).toHaveBeenCalledWith(
//       'http://localhost:8081/api/users/user123',
//       expect.objectContaining({ firstName: 'Jane' }),
//       expect.objectContaining({
//         headers: expect.objectContaining({
//           Authorization: 'Bearer dummy-token',
//         }),
//       })
//     );
//     expect(mockNavigate).toHaveBeenCalledWith('/preview');
//   });
// });

// test('resets personal info section on reset button click', async () => {
//   render(<EditProfileModule />);

//   const input = screen.getByDisplayValue('Rudy');
//   fireEvent.change(input, { target: { value: 'Changed Name' } });

//   const resetButton = screen.getAllByText('Reset Perubahan')[0];
//   fireEvent.click(resetButton);

//   await waitFor(() => {
//     expect(screen.getByDisplayValue('Rudy')).toBeInTheDocument();
//   });
// });

// test('shows loading spinner when user data is loading', () => {
//   useUserProfile.mockReturnValueOnce({
//     userProfile: null,
//     isLoading: true,
//   });

//   render(<EditProfileModule />);
//   expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
// });

// test('shows error on profile update failure', async () => {
//   const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
//   mockedAxios.put.mockRejectedValueOnce(new Error('Update failed'));

//   render(<EditProfileModule />);

//   const input = screen.getByDisplayValue('Rudy');
//   fireEvent.change(input, { target: { value: 'Jane' } });
//   fireEvent.click(screen.getByText('Simpan Perubahan'));

//   await waitFor(() => {
//     expect(consoleSpy).toHaveBeenCalledWith(
//       expect.stringContaining('Failed to update profile:'),
//       expect.any(Error)
//     );
//   });

//   consoleSpy.mockRestore();
// });

// test('handles photo change', async () => {
//   render(<EditProfileModule />);

//   const file = new File(['photo'], 'profile.png', { type: 'image/png' });
//   const input = screen.getByLabelText(/foto diri/i);

//   fireEvent.change(input, { target: { files: [file] } });

//   await waitFor(() => {
//     expect((input as HTMLInputElement).files![0]).toBe(file);
//   });
// });

// test('navigates back when clicking Kembali', () => {
//   render(<EditProfileModule />);
//   fireEvent.click(screen.getByText('Kembali'));
//   expect(mockNavigate).toHaveBeenCalledWith('/preview');
// });

// test('loads initial profile image from /dummy/profile.png', async () => {
//   const mockBlob = new Blob(['fake-image'], { type: 'image/png' });
//   const mockFetch = jest.fn(() =>
//     Promise.resolve({
//       blob: () => Promise.resolve(mockBlob),
//     })
//   ) as jest.Mock;

//   global.fetch = mockFetch;

//   render(<EditProfileModule />);

//   await waitFor(() => {
//     expect(mockFetch).toHaveBeenCalledWith('/dummy/profile.png');
//   });
// });

// test('handles manual photo change via ImageUpload', async () => {
//   render(<EditProfileModule />);

//   const newPhoto = new File(['hello'], 'newphoto.png', { type: 'image/png' });
//   const fileInput = screen.getByLabelText(/foto diri/i) as HTMLInputElement;
//   fireEvent.change(fileInput, { target: { files: [newPhoto] } });

//   await waitFor(() => {
//     expect(fileInput.files?.[0]).toBe(newPhoto);
//   });
// });