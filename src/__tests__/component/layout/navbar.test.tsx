/* eslint-disable @typescript-eslint/no-require-imports */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { AuthContextProvider } from '@/components/context/authContext';
import {Navbar} from '@/components/layout/navbar';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Mock dependencies
jest.mock('axios');
jest.mock('js-cookie', () => ({
  set: jest.fn(),
  remove: jest.fn(),
  get: jest.fn(),
}));
jest.mock('jwt-decode');

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Navbar Logout Functionality', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    nik: '1234567890123456',
    phoneNumber: '081234567890',
  };

  const mockToken = 'mocked-jwt-token';

  beforeEach(() => {
    jest.clearAllMocks();
    (jwtDecode as jest.Mock).mockReturnValue(mockUser);
  });

  const renderNavbarWithAuth = (initialToken = '') => {
    return render(
      <MemoryRouter>
        <AuthContextProvider initialToken={initialToken}>
          <Navbar />
        </AuthContextProvider>
      </MemoryRouter>
    );
  };

  test('renders desktop logout button when authenticated', () => {
    // Mock cookie implementation
    (Cookies.get as jest.Mock).mockImplementation((key) => {
      if (key === 'token') return mockToken;
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });

    renderNavbarWithAuth(mockToken);

    expect(screen.getByTestId('desktop-logout-button')).toBeInTheDocument();
    // Looking for JohnDoe in the h6 element within the items-center div
    expect(screen.getAllByText('JohnDoe').length).toBeGreaterThan(0);
  });

  test('does not render desktop logout button when not authenticated', () => {
    (Cookies.get as jest.Mock).mockReturnValue(null);
    renderNavbarWithAuth();

    expect(screen.queryByTestId('desktop-logout-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('desktop-user-name')).not.toBeInTheDocument();
  });

  test('handles successful desktop logout', async () => {
    // Mock cookie implementation
    (Cookies.get as jest.Mock).mockImplementation((key) => {
      if (key === 'token') return mockToken;
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });

    renderNavbarWithAuth(mockToken);

    const logoutButton = screen.getByTestId('desktop-logout-button');
    fireEvent.click(logoutButton);

    // Wait for the asynchronous action to complete
    await waitFor(() => {
      expect(Cookies.remove).toHaveBeenCalledWith('token');
      expect(Cookies.remove).toHaveBeenCalledWith('user');
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('renders mobile logout button when authenticated and menu is open', async () => {
    // Mock cookie implementation
    (Cookies.get as jest.Mock).mockImplementation((key) => {
      if (key === 'token') return mockToken;
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });

    renderNavbarWithAuth(mockToken);

    // Get the first button in the mobile menu container (the hamburger menu)
    const buttons = screen.getAllByRole('button');
    // Find the hamburger menu button - it should be the one without a data-testid
    const menuButton = buttons.find(button => !button.hasAttribute('data-testid')) || buttons[0];
    
    fireEvent.click(menuButton);

    // Check if mobile logout button appears
    await waitFor(() => {
      expect(screen.getByTestId('mobile-logout-button')).toBeInTheDocument();
    });
  });

  test('handles successful mobile logout', async () => {
    // Mock cookie implementation
    (Cookies.get as jest.Mock).mockImplementation((key) => {
      if (key === 'token') return mockToken;
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });

    renderNavbarWithAuth(mockToken);

    // Get the first button in the mobile menu container (the hamburger menu)
    const buttons = screen.getAllByRole('button');
    // Find the hamburger menu button - it should be the one without a data-testid
    const menuButton = buttons.find(button => !button.hasAttribute('data-testid')) || buttons[0];
    
    fireEvent.click(menuButton);

    // Find and click mobile logout button
    await waitFor(() => {
      const mobileLogoutButton = screen.getByTestId('mobile-logout-button');
      fireEvent.click(mobileLogoutButton);
    });

    // Wait for logout actions to complete
    await waitFor(() => {
      expect(Cookies.remove).toHaveBeenCalledWith('token');
      expect(Cookies.remove).toHaveBeenCalledWith('user');
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  });
});