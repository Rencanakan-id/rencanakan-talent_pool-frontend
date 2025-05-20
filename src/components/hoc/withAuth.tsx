/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useCallback, useEffect } from 'react';
import { useAuth } from '../context/authContext';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const Wrapper: React.FC = (props) => {
        const { isAuthenticated, isLoading, token, logout, isLoggingOut } = useAuth();

        const checkAuth = useCallback(() => {
            console.log('haii');
            if (!token) {
                console.log('"gaada token"');
                isAuthenticated && logout();
                return;
            }
        }, [isAuthenticated, logout, token]);

        useEffect(() => {
            if (!isLoading) {
                if (!isAuthenticated) {
                    console.log('isAuthenticated', isAuthenticated);
                    if (isLoggingOut) {
                        window.location.href = '/';
                    } else {
                        window.location.href = `/login`;
                    }
                } else {
                    console.log('isAuthenticated', isAuthenticated);
                }
            } else {
                console.log('isLoading', isLoading);
            }
        }, [isAuthenticated, isLoading, isLoggingOut]);

        useEffect(() => {
            checkAuth();
        }, [checkAuth]);

        return isAuthenticated ? <WrappedComponent {...props} /> : null;
    };

    return Wrapper;
};

export default withAuth;