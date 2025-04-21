import { useState } from "react";
import { Typography } from "../atoms/typography";
import { Button } from "./button";
import { Input } from "./input";
import { Edit, Plus, Download, Pencil } from "lucide-react";
import { FileInput } from "./fileInput";
import { ModalFormWrapper } from "./modalFormWrapper";
import { addCertificate, deleteCertificate, editCertificate } from "@/services/TestService";
import { useAuth } from "../context/authContext";

export interface CertificateDetail {
    id: number;
    title: string;
    file: File;
}

interface FormErrors {
    title?: string;
    file?: string;
}

interface CertificateProps {
    certificates?: CertificateDetail[];
    onCertificatesChange?: (certificates: CertificateDetail[]) => void;
}

const Certificate: React.FC<CertificateProps> = ({ 
    certificates = [], 
    onCertificatesChange 
}) => {
    const { token } = useAuth();

    const [certificateList, setCertificateList] = useState<CertificateDetail[]>(certificates);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<CertificateDetail | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [wasValidated, setWasValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const url = "/Sertifikat 1.pdf";

    const [certificateFormData, setCertificateFormData] = useState<CertificateDetail>({
        id: 0,
        title: '',
        file: new File([], ''),
    });

    const updateCertificateList = (newList: CertificateDetail[]) => {
        setCertificateList(newList);
        if (onCertificatesChange) {
            onCertificatesChange(newList);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCertificateFormData((prev) => ({ ...prev, [name]: value }));
        
        if (wasValidated && formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (file: File | null) => {
        if (file) {
            setCertificateFormData((prev) => ({ 
                ...prev, 
                file: file 
            }));
            
            if (wasValidated && formErrors.file) {
                setFormErrors(prev => ({ ...prev, file: undefined }));
            }
        }
    };

    const handleAdd = () => {
        setEditingCertificate(null);
        setCertificateFormData({
            id: 0,
            title: '',
            file: new File([], ''),
        });
        setIsModalOpen(true);
        setFormErrors({});
        setWasValidated(false);
    };
    
    const handleEdit = (cert: CertificateDetail) => {
        setEditingCertificate(cert);
        setCertificateFormData(cert);
        setIsModalOpen(true);
        setFormErrors({});
        setWasValidated(false);
    };

    const handleDelete = async () => {
        if (editingCertificate) {
            try {
                setIsLoading(true);
                await deleteCertificate(editingCertificate.id, token);
                
                const updatedList = certificateList.filter((cert) => cert.id !== editingCertificate.id);
                updateCertificateList(updatedList);
                setIsModalOpen(false);
            } catch (error) {
                console.error("Failed to delete certificate:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        
        if (!certificateFormData.title.trim()) {
            errors.title = "Judul sertifikasi wajib diisi";
        }
        
        if (!certificateFormData.file || certificateFormData.file.size === 0) {
            errors.file = "File sertifikasi wajib diunggah";
        }
        
        setFormErrors(errors);
        setWasValidated(true);
        
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        try {
            setIsLoading(true);
            
            if (editingCertificate) {
                const updatedCertificate = await editCertificate(
                    editingCertificate.id, 
                    certificateFormData,
                    token
                );
                
                const updatedList = certificateList.map(cert => 
                    cert.id === editingCertificate.id ? updatedCertificate : cert
                );
                updateCertificateList(updatedList);
            } else {
                const newCertificate = await addCertificate(
                    certificateFormData,
                    token
                );
                
                updateCertificateList([...certificateList, newCertificate]);
            }
            
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save certificate:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + sizes[i];
    };

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = "Sertifikat 1.pdf";
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    if (JSON.stringify(certificates) !== JSON.stringify(certificateList)) {
        setCertificateList(certificates);
    }

    return (
        <div className="min-h-[200px] w-full rounded-[8px] border border-gray-300 p-6">
            <div className="flex justify-between items-center pb-4">
                <Typography variant="p1" className="text-rencanakan-type-black font-medium">
                    Sertifikasi
                </Typography>
                <div className="flex space-x-2">
                    <button
                        onClick={toggleEditMode}
                        className="p-2 rounded-full bg-rencanakan-base-gray hover:bg-rencanakan-dark-gray hover:text-rencanakan-base-gray cursor-pointer"
                        data-testid="edit-certificate-button"
                    >
                        <Edit size={20} />
                    </button>
                    <button
                        onClick={handleAdd}
                        className="p-2 rounded-full bg-rencanakan-sea-blue-300 text-white hover:bg-rencanakan-sea-blue-500 cursor-pointer"
                        data-testid="add-certificate-button"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {!isLoading && certificateList.length > 0 ? (
                <div className="w-full space-y-4">
                    {certificateList.map((cert) => (
                        <div key={cert.id} className="min-h-18 space-y-1 space-x-2 flex items-center justify-between bg-rencanakan-lightest-gray border-rencanakan-light-gray border-[1px] rounded-xl p-4">
                            <div className="flex space-x-2 items-center">
                                <img src="/pdf.svg" alt="Logo" className="h-8 w-8" draggable={false} />
                                <div>
                                    <Typography variant="p4" className="font-medium text-rencanakan-type-black">{cert.title}.pdf</Typography>
                                    <Typography variant="p4" className="text-rencanakan-dark-gray">
                                        {formatFileSize(1024*1024)}
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                {isEditMode ? (
                                    <button 
                                        onClick={() => handleEdit(cert)}
                                        data-testid={`edit-button-${cert.id}`}
                                        className="p-2 rounded-full bg-rencanakan-base-gray hover:bg-rencanakan-dark-gray hover:text-rencanakan-base-gray cursor-pointer"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                ) : (
                                    <Button 
                                        variant="primary" 
                                        icon={<Download size={16} />}
                                        iconPosition="end"
                                        onClick={() => handleDownload()}
                                        data-testid={`download-btn-${cert.id}`}
                                        disabled={isLoading}
                                    >
                                        Download File
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !isLoading && (
                    <Typography variant="p3" className="text-gray-500">
                        Tidak ada sertifikasi.
                    </Typography>
                )
            )}

            {isModalOpen && (
                <ModalFormWrapper
                    isOpen={isModalOpen}
                    title={editingCertificate ? "Edit Sertifikasi" : "Tambah Sertifikasi"}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    onDelete={editingCertificate ? handleDelete : undefined}
                    submitLabel={editingCertificate ? "Simpan" : "Tambah"}
                    isEditMode={!!editingCertificate}
                >
                    <div>
                        <Input
                            label="Judul*"
                            data-testid="input-title"
                            placeholder="Masukkan judul sertifikasi Anda"
                            name="title"
                            value={certificateFormData.title}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {wasValidated && formErrors.title && (
                            <Typography variant="p5" className="text-red-500 mt-1">
                            {formErrors.title}
                            </Typography>
                        )}
                    </div>

                    <div>
                        <FileInput
                            onFileSelect={handleFileChange}
                            textLabel="Media"
                            data-testid="file-input"
                            error={wasValidated && formErrors.file ? formErrors.file : undefined}
                            disabled={isLoading}
                        />
                    </div>
                </ModalFormWrapper>
            )}
        </div>
    );
}

export default Certificate;