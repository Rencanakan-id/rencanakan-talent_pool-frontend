"use server"

import { DEFAULT_USER } from "@/types/const";
import { UserProps } from "@/types/interface";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Cookies from 'js-cookie';

interface AuthContextProps {
    user: UserProps;
    login: (email: string, password: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    token: string;
    isLoading: boolean;
    isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: DEFAULT_USER,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  token: '',
  isLoading: true,
  isLoggingOut: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
  initialToken,
}: {
  children: React.ReactNode;
  initialToken: string;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialToken !== '');
  const [token, setToken] = useState<string>(initialToken || '');
  const [user, setUser] = useState<UserProps>(
    initialToken ? jwtDecode<UserProps>(initialToken) : DEFAULT_USER
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

    const check = async () => {
        if (token) {
            try {
                const decodedUser = jwtDecode<UserProps>(token);
                setUser(decodedUser);
                setIsAuthenticated(true);
                const res = await axios.get(`http://localhost:8080/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

        if (res.status === 200) {
          const jwt = Cookies.get('token')?? '';
          const decodedUser = jwtDecode<UserProps>(jwt);
          setUser(decodedUser);
          setToken(jwt);
          setIsAuthenticated(true);
        } else {
          throw new Error('Token not authorized');
        }
      } catch (error) {
        console.error('Error decoding token or token not authorized:', error);
        setIsAuthenticated(false);
        setUser(DEFAULT_USER);
        Cookies.remove('token');
        setToken('');
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    check();
  }, [token]);

    useEffect(() => {
        const jwt = Cookies.get('token');
        if (jwt) {
            Cookies.set('token', jwt);
            try {
                const decodedUser = jwtDecode<UserProps>(jwt);
                setUser(decodedUser);
                Cookies.set('user', JSON.stringify(decodedUser));
                setToken(jwt);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await axios.post(`http://localhost:8080/api/auth/login`, {
                email,
                password,
            });
            const data = res.data.token;
            Cookies.set('token', data);
            const decodedUser = jwtDecode<UserProps>(data);
            setUser(decodedUser);
            setToken(data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login Failed: ', error);
        }
    };

  const logout = () => {
    setIsLoggingOut(true);
    Cookies.remove('token');
    Cookies.remove('user');
    setToken('');
    setIsAuthenticated(false);
    setUser(DEFAULT_USER);
  };

  const contextValue: AuthContextProps = {
    user,
    login,
    logout,
    isAuthenticated,
    token,
    isLoading,
    isLoggingOut,
  };

    return (
        <AuthContext.Provider value={contextValue}>
            {!isLoading ? children : <div className="min-h-screen">loading...</div>}
        </AuthContext.Provider>
    );
};
