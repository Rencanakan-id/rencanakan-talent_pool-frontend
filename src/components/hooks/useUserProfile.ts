import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/authContext";
import { UserService } from "@/services/UserService";
import { UserProfile } from "../ui/profile";

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token ) return;
      try {
        const profile = await UserService.getUserProfile(token);
        setUserProfile(profile);
      } catch (err) {
        console.error(err);
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  return { userProfile, isLoading };
}