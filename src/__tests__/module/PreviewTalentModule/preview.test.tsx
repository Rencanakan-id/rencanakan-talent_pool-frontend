import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/';
import { PreviewTalentModule } from '@/modules/PreviewTalentModule';

jest.mock('@/components/context/authContext', () => ({
  useAuth: jest.fn(() => ({
    user: { id: '1' },
    token: 'test-token',
  })),
}));

describe('PreviewTalentModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = jest.fn();
  });

  test('renders loading spinner initially', () => {
    render(<PreviewTalentModule />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('fetches and displays user profile and experience data', async () => {
    const mockUserProfile = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'avatar.png',
      preferredLocations: ['Location1', 'Location2'],
    };

    const mockExperience = [
      {
        id: '1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        startDate: '2020-01-01',
        endDate: '2023-01-01',
        description: 'Worked on projects',
      },
    ];

    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserProfile,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockExperience }),
      });

    render(<PreviewTalentModule />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    expect(screen.getByText(mockUserProfile.name)).toBeInTheDocument();
    expect(screen.getByText(mockUserProfile.email)).toBeInTheDocument();
    expect(screen.getByText(mockExperience[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockExperience[0].company)).toBeInTheDocument();

    mockUserProfile.preferredLocations.forEach((location) => {
      expect(screen.getByText(location)).toBeInTheDocument();
    });
  });

  test('handles fetch errors by showing loading spinner', async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: false, status: 401 })
      .mockResolvedValueOnce({ ok: false, status: 401 });

    render(<PreviewTalentModule />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders buttons correctly', async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(<PreviewTalentModule />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    const backButton = screen.getByRole('button', { name: /Kembali/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton.querySelector('svg')).toBeInTheDocument();
  });
  test('shows loading spinner while fetching data', async () => {
    // Simulasi fetch dengan delay 500ms
    (globalThis.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ ok: true, json: async () => ({}) });
          }, 500);
        })
    );

    render(<PreviewTalentModule />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });
  test('hides loading spinner and shows content when data is loaded', async () => {
    const mockUserProfile = {
      id: '1',
      name: 'John Doe',
      preferredLocations: ['Location1', 'Location2'],
    };

    const mockExperience = [{ id: '1', title: 'Software Engineer', company: 'Tech Corp' }];

    // Mock fetch dengan data valid
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockUserProfile }) // Fetch user profile
      .mockResolvedValueOnce({ ok: true, json: async () => mockExperience }); // Fetch experience

    render(<PreviewTalentModule />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();

    expect(screen.getByText(mockUserProfile.name)).toBeInTheDocument();
    expect(screen.getByText(mockExperience[0].title)).toBeInTheDocument();
  });
  test('handles userProfile as undefined gracefully', async () => {
    (globalThis.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: async () => null }))
      .mockImplementationOnce(
        () =>
          Promise.resolve({
            ok: true,
            json: async () => ({ data: [{ title: 'Software Engineer', company: 'Tech Corp' }] }),
          }) // Experience data
      );

    render(<PreviewTalentModule />);

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(2));

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
  });
  test('handles experience as undefined gracefully', async () => {
    const mockUserProfile = {
      id: '1',
      name: 'John Doe',
      preferredLocations: ['Location1', 'Location2'],
    };

    (globalThis.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({ ok: true, json: async () => mockUserProfile })
      )
      .mockImplementationOnce(() => Promise.resolve({ ok: true, json: async () => ({}) }));

    render(<PreviewTalentModule />);

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(2));

    expect(screen.getByText(mockUserProfile.name)).toBeInTheDocument();

    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
  });
  test('handles userProfile with null preferredLocations gracefully', async () => {
    const mockUserProfile = {
      id: '1',
      name: 'John Doe',
      preferredLocations: null,
    };

    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockUserProfile })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [] }) });

    render(<PreviewTalentModule />);

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(2));

    expect(screen.getByText('John Doe')).toBeInTheDocument(); // ✅ This should pass

    expect(screen.queryByText('Location1')).not.toBeInTheDocument();
    expect(screen.queryByText('Location2')).not.toBeInTheDocument();
  });
});
