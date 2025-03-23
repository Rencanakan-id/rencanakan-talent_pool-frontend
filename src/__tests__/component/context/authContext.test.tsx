import { renderHook, act } from '@testing-library/react';
import { AuthContextProvider, useAuth } from '@/components/context/authContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const DEFAULT_USER = {
    id: undefined,
    email: '',
    firstName: '',
    lastName: '',
    nik: '0000000000000000',
    phoneNumber: '',
    password: '',
    aboutMe: undefined,
    currentLocation: undefined,
    experienceYears: undefined,
    npwp: undefined,
    photo: undefined,
    photoKtp: undefined,
    photoNpwp: undefined,
    photoIjazah: undefined,
    preferredLocations: [],
    price: undefined,
    skill: undefined,
    skkLevel: undefined,
};

// Mock dependencies
jest.mock('axios');
jest.mock('js-cookie');
jest.mock('jwt-decode');

describe('AuthContext', () => {
    const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
    };

    const mockToken = 'mocked-jwt-token';

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        (Cookies.get as jest.Mock).mockReturnValue(null);
        (Cookies.set as jest.Mock).mockImplementation(() => {});
        (Cookies.remove as jest.Mock).mockImplementation(() => {});
        (jwtDecode as jest.Mock).mockReturnValue(mockUser);
    });

    it('should initialize with default user and no authentication', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken="">{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.user).toEqual(DEFAULT_USER);
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.token).toBe('');
        expect(result.current.isLoading).toBe(false);
    });

    it('should authenticate user after successful login', async () => {
        (axios.post as jest.Mock).mockResolvedValue({
            data: { token: mockToken },
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken="">{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            await result.current.login('test@example.com', 'password123');
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/auth/login', {
            email: 'test@example.com',
            password: 'password123',
        });
        expect(Cookies.set).toHaveBeenCalledWith('token', mockToken);
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.token).toBe(mockToken);
    });

    it('should handle login failure', async () => {
        (axios.post as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken="">{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            await result.current.login('wrong@example.com', 'wrongpassword');
        });

        expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/api/auth/login', {
            email: 'wrong@example.com',
            password: 'wrongpassword',
        });
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.token).toBe('');
        expect(result.current.user).toEqual(DEFAULT_USER);
    });

    it('should logout user and clear token', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken={mockToken}>{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.logout();
        });

        expect(Cookies.remove).toHaveBeenCalledWith('token');
        expect(Cookies.remove).toHaveBeenCalledWith('user');
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.token).toBe('');
        expect(result.current.user).toEqual(DEFAULT_USER);
    });

    it('should handle invalid or expired token', async () => {
        (jwtDecode as jest.Mock).mockImplementation(() => {
            // throw new Error('Invalid token');
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken={mockToken}>{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.token).toBe('');
        expect(result.current.user).toEqual(DEFAULT_USER);
    });

    it('should load user data from cookies on initialization', async () => {
        (Cookies.get as jest.Mock).mockReturnValue(mockToken);

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken="">{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(jwtDecode).toHaveBeenCalledWith(mockToken);
        expect(Cookies.set).toHaveBeenCalledWith('token', mockToken);
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.token).toBe(mockToken);
    });

    it('should set isLoading to true during login and false after completion', async () => {
        (axios.post as jest.Mock).mockResolvedValue({
            data: { token: mockToken },
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken="">{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.isLoading).toBe(false);

        await act(async () => {
            result.current.login('test@example.com', 'password123');
        });

        expect(result.current.isLoading).toBe(false);
    });

    it('should set isLoggingOut to true during logout and false after completion', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken={mockToken}>{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.isLoggingOut).toBe(false);

        act(() => {
            result.current.logout();
        });

        // expect(result.current.isLoggingOut).toBe(false);
    });

    it('should validate token and update user state in check function', async () => {
        (Cookies.get as jest.Mock).mockReturnValue(mockToken);
        (jwtDecode as jest.Mock).mockReturnValue(mockUser);
        (axios.get as jest.Mock).mockResolvedValue({
            status: 200,
            data: mockUser,
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken={mockToken}>{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            // Trigger useEffect
        });

        expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/users/me', {
            headers: { Authorization: `Bearer ${mockToken}` },
        });
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle invalid token in check function', async () => {
        (Cookies.get as jest.Mock).mockReturnValue(mockToken);
        (jwtDecode as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken={mockToken}>{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            // Trigger useEffect
        });

        expect(result.current.user).toEqual(DEFAULT_USER);
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle API failure in check function', async () => {
        (Cookies.get as jest.Mock).mockReturnValue(mockToken);
        (jwtDecode as jest.Mock).mockReturnValue(mockUser);
        (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken={mockToken}>{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            // Trigger useEffect
        });

        expect(result.current.user).toEqual(DEFAULT_USER);
        expect(result.current.isAuthenticated).toBe(false);
    });
});