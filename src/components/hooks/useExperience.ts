import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/authContext";
import { ExperienceDetail } from "../ui/experience";

export function useExperience(userId?: string) {
  const [experience, setExperience] = useState<ExperienceDetail[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const VITE_BE_URL = import.meta.env.VITE_BE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchExperience = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`${VITE_BE_URL}/api/experiences/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const resData = await res.json();
          setExperience(resData.data || null);
        } else {
          console.error(`Unexpected response status: ${res.status}`);
          setExperience(null);
        }
      } catch (err) {
        console.error("Error fetching experience:", err);
        setExperience(null);
      }finally {
        setIsLoading(false);
      }
    };

    if (token && userId) fetchExperience();
  }, [token, userId]);

  return {experience, isLoading};

}
