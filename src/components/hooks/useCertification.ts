import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { CertificationService } from '@/services/CertificationService';
import { CertificateDetail } from '../ui/certificate';

export const useCertification = (userId?: string) => {
  const [certification, setCertification] = useState<CertificateDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchCertificates = async () => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await CertificationService.getCertificates(userId, token);
      setCertification(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch certificates');
      setCertification([]);
      console.error('Error fetching certificates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [userId, token]);

  const handleAddCertificate = async (certificateData: CertificateDetail) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      await CertificationService.addCertificate(token, certificateData);
      await fetchCertificates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add certificate');
      console.error('Error adding certificate:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCertificate = async (certificateId: number, certificateData: CertificateDetail) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      await CertificationService.updateCertificate(token, certificateId, certificateData);
      await fetchCertificates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update certificate');
      console.error('Error updating certificate:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCertificate = async (certificateId: number) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      await CertificationService.deleteCertificate(token, certificateId);
      await fetchCertificates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete certificate');
      console.error('Error deleting certificate:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    certification,
    isLoading,
    error,
    handleAddCertificate,
    handleEditCertificate,
    handleDeleteCertificate,
    refreshCertificates: fetchCertificates
  };
};
