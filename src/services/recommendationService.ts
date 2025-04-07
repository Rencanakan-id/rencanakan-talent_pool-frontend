import { StatusType, RecommendationResponseDTO } from '@/components/ui/recommendation';

const API_BASE_URL = 'http://localhost:8080/api';

interface WebResponse<T> {
  data: T;
  errors: string;
  message?: string;
}

export const getRecommendationsByTalentId = async (userId: string): Promise<RecommendationResponseDTO[]> => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/recommendations/user/${userId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const responseData: WebResponse<RecommendationResponseDTO[]> = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const updateRecommendationStatus = async (
  recommendationId: string, 
  newStatus: StatusType
): Promise<RecommendationResponseDTO | null> => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/recommendations/user/${recommendationId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const responseData: WebResponse<RecommendationResponseDTO> = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error updating recommendation status:', error);
    throw error;
  }
};

export const getRecommendationsByTalentIdGroupedByStatus = async (
  userId: string
): Promise<Record<StatusType, RecommendationResponseDTO[]>> => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/recommendations/user/${userId}/grouped-by-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const responseData: WebResponse<Record<StatusType, RecommendationResponseDTO[]>> = await response.json();
    
    const defaultGrouped: Record<StatusType, RecommendationResponseDTO[]> = {
      [StatusType.PENDING]: [],
      [StatusType.APPROVED]: [],
      [StatusType.DECLINED]: []
    };
    
    return { ...defaultGrouped, ...responseData.data };
  } catch (error) {
    console.error('Error fetching grouped recommendations:', error);
    
    return {
      [StatusType.PENDING]: [],
      [StatusType.APPROVED]: [],
      [StatusType.DECLINED]: []
    };
  }
};
