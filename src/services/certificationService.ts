import { CertificateDetail } from '@/components/ui/certificate';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

export const getUserCertificates = async (userId: string): Promise<CertificateDetail[]> => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/certificates/user/${userId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const responseData: ApiResponse<CertificateDetail[]> = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};
