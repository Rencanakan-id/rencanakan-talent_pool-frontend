import { useState, useEffect } from "react";
import { useAuth } from "@/components/context/authContext";
import { RecommendationResponseDTO, StatusType } from '../ui/recommendation';
import { RecommendationService } from "@/services/recommendationService";

export function useRecommendation(userId?: string) {
  const [recommendations, setRecommendations] = useState<RecommendationResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const { token, user } = useAuth();
  
  const effectiveUserId = userId ?? user?.id;
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!token || !effectiveUserId) {
        setRecommendations([]);
        setIsEmpty(true);
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await RecommendationService.getRecommendationsByTalentId(effectiveUserId, token);
        const filteredData = data.filter(
          (recommendation) => recommendation.status !== StatusType.DECLINED
        );
        setRecommendations(filteredData);
        setIsEmpty(data.length === 0);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setRecommendations([]);
        setIsEmpty(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [token, effectiveUserId]);

  const handleAcceptRecommendation = async (recommendationId: string) => {
    if (!token) return;
    
    try {
      await RecommendationService.acceptRecommendation(
        recommendationId,
        token
      );
      
      // Update the local state
      setRecommendations((prevRecommendations: RecommendationResponseDTO[]) => 
        prevRecommendations.map(rec => 
          rec.id === recommendationId
            ? { ...rec, status: StatusType.APPROVED }
            : rec
        )
      );
    } catch (error) {
      console.error('Error accepting recommendation:', error);
    }
  };

  const handleRejectRecommendation = async (recommendationId: string) => {
    if (!token) return;
    
    try {
      await RecommendationService.rejectRecommendation(
        recommendationId, 
        token
      );
      
      // Update the local state
      setRecommendations((prevRecommendations: RecommendationResponseDTO[]) => {
        const updatedRecommendations = prevRecommendations.filter(rec => 
          rec.id !== recommendationId
        );
        
        setIsEmpty(updatedRecommendations.length === 0);
        return updatedRecommendations;
      });
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
    }
  };

  return { 
    recommendations, 
    isLoading,
    isEmpty,
    handleAcceptRecommendation,
    handleRejectRecommendation
  };
}