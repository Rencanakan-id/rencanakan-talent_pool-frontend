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
<<<<<<< HEAD
jest.mock('@/components/hooks/useRecommendation', () => ({
  useRecommendation: jest.fn(),
}));
=======
>>>>>>> a2f967c0d7bdc84a3185a1c18a0ea9a6fef35562

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

<<<<<<< HEAD
jest.mock('@/components/ui/recommendation', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="recommendation">Mocked Recommendation</div>),
}));

import { useUserProfile } from '@/components/hooks/useUserPorfile';
import { useExperience } from '@/components/hooks/useExperience';
import { useAuth } from '@/components/context/authContext';
import { useRecommendation } from '@/components/hooks/useRecommendation';
=======
import { useUserProfile } from '@/components/hooks/useUserPorfile';
import { useExperience } from '@/components/hooks/useExperience';
import { useAuth } from '@/components/context/authContext';
>>>>>>> a2f967c0d7bdc84a3185a1c18a0ea9a6fef35562

describe('PreviewTalentModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', () => {
    (useUserProfile as jest.Mock).mockReturnValue({ userProfile: null, isLoading: true });
    (useExperience as jest.Mock).mockReturnValue({ experience: null, isLoading: true });
<<<<<<< HEAD
    (useRecommendation as jest.Mock).mockReturnValue({ recommendations: null, isLoading: true });
=======
>>>>>>> a2f967c0d7bdc84a3185a1c18a0ea9a6fef35562

    render(<PreviewTalentModule />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

<<<<<<< HEAD
  test('renders user profile ,experience,and recommendation after loading completes', async () => {
    (useUserProfile as jest.Mock).mockReturnValue({ userProfile: {}, isLoading: false });
    (useExperience as jest.Mock).mockReturnValue({ experience: [], isLoading: false });
    (useRecommendation as jest.Mock).mockReturnValue({ recommendations: [], isLoading: false });
=======
  test('renders user profile and experience after loading completes', async () => {
    (useUserProfile as jest.Mock).mockReturnValue({ userProfile: {}, isLoading: false });
    (useExperience as jest.Mock).mockReturnValue({ experience: [], isLoading: false });
>>>>>>> a2f967c0d7bdc84a3185a1c18a0ea9a6fef35562

    render(<PreviewTalentModule />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      expect(screen.getByTestId('experience')).toBeInTheDocument();
<<<<<<< HEAD
      expect(screen.getByTestId('recommendation')).toBeInTheDocument();
=======

>>>>>>> a2f967c0d7bdc84a3185a1c18a0ea9a6fef35562
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
<<<<<<< HEAD
  });

  test('handles missing experience gracefully', async () => {
    const mockUserProfile = {
      id: '1',
      name: 'John Doe',
      preferredLocations: ['New York', 'San Francisco'],
    };

    (useUserProfile as jest.Mock).mockReturnValue({
      userProfile: mockUserProfile,
      isLoading: false,
    });
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

  test('handles missing recommendation gracefully', async () => {
    const mockUserProfile = {
      id: '1',
      name: 'John Doe',
      preferredLocations: ['New York', 'San Francisco'],
    };

    (useUserProfile as jest.Mock).mockReturnValue({
      userProfile: mockUserProfile,
      isLoading: false,
    });
    (useExperience as jest.Mock).mockReturnValue({ experience: [], isLoading: false });
    (useRecommendation as jest.Mock).mockReturnValue({
      recommendations : null,
      isLoading: false,
    });
    render(<PreviewTalentModule />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();

      // User Profile should be rendered
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();

      // Experience should NOT be rendered
      expect(screen.queryByTestId('experience')).toBeInTheDocument();

      // Location should be rendered
      expect(screen.getByTestId('location')).toBeInTheDocument();
      // Recommendation should NOT be rendered
      expect(screen.queryByTestId('recommendation')).not.toBeInTheDocument();

    });
  });

=======
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
  

>>>>>>> a2f967c0d7bdc84a3185a1c18a0ea9a6fef35562
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

<<<<<<< HEAD
  test('handles userProfile with null preferredLocations gracefully', async () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      userProfile: { preferredLocations: null },
      isLoading: false,
    });
=======
 

  test('handles userProfile with null preferredLocations gracefully', async () => {
    (useUserProfile as jest.Mock).mockReturnValue({ userProfile: { preferredLocations: null }, isLoading: false });
>>>>>>> a2f967c0d7bdc84a3185a1c18a0ea9a6fef35562
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
<<<<<<< HEAD
    (useAuth as jest.Mock).mockReturnValue({ token: null, user: null });
=======
    (useAuth as jest.Mock).mockReturnValue({ token: null, user:null });
>>>>>>> a2f967c0d7bdc84a3185a1c18a0ea9a6fef35562
    (useUserProfile as jest.Mock).mockReturnValue({ userProfile: null, isLoading: false });
    (useExperience as jest.Mock).mockReturnValue({ experience: null, isLoading: false });

    render(<PreviewTalentModule />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.queryByTestId('user-profile')).not.toBeInTheDocument();
      expect(screen.queryByTestId('experience')).not.toBeInTheDocument();
      expect(screen.queryByTestId('location')).not.toBeInTheDocument();
<<<<<<< HEAD
      expect(screen.queryByTestId('recommendation')).not.toBeInTheDocument();
=======
>>>>>>> a2f967c0d7bdc84a3185a1c18a0ea9a6fef35562
    });
  });
});
