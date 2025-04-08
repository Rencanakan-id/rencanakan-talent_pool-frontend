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
    firstName: 'JohnDoe',
  };

  const mockToken = 'mocked-jwt-token';

  beforeEach(() => {
    jest.clearAllMocks();
    (jwtDecode as jest.Mock).mockReturnValue(mockUser);
  });

  // Helper functions to reduce duplication
  const setupAuthenticatedEnvironment = () => {
    (Cookies.get as jest.Mock).mockImplementation((key) => {
      if (key === 'token') return mockToken;
      if (key === 'user') return JSON.stringify(mockUser);
      return null;
    });
  };

  const renderNavbarWithAuth = (initialToken = '') => {
    return render(
      <MemoryRouter>
        <AuthContextProvider initialToken={initialToken}>
          <Navbar />
        </AuthContextProvider>
      </MemoryRouter>
    );
  };

  const getHamburgerMenuButton = () => {
    const buttons = screen.getAllByRole('button');
    return buttons.find(button => !button.hasAttribute('data-testid')) || buttons[0];
  };

  const verifyLogoutActions = async () => {
    await waitFor(() => {
      expect(Cookies.remove).toHaveBeenCalledWith('token');
      expect(Cookies.remove).toHaveBeenCalledWith('user');
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  };

  test('renders desktop logout button when authenticated', () => {
    setupAuthenticatedEnvironment();
    renderNavbarWithAuth(mockToken);

    expect(screen.getByTestId('desktop-logout-button')).toBeInTheDocument();
    expect(screen.getAllByText('JohnDoe').length).toBeGreaterThan(0);
  });

  test('does not render desktop logout button when not authenticated', () => {
    (Cookies.get as jest.Mock).mockReturnValue(null);
    renderNavbarWithAuth();

    expect(screen.queryByTestId('desktop-logout-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('desktop-user-name')).not.toBeInTheDocument();
  });

  test('handles successful desktop logout', async () => {
    setupAuthenticatedEnvironment();
    renderNavbarWithAuth(mockToken);

    const logoutButton = screen.getByTestId('desktop-logout-button');
    fireEvent.click(logoutButton);

    await verifyLogoutActions();
  });

  test('renders mobile logout button when authenticated and menu is open', async () => {
    setupAuthenticatedEnvironment();
    renderNavbarWithAuth(mockToken);

    const menuButton = getHamburgerMenuButton();
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByTestId('mobile-logout-button')).toBeInTheDocument();
    });
  });

  test('handles successful mobile logout', async () => {
    setupAuthenticatedEnvironment();
    renderNavbarWithAuth(mockToken);

    const menuButton = getHamburgerMenuButton();
    fireEvent.click(menuButton);

    await waitFor(() => {
      const mobileLogoutButton = screen.getByTestId('mobile-logout-button');
      fireEvent.click(mobileLogoutButton);
    });

    await verifyLogoutActions();
  });
});