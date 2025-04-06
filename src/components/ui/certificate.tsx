import { Typography } from "../atoms/typography";
import { Button } from "./button";

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

    const handleDownload = (file: File) => {
        const url = URL.createObjectURL(file);

        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-[200px] w-full rounded-[8px] border border-gray-300 p-6">
            <Typography variant="p1" className="pb-4 text-rencanakan-type-black font-medium">
                Sertifikasi
            </Typography>

            {certificates.length > 0 ? (
                <div className="w-full space-y-4">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="min-h-18 space-y-1 space-x-2 flex items-center justify-between bg-rencanakan-lightest-gray border-rencanakan-light-gray border-[1px] rounded-xl p-4">
                            <div className="flex space-x-2 items-center">
                                <img src="/pdf.svg" alt="Logo" className="h-8 w-8" draggable={false} />
                                <div>
                                    <Typography variant="p4" className="font-medium text-rencanakan-type-black"> {cert.file.name} </Typography>
                                    <Typography variant="p4" className="text-rencanakan-dark-gray">{formatFileSize(cert.file.size)}</Typography>
                                </div>
                            </div>
                            <Button 
                                variant="primary" 
                                icon={<img src="/download.svg" alt="" className="h-4 w-4" draggable={false} />} 
                                iconPosition="end"
                                onClick={() => handleDownload(cert.file)}
                                data-testid={`download-btn-${cert.id}`}
                            >
                                Download File
                            </Button>
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