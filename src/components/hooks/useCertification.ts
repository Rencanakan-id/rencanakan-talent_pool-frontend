import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/authContext';
import { CertificationService } from '@/services/CertificationService';
import { CertificationResponseDTO } from '@/lib/certificate';

export const useCertification = (userId?: string) => {
  const [certification, setCertification] = useState<CertificationResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { token } = useAuth();

  const fetchCertifications = useCallback(async () => {
    if (!userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await CertificationService.getCertifications(userId, token);
      setCertification(data);
    } catch (err) {
      setCertification([]);
      console.error('Error fetching certificates:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchCertifications();
  }, [userId, token, fetchCertifications]);

  return {certification, isLoading};
};
