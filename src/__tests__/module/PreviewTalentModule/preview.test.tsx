import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/';
import { PreviewTalentModule } from '@/modules/PreviewTalentModule';

// Mock hooks
jest.mock('@/components/context/authContext', () => ({
  useAuth: jest.fn(() => ({ user: { id: '1' } })),
}));

jest.mock('@/components/hooks/useUserPorfile', () => ({
  useUserProfile: jest.fn(),
}));

jest.mock('@/components/hooks/useExperience', () => ({
  useExperience: jest.fn(),
}));

jest.mock('@/components/ui/profile', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="user-profile">Mocked Profile</div>),
}));

jest.mock('@/components/ui/experience', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="experience">Mocked Experience</div>),
}));

jest.mock('@/components/ui/location', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="location">Mocked Location</div>),
}));

import { useUserProfile } from '@/components/hooks/useUserPorfile';
import { useExperience } from '@/components/hooks/useExperience';
import { useAuth } from '@/components/context/authContext';

describe('PreviewTalentModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', () => {
    (useUserProfile as jest.Mock).mockReturnValue({ userProfile: null, isLoading: true });
    (useExperience as jest.Mock).mockReturnValue({ experience: null, isLoading: true });

    render(<PreviewTalentModule />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders user profile and experience after loading completes', async () => {
    (useUserProfile as jest.Mock).mockReturnValue({ userProfile: {}, isLoading: false });
    (useExperience as jest.Mock).mockReturnValue({ experience: [], isLoading: false });

    render(<PreviewTalentModule />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      expect(screen.getByTestId('experience')).toBeInTheDocument();

    });
  });

  test('handles missing user profile gracefully', async () => {
    (useUserProfile as jest.Mock).mockReturnValue({ userProfile: null, isLoading: false });
    (useExperience as jest.Mock).mockReturnValue({ experience: [], isLoading: false });

    render(<PreviewTalentModule />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.queryByTestId('user-profile')).not.toBeInTheDocument();
      expect(screen.getByTestId('experience')).toBeInTheDocument();
    });
  });

  test('handles missing experience gracefully', async () => {
    const mockUserProfile = {
      id: '1',
      name: 'John Doe',
      preferredLocations: ['New York', 'San Francisco'],
    };
  
    (useUserProfile as jest.Mock).mockReturnValue({ userProfile: mockUserProfile, isLoading: false });
    (useExperience as jest.Mock).mockReturnValue({ experience: null, isLoading: false });
  
    render(<PreviewTalentModule />);
  
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      
      // User Profile should be rendered
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      
      // Experience should NOT be rendered
      expect(screen.queryByTestId('experience')).not.toBeInTheDocument();
      
      // Location should be rendered
      expect(screen.getByTestId('location')).toBeInTheDocument();
    });
  });
  

  test('renders buttons correctly', async () => {
    (useUserProfile as jest.Mock).mockReturnValue({ userProfile: {}, isLoading: false });
    (useExperience as jest.Mock).mockReturnValue({ experience: [], isLoading: false });

    render(<PreviewTalentModule />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /Kembali/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton.querySelector('svg')).toBeInTheDocument();
  });

 

  test('handles userProfile with null preferredLocations gracefully', async () => {
    (useUserProfile as jest.Mock).mockReturnValue({ userProfile: { preferredLocations: null }, isLoading: false });
    (useExperience as jest.Mock).mockReturnValue({ experience: [], isLoading: false });

    render(<PreviewTalentModule />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      expect(screen.getByTestId('experience')).toBeInTheDocument();
      expect(screen.queryByTestId('location')).not.toBeInTheDocument();
    });
  });

  test('handles missing user gracefully', async () => {
    (useAuth as jest.Mock).mockReturnValue({ token: null, user:null });
    (useUserProfile as jest.Mock).mockReturnValue({ userProfile: null, isLoading: false });
    (useExperience as jest.Mock).mockReturnValue({ experience: null, isLoading: false });

    render(<PreviewTalentModule />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.queryByTestId('user-profile')).not.toBeInTheDocument();
      expect(screen.queryByTestId('experience')).not.toBeInTheDocument();
      expect(screen.queryByTestId('location')).not.toBeInTheDocument();
    });
  });
});
