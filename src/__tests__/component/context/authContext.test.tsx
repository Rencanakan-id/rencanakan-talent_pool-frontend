import { renderHook, act } from '@testing-library/react';
import { AuthContextProvider, useAuth } from '@/components/context/authContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { DEFAULT_USER } from "@/types/const";

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

    // it('should authenticate user after successful login', async () => {
    //     (axios.post as jest.Mock).mockResolvedValue({
    //         data: { data: { token: mockToken } },
    //     });

    //     const wrapper = ({ children }: { children: React.ReactNode }) => (
    //         <AuthContextProvider initialToken="">{children}</AuthContextProvider>
    //     );

    //     const { result } = renderHook(() => useAuth(), { wrapper });

    //     await act(async () => {
    //         await result.current.login('test@example.com', 'password123');
    //     });

    //     expect(axios.post).toHaveBeenCalledWith('http://88.222.245.148:8080/api/auth/login', {
    //         email: 'test@example.com',
    //         password: 'password123',
    //     });
    //     expect(Cookies.set).toHaveBeenCalledWith('token', mockToken);
    //     expect(result.current.isAuthenticated).toBe(true);
    //     expect(result.current.token).toBe(mockToken);
    // });

    it('should handle login failure', async () => {
        (axios.post as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken="">{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        await expect(async () => {
            await act(async () => {
                await result.current.login('wrong@example.com', 'wrongpassword');
            });
        }).rejects.toThrow('Login Failed');

        expect(axios.post).toHaveBeenCalledWith('http://88.222.245.148:8080/api/auth/login', {
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
        // expect(result.current.isLoggingOut).toBe(false);
    });

    // it('should handle invalid or expired token', async () => {
    //     (jwtDecode as jest.Mock).mockImplementation(() => {
    //         throw new Error('Invalid token');
    //     });

    //     const wrapper = ({ children }: { children: React.ReactNode }) => (
    //         <AuthContextProvider initialToken={mockToken}>{children}</AuthContextProvider>
    //     );

    //     const { result } = renderHook(() => useAuth(), { wrapper });

    //     expect(result.current.isAuthenticated).toBe(false);
    //     expect(result.current.token).toBe('');
    //     expect(result.current.user).toEqual(DEFAULT_USER);
    // });

    it('should load user data from cookies on initialization', async () => {
        (Cookies.get as jest.Mock).mockReturnValue(mockToken);

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken="">{children}</AuthContextProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(jwtDecode).toHaveBeenCalledWith(mockToken);
        expect(Cookies.set).toHaveBeenCalledWith('token', mockToken);
        expect(Cookies.set).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.token).toBe(mockToken);
    });

    // it('should set isLoading to true during login and false after completion', async () => {
    //     (axios.post as jest.Mock).mockResolvedValue({
    //         data: { data: { token: mockToken } },
    //     });

    //     const wrapper = ({ children }: { children: React.ReactNode }) => (
    //         <AuthContextProvider initialToken="">{children}</AuthContextProvider>
    //     );

    //     const { result } = renderHook(() => useAuth(), { wrapper });

    //     expect(result.current.isLoading).toBe(false);

    //     let promiseResolve: () => void;
    //     const loginPromise = new Promise<void>(resolve => {
    //         promiseResolve = resolve;
    //     });

    //     await act(async () => {
    //         const promise = result.current.login('test@example.com', 'password123');
    //         expect(result.current.isLoading).toBe(true);
    //         await promise;
    //     });

    //     expect(result.current.isLoading).toBe(false);
    // });

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

        expect(axios.get).toHaveBeenCalledWith('http://88.222.245.148:8080/api/users/me', {
            headers: { Authorization: `Bearer ${mockToken}` },
        });
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
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

    it('should log an error if token decoding fails during initialization', async () => {
        // Mock jwtDecode to throw an error
        (jwtDecode as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });
    
        // Mock Cookies.get to return a token
        (Cookies.get as jest.Mock).mockReturnValue(mockToken);
    
        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken="">{children}</AuthContextProvider>
        );
    
        renderHook(() => useAuth(), { wrapper });
    
        // Ensure console.error was called with the expected message
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error decoding token:', expect.any(Error));
    
        // Restore console.error
        consoleErrorSpy.mockRestore();
    });

    it('should authenticate user after successful login', async () => {
        // Mock axios.post to return a successful response
        (axios.post as jest.Mock).mockResolvedValue({
            data: { data: { token: mockToken } },
        });
    
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContextProvider initialToken="">{children}</AuthContextProvider>
        );
    
        const { result } = renderHook(() => useAuth(), { wrapper });
    
        await act(async () => {
            await result.current.login('test@example.com', 'password123');
        });
    
        // Verify axios.post was called with the correct arguments
        expect(axios.post).toHaveBeenCalledWith('http://88.222.245.148:8080/api/auth/login', {
            email: 'test@example.com',
            password: 'password123',
        });
    
        // Verify Cookies.set was called with the token
        expect(Cookies.set).toHaveBeenCalledWith('token', mockToken);
    
        // Verify jwtDecode was called with the token
        expect(jwtDecode).toHaveBeenCalledWith(mockToken);
    });
});

it('should handle missing token during initialization', () => {
    // Mock Cookies.get to return an empty string (no token)
    (Cookies.get as jest.Mock).mockReturnValue("");

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthContextProvider initialToken="">{children}</AuthContextProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Verify that user state is reset to DEFAULT_USER
    expect(result.current.user).toEqual(DEFAULT_USER);

    // Verify that token and authentication states are cleared
    expect(result.current.token).toBe("");
    expect(result.current.isAuthenticated).toBe(false);

    // Verify that isLoading is reset to false
    expect(result.current.isLoading).toBe(false);
});