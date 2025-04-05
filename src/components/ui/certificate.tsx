import { Typography } from "../atoms/typography";

export interface CertificateDetail {
    id: number;
    title: string;
    file: File;
}

interface CertificateProps {
    certificates?: CertificateDetail[];
}


const Certificate: React.FC<CertificateProps> = ({ certificates = [] }) => {

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + sizes[i];
    };

    return (
        <div className="min-h-[200px] w-full rounded-[8px] border border-gray-300 p-6">
            <Typography variant="p1" className="pb-4 text-rencanakan-type-black font-medium">
                Sertifikasi
            </Typography>

            {certificates.length > 0 ? (
                <div className="w-full space-y-4">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="min-h-18 space-y-1 space-x-2 flex items-center bg-rencanakan-lightest-gray border-rencanakan-light-gray border-[1px] rounded-xl p-4">
                            <img src="/pdf.svg" alt="Logo" className="h-8 w-8" />
                            <div>
                                <Typography variant="p4" className="font-medium text-rencanakan-type-black"> {cert.file.name} </Typography>
                                <Typography variant="p4" className="text-rencanakan-dark-gray">{formatFileSize(cert.file.size)}</Typography>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Typography variant="p3" className="text-gray-500">
                    Tidak ada sertifikasi.
                </Typography>
            )}
        </div>
    );
}

export default Certificate;