import { useState } from "react";
import { Typography } from "../atoms/typography";
import { Button } from "./button";
import { Input } from "./input";
import { Edit, Plus, Download, Pencil, Trash2 } from "lucide-react";
import { FileInput } from "./fileInput";
import { ModalFormWrapper } from "./modalFormWrapper";

export interface CertificateDetail {
    id?: number;
    title: string;
    file: File | null;
    fileUrl?: string;
}

interface FormErrors {
    title?: string;
    file?: string;
}

interface CertificateProps {
    certificates?: CertificateDetail[];
    onSubmit?: (certificateData: CertificateDetail) => Promise<void>;
    onEdit?: (id: number, certificateData: CertificateDetail) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}

const Certificate: React.FC<CertificateProps> = ({ 
    certificates = [],
    onSubmit,
    onEdit,
    onDelete
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<CertificateDetail | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [wasValidated, setWasValidated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [certificateFormData, setCertificateFormData] = useState<CertificateDetail>({
        title: '',
        file: null,
    });
    
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
            title: '',
            file: null,
        });
        setIsModalOpen(true);
        setFormErrors({});
        setWasValidated(false);
    };
    
    const handleEdit = (cert: CertificateDetail) => {
        setEditingCertificate(cert);
        setCertificateFormData({
            id: cert.id,
            title: cert.title,
            file: null,
            fileUrl: cert.fileUrl
        });
        setIsModalOpen(true);
        setFormErrors({});
        setWasValidated(false);
    };

    const handleConfirmDelete = async (id?: number) => {
        if (!id || !onDelete) return;
        
        try {
            setIsSubmitting(true);
            await onDelete(id);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error deleting certificate:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        
        if (!certificateFormData.title.trim()) {
            errors.title = "Judul sertifikasi wajib diisi";
        }
        
        // Only require file for new certificates
        if (!editingCertificate && (!certificateFormData.file || certificateFormData.file.size === 0)) {
            errors.file = "File sertifikasi wajib diunggah";
        }
        
        setFormErrors(errors);
        setWasValidated(true);
        
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        try {
            setIsSubmitting(true);
            
            if (editingCertificate?.id && onEdit) {
                await onEdit(editingCertificate.id, certificateFormData);
            } else if (onSubmit) {
                await onSubmit(certificateFormData);
            }
            
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error submitting certificate:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = (fileUrl?: string) => {
        if (!fileUrl) return;
        window.open(fileUrl, '_blank');
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

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

            {certificates.length > 0 ? (
                <div className="w-full space-y-4">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="min-h-18 space-y-1 space-x-2 flex items-center justify-between bg-rencanakan-lightest-gray border-rencanakan-light-gray border-[1px] rounded-xl p-4">
                            <div className="flex space-x-2 items-center">
                                <img src="/pdf.svg" alt="Logo" className="h-8 w-8" draggable={false} />
                                <div>
                                    <Typography variant="p4" className="font-medium text-rencanakan-type-black">{cert.title}</Typography>
                                    {cert.fileUrl && (
                                        <Typography variant="p4" className="text-rencanakan-dark-gray">
                                            Certificate File
                                        </Typography>
                                    )}
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                {isEditMode ? (
                                    <>
                                        <button 
                                            onClick={() => handleEdit(cert)}
                                            data-testid={`edit-button-${cert.id}`}
                                            className="p-2 rounded-full bg-rencanakan-base-gray hover:bg-rencanakan-dark-gray hover:text-rencanakan-base-gray cursor-pointer"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        {onDelete && (
                                            <button 
                                                onClick={() => handleConfirmDelete(cert.id)}
                                                data-testid={`delete-button-${cert.id}`}
                                                className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 cursor-pointer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <Button 
                                        variant="primary" 
                                        icon={<Download size={16} />}
                                        iconPosition="end"
                                        onClick={() => handleDownload(cert.fileUrl)}
                                        data-testid={`download-btn-${cert.id}`}
                                        disabled={!cert.fileUrl}
                                    >
                                        Download File
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Typography variant="p3" className="text-gray-500">
                    Tidak ada sertifikasi.
                </Typography>
            )}

            {isModalOpen && (
                <ModalFormWrapper
                    isOpen={isModalOpen}
                    title={editingCertificate ? "Edit Sertifikasi" : "Tambah Sertifikasi"}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    onDelete={editingCertificate?.id ? () => handleConfirmDelete(editingCertificate.id) : undefined}
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
                            disabled={isSubmitting}
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
                            textLabel={editingCertificate ? "File Baru (opsional)" : "File*"}
                            data-testid="file-input"
                            error={wasValidated && formErrors.file ? formErrors.file : undefined}
                            disabled={isSubmitting}
                        />
                        {editingCertificate?.fileUrl && (
                            <Typography variant="p5" className="mt-1 text-gray-500">
                                File saat ini: <a href={editingCertificate.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lihat</a>
                            </Typography>
                        )}
                    </div>
                </ModalFormWrapper>
            )}
        </div>
    );
}

export default Certificate;