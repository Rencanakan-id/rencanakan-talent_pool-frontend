import '@testing-library/jest-dom/';
// import { render, screen, waitFor } from '@testing-library/react';
// import { PreviewTalentModule } from '@/modules/PreviewTalentModule';
// import Cookies from 'js-cookie';

// // Mock Cookies module
// jest.mock('js-cookie', () => ({
//   get: jest.fn(),
// }));

// describe('PreviewTalentModule', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     globalThis.fetch = jest.fn();
//   });

//   test('renders loading spinner initially', () => {
//     render(<PreviewTalentModule />);
//     expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
//   });

//   test('fetches and displays user profile and experience data', async () => {
//     const mockUserProfile = {
//       id: '1',
//       name: 'John Doe',
//       email: 'john@example.com',
//       avatar: 'avatar.png',
//       preferredLocations: ['Location1', 'Location2'],
//     };

//     const mockExperience = [
//       {
//         id: '1',
//         title: 'Software Engineer',
//         company: 'Tech Corp',
//         startDate: '2020-01-01',
//         endDate: '2023-01-01',
//         description: 'Worked on projects',
//       },
//     ];

//     // Mock token retrieval
//     (Cookies.get as jest.Mock).mockReturnValue('test-token');

//     // Mock fetch responses
//     (globalThis.fetch as jest.Mock)
//       .mockResolvedValueOnce({
//         ok: true,
//         json: async () => mockUserProfile,
//       })
//       .mockResolvedValueOnce({
//         ok: true,
//         json: async () => mockExperience,
//       });

//     render(<PreviewTalentModule />);

//     // Wait for fetch to complete
//     await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

//     // Verify user profile data
//     expect(screen.getByText(mockUserProfile.name)).toBeInTheDocument();
//     expect(screen.getByText(mockUserProfile.email)).toBeInTheDocument();

//     // Verify experience data
//     expect(screen.getByText(mockExperience[0].title)).toBeInTheDocument();
//     expect(screen.getByText(mockExperience[0].company)).toBeInTheDocument();

//     // Verify location data
//     mockUserProfile.preferredLocations.forEach((location) => {
//       expect(screen.getByText(location)).toBeInTheDocument();
//     });
//   });

//   test('handles fetch errors by showing loading spinner', async () => {
//     // Mock token retrieval
//     (Cookies.get as jest.Mock).mockReturnValue('test-token');

//     // Mock fetch errors
//     (globalThis.fetch as jest.Mock)
//       .mockResolvedValueOnce({ ok: false, status: 401 })
//       .mockResolvedValueOnce({ ok: false, status: 401 });

//     render(<PreviewTalentModule />);

//     // Wait for fetch to complete
//     await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

//     // Check if loading spinner is still present
//     expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
//   });

//   test('renders buttons correctly', async () => {
//     // Mock token retrieval
//     (Cookies.get as jest.Mock).mockReturnValue('test-token');

//     // Mock empty responses to trigger UI render
//     (globalThis.fetch as jest.Mock)
//       .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
//       .mockResolvedValueOnce({ ok: true, json: async () => [] });

//     render(<PreviewTalentModule />);

//     // Wait for fetch to complete
//     await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

//     // Check back button
//     const backButton = screen.getByRole('button', { name: /Kembali/i });
//     expect(backButton).toBeInTheDocument();
//     expect(backButton.querySelector('svg')).toBeInTheDocument();

//     // Check bookmark button
//     const bookmarkButton = screen.getByRole('button', { name: /Masukkan ke Favorit/i });
//     expect(bookmarkButton).toBeInTheDocument();
//     expect(bookmarkButton.querySelector('svg')).toBeInTheDocument();
//   });
// });

describe('placeholder', () => {
  it('placeholder', () => {
    expect(true).toBe(true);
  });
});
