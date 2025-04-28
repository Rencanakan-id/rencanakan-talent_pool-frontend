import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/context/authContext';
import { ExperienceService } from '@/services/ExperienceService';
import { ExperienceDetail } from '@/components/ui/experience';

export const useExperience = (userId?: string) => {
  const [experience, setExperience] = useState<ExperienceDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchExperiences = useCallback(async () => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await ExperienceService.getExperiences(userId, token);
      console.log('lihat syaa, ini data', data);
      setExperience(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
      setExperience([]);
      console.error('Error fetching experiences:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchExperiences();
  }, [userId, token, fetchExperiences]);

  const handleAddExperience = async (experienceData: ExperienceDetail) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      await ExperienceService.addExperience(token, {
        title: experienceData.title,
        company: experienceData.company,
        employmentType: experienceData.employmentType,
        startDate: experienceData.startDate,
        endDate: experienceData.endDate,
        location: experienceData.location,
        locationType: experienceData.locationType
      });
      await fetchExperiences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add experience');
      console.error('Error adding experience:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditExperience = async (experienceId: number, experienceData: ExperienceDetail) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      await ExperienceService.updateExperience(token, experienceId, {
        title: experienceData.title,
        company: experienceData.company,
        employmentType: experienceData.employmentType,
        startDate: experienceData.startDate,
        endDate: experienceData.endDate,
        location: experienceData.location,
        locationType: experienceData.locationType
      });
      await fetchExperiences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update experience');
      console.error('Error updating experience:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExperience = async (experienceId: number) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      await ExperienceService.deleteExperience(token, experienceId);
      await fetchExperiences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete experience');
      console.error('Error deleting experience:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    experience,
    isLoading,
    error,
    handleAddExperience,
    handleEditExperience,
    handleDeleteExperience,
    refreshExperiences: fetchExperiences
  };
};