import { Button } from '@/components';
import Experience from '@/components/ui/experience';
import UserProfileCard from '@/components/ui/profile';
import { ArrowLeft } from 'lucide-react';
import Location from '@/components/ui/location';
// import { useAuth } from '@/components/context/authContext';
import { useUserProfile } from '@/components/hooks/useUserProfile';
import { useExperience } from '@/components/hooks/useExperience';
import { useRecommendation } from '@/components/hooks/useRecommendation';
import RecommendationCard from '@/components/ui/recommendation';

export const PreviewTalentModule: React.FC = () => {
  // const { user } = useAuth();
  const { userProfile, isLoading: isUserLoading } = useUserProfile();
  const { experience, isLoading: isExperienceLoading } = useExperience(
    'e982b772-1610-4a05-8e55-c5da89ce2174'
  );
  const { recommendations, isLoading: isRecommendationLoading } = useRecommendation();

  if (isUserLoading || isExperienceLoading || isRecommendationLoading) {
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
                    <img src="./dummy/profile.svg" alt="Logo" className="h-[330px] w-[298px]" />
                    <div className="w-full flex-col items-center space-y-4">
                        {userProfile && <UserProfileCard user={userProfile} />}
                        {userProfile?.preferredLocations && <Location data={userProfile.preferredLocations} />}
                        {experience && <Experience experiences={experience} />}
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className={`flex items-center w-full justify-center`}>
      <div className="m-6 h-auto w-full max-w-6xl bg-white p-4">
        <div className="flex w-full justify-between p-4">
          <Button variant="primary-outline" className="flex py-2">
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </Button>
        </div>

        <div className="flex w-full flex-col items-center space-y-2 p-4 md:flex-row md:items-start md:space-y-0 md:space-x-6">
          <img src="./dummy/profile.svg" alt="Logo" className="h-[250px] w-[250px]" />
          <div className="w-full flex-col items-center space-y-4 p-4">
            {userProfile && <UserProfileCard user={userProfile} />}
            {userProfile?.preferredLocations && <Location data={userProfile.preferredLocations} />}
            {experience && <Experience experiences={experience} />}
            {recommendations && <RecommendationCard recommendations={recommendations} />}
          </div>
        </div>
      </div>
    </div>
  );
};
