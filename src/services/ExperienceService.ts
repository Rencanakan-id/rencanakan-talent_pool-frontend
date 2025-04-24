import { EmploymentType, LocationType } from "@/components/ui/experience";

export interface ExperienceRequestDTO {
  title: string;
  company: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string | null;
  location: string;
  locationType: LocationType;
}

export class ExperienceService {
  private static readonly BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

  static async getExperiences(userId: string, token: string) {
    try {
      const res = await fetch(`${this.BASE_URL}/experiences/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to fetch experiences: ${res.status}`);
      }
      
      console.log("Experiences fetched successfully:", res);
      return res.json();
    } catch (error) {
      console.error("Error fetching experiences:", error);
      throw error;
    }
  }

  static async addExperience(token: string, experienceData: ExperienceRequestDTO) {
    try {
      const res = await fetch(`${this.BASE_URL}/experiences`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(experienceData)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to add experience: ${res.status}`);
      }
      
      return res.json();
    } catch (error) {
      console.error("Error adding experience:", error);
      throw error;
    }
  }

  static async updateExperience(token: string, experienceId: number, experienceData: ExperienceRequestDTO) {
    try {
      const res = await fetch(`${this.BASE_URL}/experiences/${experienceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(experienceData)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update experience: ${res.status}`);
      }
      
      return res.json();
    } catch (error) {
      console.error("Error updating experience:", error);
      throw error;
    }
  }
}