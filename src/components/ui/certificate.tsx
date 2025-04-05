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
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    return (
        <div className="min-h-[200px] w-full rounded-[8px] border border-gray-300 px-6 py-6">
            <Typography variant="p1" className="pb-4 text-rencanakan-type-black">
                Sertifikasi
            </Typography>

            {certificates.length > 0 ? (
                <div className="w-full space-y-2 divide-y divide-gray-300">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="min-h-[112px] space-y-1 flex">
                            <img src="/pdf.svg" alt="Logo" className="h-[40px] w-[40px]" />
                            <div>
                                <Typography variant="h5"> {cert.title} </Typography>
                                <Typography variant="p3">
                                    {' '}
                                    {cert.file.name}{' '}
                                </Typography>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Typography variant="p3" className="text-gray-500">
                    Tidak ada sertifikat.
                </Typography>
            )}
        </div>
    );
}

export default Certificate;