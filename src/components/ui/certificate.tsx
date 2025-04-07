import { useState } from "react";
import { Typography } from "../atoms/typography";
import { Button } from "./button";
import { Input } from "./input";
import { Edit, Plus, Download, Pencil } from "lucide-react";
import { FileInput } from "./fileInput";
import { ModalFormWrapper } from "./modalFormWrapper";

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
}

const Certificate: React.FC<CertificateProps> = ({ certificates = [] }) => {
    const [certificateList, setCertificateList] = useState<CertificateDetail[]>(certificates);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<CertificateDetail | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [wasValidated, setWasValidated] = useState(false);

    const [certificateFormData, setCertificateFormData] = useState<CertificateDetail>({
        id: 0,
        title: '',
        file: new File([], ''),
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
            id: certificateList.length + 1,
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

    const handleDelete = () => {
        if (editingCertificate) {
          setCertificateList((prev) =>
            prev.filter((exp) => exp.id !== editingCertificate.id)
          );
          setIsModalOpen(false);
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

    const handleSubmit = () => {
        if (!validateForm()) return;
        
        if (editingCertificate) {
            setCertificateList(prevList => 
                prevList.map(cert => 
                    cert.id === editingCertificate.id ? certificateFormData : cert
                )
            );
        } else {
            setCertificateList(prevList => [...prevList, certificateFormData]);
        }
        
        setIsModalOpen(false);
    };

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

            {certificateList.length > 0 ? (
                <div className="w-full space-y-4">
                    {certificateList.map((cert) => (
                        <div key={cert.id} className="min-h-18 space-y-1 space-x-2 flex items-center justify-between bg-rencanakan-lightest-gray border-rencanakan-light-gray border-[1px] rounded-xl p-4">
                            <div className="flex space-x-2 items-center">
                                <img src="/pdf.svg" alt="Logo" className="h-8 w-8" draggable={false} />
                                <div>
                                    <Typography variant="p4" className="font-medium text-rencanakan-type-black">{cert.file.name}</Typography>
                                    <Typography variant="p4" className="text-rencanakan-dark-gray">
                                        {formatFileSize(cert.file.size)}
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
                                        onClick={() => handleDownload(cert.file)}
                                        data-testid={`download-btn-${cert.id}`}
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
                        />
                    </div>
                </ModalFormWrapper>
            )}
        </div>
    );
}

export default Certificate;