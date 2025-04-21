import { CertificateDetail } from "@/components/ui/certificate";

const BASE_URL = "http://88.222.245.148:8080/api";

export const getCertificates = async (userId: string, token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/certificates/user/${userId}`, {
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

  export const addCertificate = async (certificateData: CertificateDetail, token: string) => {
    try {
      // The backend expects JSON with a title and file URL, not FormData
      const requestData = {
        title: certificateData.title,
        file: certificateData.file.name // Or the complete file URL path if that's what the backend needs
      };
  
      const res = await fetch(`${BASE_URL}/certificates`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData),
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
  };
  
  export const editCertificate = async (
    certificateId: number,
    certificateData: CertificateDetail,
    token: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", certificateData.title);
      formData.append("file", certificateData.file);
  
      const res = await fetch(`${BASE_URL}/certificates/${certificateId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
  };
  
  export const deleteCertificate = async (certificateId: number, token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/certificates/${certificateId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  };