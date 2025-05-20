import { StatusType, RecommendationResponseDTO } from '@/components/ui/recommendation';

interface WebResponse<T> {
  data: T;
  errors: string;
  message?: string;
}

export class RecommendationService {
  private static readonly BASE_URL = 'http://localhost:8081/api';

  static async getRecommendationsByTalentId(userId: string, token: string): Promise<RecommendationResponseDTO[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/recommendations/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
  }

  static async updateRecommendationStatus(
    recommendationId: string, 
    newStatus: StatusType,
    token: string
  ): Promise<RecommendationResponseDTO | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/recommendations/${recommendationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
  }

  static async getRecommendationsByTalentIdGroupedByStatus(
    userId: string,
    token: string
  ): Promise<Record<StatusType, RecommendationResponseDTO[]>> {
    try {
      const response = await fetch(`${this.BASE_URL}/recommendations/user/${userId}/grouped-by-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
  }
}
