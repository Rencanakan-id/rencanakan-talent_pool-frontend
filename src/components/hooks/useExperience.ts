import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/authContext";
import { UserService } from "@/services/UserService";
import { ExperienceResponseDTO } from "@/services/ExperienceService"

export function useExperience(userId?: string) {
  const [experience, setExperience] = useState<ExperienceResponseDTO[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchExperience = async () => {
      if (!token || !userId) return;
      try {

        const experienceData = await UserService.getUserExperience(userId, token);
        setExperience(experienceData.data?? null);
      } catch (err) {
        console.error(err);
        setExperience(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperience();
  }, [token, userId]);

  return { experience, isLoading };
}
