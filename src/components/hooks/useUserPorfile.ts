import { useEffect, useState } from 'react';
import { useAuth } from '@/components/context/authContext';
import { UserProfile } from '../ui/profile';

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const VITE_BE_URL = import.meta.env.VITE_BE_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${VITE_BE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setUserProfile(await res.json());
        } else {
          console.error(`Unexpected response status: ${res.status}`);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchUserProfile();
  }, [token]);

  return { userProfile, isLoading };
}
