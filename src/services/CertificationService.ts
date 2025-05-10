import { CertificationRequestDTO, CertificationResponseDTO } from "@/lib/certificate";
import { env } from "@/config/env";

export class CertificationService {
  // private static readonly BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:8080/api";

  static async getCertifications(userId: string, token: string) {
    try {
      const res = await fetch(`${env.API_BASE_URL}/certificates/user/${userId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to fetch certificates: ${res.status}`);
      }

      const json = await res.json()
      console.log("Certifications fetched successfully:", res);
      return json.data as CertificationResponseDTO[];
    } catch (error) {
      console.error("Error fetching certificates:", error);
      throw error;
    }
  }

  static async addCertification(userId: string, token: string, certificateData: Omit<CertificationRequestDTO, 'id'>) {
    try {

      const requestData = {
        title: certificateData.title,
        file: certificateData.file,
        userId: userId
      };
      console.log("Adding certificate with data:", requestData);

      const res = await fetch(`${env.API_BASE_URL}/certificates`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to add certificate: ${res.status}`);
      }

      const json = await res.json()
      
      console.log("Certification added successfully:", res);
      return json.data as CertificationResponseDTO;
    } catch (error) {
      console.error("Error adding certificate:", error);
      throw error;
    }
  }

  static async editCertification(token: string, certificateId: number, certificateData: Partial<CertificationRequestDTO>) {
    try {
      const res = await fetch(`${env.API_BASE_URL}/certificates/${certificateId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(certificateData)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update certificate: ${res.status}`);
      }

      const json = await res.json()
      
      return json.data as CertificationResponseDTO;
    } catch (error) {
      console.error("Error updating certificate:", error);
      throw error;
    }
  }

  static async deleteCertification(token: string, certificateId: number) {
    try {
      const res = await fetch(`${env.API_BASE_URL}/certificates/${certificateId}`, {
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