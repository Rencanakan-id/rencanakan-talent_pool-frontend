import Experience from '@/components/ui/experience';
import Certificate from '@/components/ui/certificate';
import UserProfileCard from '@/components/ui/profile';
import Location from '@/components/ui/location';

import { Button } from '@/components';
import { ArrowLeft } from 'lucide-react';

import { useAuth } from '@/components/context/authContext';
import { useUserProfile } from '@/components/hooks/useUserPorfile';
import { useExperience } from '@/components/hooks/useExperience';
import { useCertification } from '@/components/hooks/useCertification';

export const PreviewTalentModule: React.FC = () => {
  const { user } = useAuth();
  const { userProfile, isLoading: isUserLoading } = useUserProfile();
  const { experience, isLoading: isExperienceLoading } = useExperience(user?.id);
  const { certification, isLoading: isCertificationLoading } = useCertification(user?.id);

  if (isUserLoading || isExperienceLoading || isCertificationLoading) {
    return (
      <div className="absolute inset-0 flex h-full w-full items-center justify-center">
        <div
          data-testid="loading-spinner"
          className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
        ></div>
      </div>
    );
  }

  return (
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
            {userProfile && <UserProfileCard user={userProfile} />}
            {experience && <Experience experiences={experience} />}
            {userProfile?.preferredLocations && <Location data={userProfile.preferredLocations} />}
            {certification && <Certificate certificates={certification} />}
          </div>
        </div>
      </div>
    </div>
  );
};
