export interface ExperienceDetail {
    id: number;
    title: string;
    company: string;
    employmentType: EmploymentType;
    startDate: string;
    endDate: string | null;
    location: string;
    locationType: LocationType;
    talentId: number;
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
    private static readonly BASE_URL = "http://88.222.245.148:8080/api";
  
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
  
    static async addExperience(token: string, experienceData: Omit<ExperienceDetail, 'id'>) {
      try {

        console.log("Adding experience with data:", experienceData);
        const requestData = {
          title: experienceData.title,
          company: experienceData.company,
          companyImage: "", // Add this field even if empty
          employmentType: experienceData.employmentType,
          startDate: experienceData.startDate, // Make sure this is in format YYYY-MM-DD
          endDate: experienceData.endDate, // Make sure this is in format YYYY-MM-DD or null
          location: experienceData.location,
          locationType: experienceData.locationType,
          userId: String(experienceData.talentId) // Convert talentId to userId as string
        };
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
        
        return res.json();
      } catch (error) {
        console.error("Error adding experience:", error);
        throw error;
      }
    }
  
    static async editExperience(token: string, experienceId: number, experienceData: Partial<ExperienceDetail>) {
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
  
    // Keep the certificate methods for backwards compatibility
    static async addCertificate(token: string, certificateData: any) {
      try {
        const formData = new FormData();
        formData.append('title', certificateData.title);
        formData.append('file', certificateData.file);
  
        const res = await fetch(`${this.BASE_URL}/experiences`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
  
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.message || `Failed to add certificate: ${res.status}`);
        }
        
        return res.json();
      } catch (error) {
        console.error("Error adding certificate:", error);
        throw error;
      }
    }
  
    static async editCertificate(token: string, certificateId: number, certificateData: any) {
      try {
        const formData = new FormData();
        formData.append('title', certificateData.title);      
        formData.append('file', certificateData.file);
  
        const res = await fetch(`${this.BASE_URL}/experiences/${certificateId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
  
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.message || `Failed to update certificate: ${res.status}`);
        }
        
        return res.json();
      } catch (error) {
        console.error("Error updating certificate:", error);
        throw error;
      }
    }
  
    static async deleteCertificate(token: string, certificateId: number) {
      try {
        const res = await fetch(`${this.BASE_URL}/experiences/${certificateId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.message || `Failed to delete certificate: ${res.status}`);
        }
        
        return true;
      } catch (error) {
        console.error("Error deleting certificate:", error);
        throw error;
      }
    }
  }