import { Button } from '@/components';
import Experience from '@/components/ui/experience';
import UserProfileCard from '@/components/ui/profile';
import { ArrowLeft } from 'lucide-react';
import Location from '@/components/ui/location';
import { useAuth } from '@/components/context/authContext';
import { useUserProfile } from '@/components/hooks/useUserProfile';
import { useExperience } from '@/components/hooks/useExperience';
import { useRecommendation } from '@/components/hooks/useRecommendation';
import RecommendationCard from '@/components/ui/recommendation';
import { useNavigate } from 'react-router-dom';
import { useCertification } from '@/components/hooks/useCertification';
import Certificate from '@/components/ui/certificate';

export const PreviewTalentModule: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userProfile, isLoading: isUserLoading } = useUserProfile();
  const { experience, isLoading: isExperienceLoading } = useExperience(
    user?.id
  );
  const { 
    certification, 
    isLoading: isCertificationLoading,
    handleEditCertificate,
    handleDeleteCertificate 
  } = useCertification(user?.id);
  
  const { 
    recommendations, 
    isLoading: isRecommendationLoading,
    handleAcceptRecommendation,
    handleRejectRecommendation 
  } = useRecommendation(user?.id);

  if (isUserLoading || isExperienceLoading || isRecommendationLoading || isCertificationLoading) {
    return (
      <div className="absolute inset-0 flex h-full w-full items-center justify-center">
        <div
          data-testid="loading-spinner"
          className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
        ></div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate('/edit');
  };

  return (
    <div className={`flex items-center w-full justify-center`}>
      <div className="m-6 h-auto w-full max-w-6xl bg-white p-4">
        <div className="flex w-full justify-between p-4">
          <Button variant="primary-outline" className="flex py-2">
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </Button>

          <Button variant="primary-outline" className="flex py-2" onClick={handleEdit}>
            <span>Edit Profil</span>
          </Button>
        </div>

        <div className="flex w-full flex-col items-center space-y-2 p-4 md:flex-row md:items-start md:space-y-0 md:space-x-6">
          <img src="./dummy/profile.svg" alt="Logo" className="h-[250px] w-[250px]" />
          <div className="w-full flex-col items-center space-y-4 p-4">
            {userProfile && <UserProfileCard user={userProfile} />}
            {userProfile?.preferredLocations && <Location data={userProfile.preferredLocations} />}
            {experience && <Experience experiences={experience} />}
            {certification && (
              <Certificate 
                certificates={certification}
                onEdit={handleEditCertificate}
                onDelete={handleDeleteCertificate}
              />
            )}
            {recommendations && (
              <RecommendationCard 
                recommendations={recommendations} 
                onAccept={handleAcceptRecommendation}
                onDecline={handleRejectRecommendation}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};