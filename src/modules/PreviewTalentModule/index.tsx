import { useEffect, useState } from 'react';
import { Button } from '@/components';
import Experience, { ExperienceDetail } from '@/components/ui/experience';
import UserProfileCard, { UserProfile } from '@/components/ui/profile';
import { ArrowLeft, BookmarkIcon } from 'lucide-react';
import Location from '@/components/ui/location';
import { useAuth } from '@/components/context/authContext';

export const PreviewTalentModule: React.FC = () => {
  console.log('PreviewTalentModule rendered');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [experience, setExperience] = useState<ExperienceDetail[] | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const VITE_BE_URL = 'http://localhost:8080';

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${VITE_BE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserProfile(data);
        } else {
          console.error(`Unexpected response status: ${res.status}`);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setUserProfile(null);
      }
    };

    const fetchExperience = async () => {
      try {
        const res = await fetch(`${VITE_BE_URL}/api/experiences/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const resData = await res.json();
          setExperience(resData.data || null);
        } else {
          console.error(`Unexpected response status: ${res.status}`);
          setExperience(null);
        }
      } catch (err) {
        console.error('Error fetching experience:', err);
        setExperience(null);
      }
    };

    fetchUserProfile();
    fetchExperience();
  }, [token]);

  return !userProfile || !experience ? (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center">
      <div
        data-testid="loading-spinner"
        className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
      ></div>
    </div>
  ) : (
    <div className="flex w-full justify-center">
      <div className="m-6 w-full max-w-6xl justify-center bg-white">
        <div className="flex w-full justify-between p-4">
          <Button variant="primary-outline" className="flex py-2">
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </Button>
        </div>

        <div className="flex w-full flex-col items-center space-y-2 p-4 md:flex-row md:items-start md:space-y-0 md:space-x-6">
          <img src="profile.svg" alt="Logo" className="h-[330px] w-[298px]" />
          <div className="w-full flex-col items-center space-y-4">
            <UserProfileCard user={userProfile} />
            <Experience experiences={experience} />
            <Location data={userProfile.preferredLocations} />
          </div>
        </div>
      </div>
    </div>
  );
};
