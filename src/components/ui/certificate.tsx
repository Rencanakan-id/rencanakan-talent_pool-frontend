import React, { useState, useEffect } from "react";
import { Typography } from "../atoms/typography";
import { Button } from "./button";
import { Input } from "./input";
import { Edit, Plus, Download, Pencil } from "lucide-react";
import { FileInput } from "./fileInput";
import { ModalFormWrapper } from "./modalFormWrapper";
import { useAuth } from '../context/authContext';
import { CertificationService } from '@/services/CertificationService';
import { CertificationRequestDTO, CertificationResponseDTO } from "@/lib/certificate";

interface CertificationProps {
    certificates?: CertificationResponseDTO[] | null;
}

interface FormErrors {
    title?: string;
    file?: string;
}

const Certification: React.FC<CertificationProps> = ({ certificates = [] }) => {
    const { user, token } = useAuth();
    const id = user?.id ?? '';

    const [certificationList, setCertificationList] = useState<CertificationResponseDTO[]>(certificates || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCertification, setEditingCertification] = useState<CertificationResponseDTO | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [wasValidated, setWasValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [certificateFormData, setCertificateFormData] = useState<CertificationRequestDTO>({
        title: '',
        file: '', // String type as per CertificationRequestDTO
    });
    
    useEffect(() => {
        if (!certificates || certificates.length === 0) {
            fetchCertifications();
        }
    }, [user?.id, token]);

    const fetchCertifications = async () => {
        if (!user?.id || !token) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const certificates = await CertificationService.getCertifications(user.id, token);
            setCertificationList(certificates || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch certificates');
            console.error('Error fetching certificates:', err);
        } finally {
            setIsLoading(false);
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
            // Store file info as string (could be a file path, URL, or other string representation)
            // You might need to adjust this based on how your API expects the file
            setCertificateFormData((prev) => ({ 
                ...prev, 
                file: file.name // Or another string representation that works with your API
            }));
            
            if (wasValidated && formErrors.file) {
                setFormErrors(prev => ({ ...prev, file: undefined }));
            }
        }
    };

    const handleAdd = () => {
        setEditingCertification(null);
        setCertificateFormData({
            title: '',
            file: '',
        });
        setIsModalOpen(true);
        setFormErrors({});
        setWasValidated(false);
    };
    
    const handleEdit = (cert: CertificationResponseDTO) => {
        setEditingCertification(cert);
        setCertificateFormData({
            title: cert.title || '',
            file: cert.file || '',
        });
        setIsModalOpen(true);
        setFormErrors({});
        setWasValidated(false);
    };

    const handleDelete = async () => {
        if (editingCertification?.id) {
            setIsLoading(true);
            setError(null);
            
            try {
                await CertificationService.deleteCertification(token, editingCertification.id);
                setCertificationList((prev) => prev.filter((cert) => cert.id !== editingCertification.id));
                setIsModalOpen(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete certificate');
                console.error('Error deleting certificate:', err);
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
        
        // Only require file for new certificates
        if (!editingCertification && (!certificateFormData.file)) {
            errors.file = "File sertifikasi wajib diunggah";
        }
        
        setFormErrors(errors);
        setWasValidated(true);
        
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            if (editingCertification?.id) {
                // Update existing certificate
                const updatedCertification = await CertificationService.editCertification(
                    token, 
                    editingCertification.id, 
                    certificateFormData
                );
                
                setCertificationList((prev) =>
                    prev.map((cert) => (cert.id === editingCertification.id ? updatedCertification : cert))
                );
            } else {
                // Add new certificate
                const newCertification = await CertificationService.addCertification(id, token, certificateFormData);
                
                if (newCertification) {
                    setCertificationList((prev) => [...prev, newCertification]);
                }
            }
            
            setIsModalOpen(false);
            setFormErrors({});
            setWasValidated(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save certificate');
            console.error('Error saving certificate:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = (file?: string) => {
        if (!file) return;
        const fileUrl = 'public/Catetan Kripto.pdf'
        window.open(fileUrl, '_blank');
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    return (
        <div className="min-h-[200px] w-full rounded-[8px] border border-rencanakan-base-gray p-6">
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

            {isLoading && <Typography variant="p3" className="text-rencanakan-dark-gray mt-2">Memuat...</Typography>}
            {error && <Typography variant="p3" className="text-red-500 mt-2">{error}</Typography>}

            {!isLoading && certificationList.length > 0 ? (
                <div className="w-full space-y-4">
                    {certificationList.map((cert) => (
                        <div key={cert.id} className="min-h-18 space-y-1 space-x-2 flex items-center justify-between bg-rencanakan-lightest-gray border-rencanakan-light-gray border-[1px] rounded-xl p-4">
                            <div className="flex space-x-2 items-center">
                                <img src="/pdf.svg" alt="Logo" className="h-8 w-8" draggable={false} />
                                <div>
                                    <Typography variant="p4" className="font-medium text-rencanakan-type-black">{cert.title}</Typography>
                                    {cert.file && (
                                        <Typography variant="p4" className="text-rencanakan-dark-gray">
                                            {cert.file}
                                        </Typography>
                                    )}
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
                                        onClick={() => handleDownload(cert.file)}
                                        data-testid={`download-btn-${cert.id}`}
                                        disabled={!cert.file}
                                    >
                                        Download File
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : !isLoading && (
                <Typography variant="p3" className="text-rencanakan-dark-gray">
                    Tidak ada sertifikasi.
                </Typography>
            )}

            {isModalOpen && (
                <ModalFormWrapper
                    isOpen={isModalOpen}
                    title={editingCertification ? "Edit Sertifikasi" : "Tambah Sertifikasi"}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    onDelete={editingCertification ? handleDelete : undefined}
                    submitLabel={editingCertification ? "Simpan" : "Tambah"}
                    isEditMode={!!editingCertification}
                >
                    <div className="flex flex-col space-y-4 pt-1">
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
                                textLabel={editingCertification ? "File Baru (opsional)" : "File*"}
                                data-testid="file-input"
                                error={wasValidated && formErrors.file ? formErrors.file : undefined}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </ModalFormWrapper>
            )}
        </div>
    );
};

export default Certification;