export interface ExperienceRequestDTO {
    title: string;
    company: string;
    companyImage: string;
    employmentType: EmploymentType;
    startDate: string;
    endDate: string | null;
    location: string;
    locationType: LocationType;
  }

export interface ExperienceResponseDTO {
    id: number;
    title: string;
    company: string;
    companyImage: string;
    employmentType: EmploymentType;
    startDate: string;
    endDate: string | null;
    location: string;
    locationType: LocationType;
  }

export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'SELF_EMPLOYED'
  | 'FREELANCE'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'APPRENTICESHIP'
  | 'SEASONAL'
  | '';

export type LocationType = 'ON_SITE' | 'HYBRID' | 'REMOTE' | '';

export class ExperienceService {
  private static readonly BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:8080/api";

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

      const json = await res.json()
      console.log("Experiences fetched successfully:", res);
      return json.data as ExperienceResponseDTO[];
    } catch (error) {
      console.error("Error fetching experiences:", error);
      throw error;
    }
  }

  static async addExperience(userId: string, token: string, experienceData: Omit<ExperienceRequestDTO, 'id'>) {
    try {

      const requestData = {
        title: experienceData.title,
        company: experienceData.company,
        companyImage: "", // Add this field even if empty
        employmentType: experienceData.employmentType,
        startDate: experienceData.startDate, // Make sure this is in format YYYY-MM-DD
        endDate: experienceData.endDate, // Make sure this is in format YYYY-MM-DD or null
        location: experienceData.location,
        locationType: experienceData.locationType,
        userId: userId
      };
      console.log("Adding experience with data:", requestData);

      const res = await fetch(`${this.BASE_URL}/experiences`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to add experience: ${res.status}`);
      }

      const json = await res.json()
      
      console.log("Experience added successfully:", res);
      return json.data as ExperienceResponseDTO;
    } catch (error) {
      console.error("Error adding experience:", error);
      throw error;
    }
  }

  static async editExperience(token: string, experienceId: number, experienceData: Partial<ExperienceRequestDTO>) {
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

      const json = await res.json()
      
      return json.data as ExperienceResponseDTO;
    } catch (error) {
      console.error("Error updating experience:", error);
      throw error;
    }
  }

  static async deleteExperience(token: string, experienceId: number) {
    try {
      const res = await fetch(`${this.BASE_URL}/experiences/${experienceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to delete experience: ${res.status}`);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting experience:", error);
      throw error;
    }
  }

}