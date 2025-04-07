import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/authContext";
import { CertificationService } from "@/services/CertificationService";
import { CertificateDetail } from "../ui/certificate";

export function useCertification(userId?: string) {
  const [certification, setCertification] = useState<CertificateDetail[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCertification = async () => {
      if (!token || !userId) return;
      try {
        const certificationData = await CertificationService.getCertificates(userId, token);
        setCertification(certificationData.data?? null);
      } catch (err) {
        console.error(err);
        setCertification(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertification();
  }, [token, userId]);

  return { certification, isLoading };
}
