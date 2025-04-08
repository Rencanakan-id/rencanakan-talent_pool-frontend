import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/authContext";
import { CertificateDetail } from "../ui/certificate";
import { UserService } from "@/services/UserService";

export function useCertification(userId?: string) {
  const [certification, setCertification] = useState<CertificateDetail[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCertification = async () => {
      if (!token || !userId) return;
      try {

        const certificationData = await UserService.getUserCertification(userId, token);
        setCertification(certificationData.data?? null);
      } catch (err) {
        console.error(err);
        setCertification([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertification();
  }, [token, userId]);

  return { certification, isLoading };
}
