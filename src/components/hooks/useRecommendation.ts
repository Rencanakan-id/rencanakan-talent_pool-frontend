import { useState, useEffect } from "react";
import { useAuth } from "@/components/context/authContext";
import { RecommendationResponseDTO, StatusType } from '../ui/recommendation';
import { RecommendationService } from "@/services/RecommendationService";

export function useRecommendation(userId?: string) {
  const [recommendations, setRecommendations] = useState<RecommendationResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useAuth();
  
  const effectiveUserId = userId ?? user?.id;
  
  const loremIpsum = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
  in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
  sunt in culpa qui officia deserunt mollit anim id est laborum.
  `;
  
  const dummyRecommendations: RecommendationResponseDTO[] = [
    {
      id: '1',
      talentId: user?.id || userId || '',
      contractorId: 202,
      contractorName: 'John Doe',
      message: loremIpsum,
      status: StatusType.PENDING,
    },
    {
      id: '2',
      talentId: user?.id || userId || '',
      contractorId: 203,
      contractorName: 'Jane Smith',
      message: 'Pekerjaan luar biasa, sangat detail dan komunikatif.',
      status: StatusType.PENDING,
    },
  ];

  useEffect(() => {
    const fetchRecommendations = async () => {
      console.log(token, effectiveUserId);
      if (!token || !effectiveUserId) {
        setRecommendations(dummyRecommendations);
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await RecommendationService.getRecommendationsByTalentId(effectiveUserId, token);
        setRecommendations([...data, ...dummyRecommendations]);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setRecommendations(dummyRecommendations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [token, effectiveUserId]);

  const handleAcceptRecommendation = async (recommendationId: string) => {
    if (!token) return;
    
    try {
      await RecommendationService.updateRecommendationStatus(
        recommendationId,
        StatusType.APPROVED,
        token
      );
      
      // Update the local state
      setRecommendations(prevRecommendations => 
        prevRecommendations.map(rec => 
          rec.id === recommendationId
            ? { ...rec, status: StatusType.APPROVED }
            : rec
        )
      );
    } catch (error) {
      console.error('Error accepting recommendation:', error);
      setRecommendations(prevRecommendations => 
        prevRecommendations.map(rec => 
          rec.id === recommendationId
            ? { ...rec, status: StatusType.APPROVED }
            : rec
        )
      );
    }
  };

  const handleRejectRecommendation = async (recommendationId: string) => {
    if (!token) return;
    
    try {
      await RecommendationService.updateRecommendationStatus(
        recommendationId, 
        StatusType.DECLINED,
        token
      );
      
      // Update the local state
      setRecommendations(prevRecommendations => 
        prevRecommendations.map(rec => 
          rec.id === recommendationId
            ? { ...rec, status: StatusType.DECLINED }
            : rec
        )
      );
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
      setRecommendations(prevRecommendations => 
        prevRecommendations.filter(rec => rec.id !== recommendationId)
      );
    }
  };

  return { 
    recommendations, 
    isLoading,
    handleAcceptRecommendation,
    handleRejectRecommendation
  };
}
