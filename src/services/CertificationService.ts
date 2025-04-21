import { CertificateDetail } from "@/components/ui/certificate";

export class CertificationService {
  private static readonly BASE_URL = "http://localhost:8080/api";

  static async getCertificates(userId: string, token: string) {
    try {
      const res = await fetch(`${this.BASE_URL}/certificates/user/${userId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to fetch certificates: ${res.status}`);
      }
      console.log("Certificates fetched successfully:", res);
      return res.json();
    } catch (error) {
      console.error("Error fetching certificates:", error);
      throw error;
    }
  }

  static async addCertificate(token: string, certificateData: CertificateDetail) {
    try {
      const res = await fetch(`${this.BASE_URL}/certificates`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({"title": certificateData.title, "file": certificateData.file?.name})
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

  static async updateCertificate(token: string, certificateId: number, certificateData: CertificateDetail) {
    try {
      const payload: { title: string; file?: string } = { 
        "title": certificateData.title
      };
      
      if (certificateData.file) {
        payload.file = certificateData.file.name;
      }
      
      const res = await fetch(`${this.BASE_URL}/certificates/${certificateId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload)
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
      const res = await fetch(`${this.BASE_URL}/certificates/${certificateId}`, {
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