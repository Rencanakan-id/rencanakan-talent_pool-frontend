import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/authContext";
import { CertificationService } from "@/services/CertificationService";
import { CertificateDetail } from "../ui/certificate";

export function useCertification(userId?: string) {
  const [certification, setCertification] = useState<CertificateDetail[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useAuth();
  
  const effectiveUserId = userId ?? user?.id;

  useEffect(() => {
    const fetchCertification = async () => {
      if (!token || !effectiveUserId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const certificationData = await CertificationService.getCertificates(effectiveUserId, token);
        setCertification(certificationData.data ?? null);
      } catch (err) {
        console.error(err);
        setCertification([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertification();
  }, [token, effectiveUserId]);

  return { certification, isLoading };
}
