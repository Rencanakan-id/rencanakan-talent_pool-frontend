// import React, { useState, useEffect, useCallback } from "react";
// import { Typography } from "../atoms/typography";
// import { Button } from "./button";
// import { Input } from "./input";
// import { Edit, Plus, Download, Pencil, AlertTriangle } from "lucide-react";
// import { FileInput } from "./fileInput";
// import { ModalFormWrapper } from "./modalFormWrapper";
// import { useAuth } from '../context/authContext';
// import { CertificationService } from '@/services/CertificationService';
// import { CertificationRequestDTO, CertificationResponseDTO } from "@/lib/certificate";
// import DOMPurify from 'dompurify'; // Import for XSS prevention

// // Constants for security settings
// const ALLOWED_FILE_TYPES = ['application/pdf'];
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const API_RATE_LIMIT = 5; // Maximum number of API calls within timeframe
// const API_RATE_WINDOW = 60000; // 1 minute in milliseconds

// interface CertificationProps {
//     certificates?: CertificationResponseDTO[] | null;
// }

// interface FormErrors {
//     title?: string;
//     file?: string;
// }

// const Certification: React.FC<CertificationProps> = ({ certificates = [] }) => {
//     const { user, token, isTokenExpired, refreshToken } = useAuth();
//     const id = user?.id ?? '';

//     const [certificationList, setCertificationList] = useState<CertificationResponseDTO[]>(certificates || []);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingCertification, setEditingCertification] = useState<CertificationResponseDTO | null>(null);
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [formErrors, setFormErrors] = useState<FormErrors>({});
//     const [wasValidated, setWasValidated] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [confirmDelete, setConfirmDelete] = useState(false);
//     const [apiCallCount, setApiCallCount] = useState(0);
//     const [lastApiCallTime, setLastApiCallTime] = useState(Date.now());
//     const [fileObject, setFileObject] = useState<File | null>(null);

//     const [certificateFormData, setCertificateFormData] = useState<CertificationRequestDTO>({
//         title: '',
//         file: '',
//     });
    
//     // Reset API call counter
//     useEffect(() => {
//         const timer = setInterval(() => {
//             if (Date.now() - lastApiCallTime > API_RATE_WINDOW) {
//                 setApiCallCount(0);
//             }
//         }, API_RATE_WINDOW);
        
//         return () => clearInterval(timer);
//     }, [lastApiCallTime]);

//     // Security wrapper for API calls
//     const secureApiCall = useCallback(async (apiFunction: () => Promise<any>) => {
//         // Check token expiration
//         if (isTokenExpired && refreshToken) {
//             await refreshToken();
//         }
        
//         // Check rate limiting
//         if (apiCallCount >= API_RATE_LIMIT && Date.now() - lastApiCallTime < API_RATE_WINDOW) {
//             throw new Error("Too many requests. Please try again later.");
//         }
        
//         // Update API call metrics
//         setApiCallCount(prevCount => prevCount + 1);
//         setLastApiCallTime(Date.now());
        
//         // Execute the API call
//         return await apiFunction();
//     }, [apiCallCount, lastApiCallTime, isTokenExpired, refreshToken]);
    
//     const fetchCertifications = useCallback(async () => {
//         if (!user?.id || !token) return;
        
//         setIsLoading(true);
//         setError(null);
        
//         try {
//             const certificates = await secureApiCall(() => 
//                 CertificationService.getCertifications(user.id, token)
//             );
//             setCertificationList(certificates || []);
//         } catch (err) {
//             // Generic error message for security
//             setError("Failed to fetch certificates. Please try again.");
//             console.error('Error fetching certificates:', err);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [user?.id, token, secureApiCall]);
    
//     useEffect(() => {
//         if (!certificates || certificates.length === 0) {
//             fetchCertifications();
//         }
//     }, [certificates, fetchCertifications]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         // Sanitize input to prevent XSS
//         const sanitizedValue = DOMPurify.sanitize(value);
        
//         setCertificateFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
        
//         if (wasValidated && formErrors[name as keyof FormErrors]) {
//             setFormErrors(prev => ({ ...prev, [name]: undefined }));
//         }
//     };

//     const handleFileChange = (file: File | null) => {
//         if (file) {
//             // Validate file type
//             if (!ALLOWED_FILE_TYPES.includes(file.type)) {
//                 setFormErrors(prev => ({ 
//                     ...prev, 
//                     file: "Only PDF files are allowed" 
//                 }));
//                 return;
//             }
            
//             // Validate file size
//             if (file.size > MAX_FILE_SIZE) {
//                 setFormErrors(prev => ({ 
//                     ...prev, 
//                     file: "File size must be less than 5MB" 
//                 }));
//                 return;
//             }
            
//             setFileObject(file);
//             setCertificateFormData((prev) => ({ 
//                 ...prev, 
//                 file: file.name
//             }));
            
//             if (wasValidated && formErrors.file) {
//                 setFormErrors(prev => ({ ...prev, file: undefined }));
//             }
//         }
//     };

//     const handleAdd = () => {
//         setEditingCertification(null);
//         setCertificateFormData({
//             title: '',
//             file: '',
//         });
//         setFileObject(null);
//         setIsModalOpen(true);
//         setFormErrors({});
//         setWasValidated(false);
//     };
    
//     const handleEdit = (cert: CertificationResponseDTO) => {
//         // Verify user owns this certification (additional BAC)
//         if (cert.userId && cert.userId !== user?.id) {
//             setError("You don't have permission to edit this certification");
//             return;
//         }
        
//         setEditingCertification(cert);
//         setCertificateFormData({
//             title: cert.title || '',
//             file: cert.file || '',
//         });
//         setFileObject(null);
//         setIsModalOpen(true);
//         setFormErrors({});
//         setWasValidated(false);
//     };

//     const handleDeleteRequest = () => {
//         setConfirmDelete(true);
//     };
    
//     const handleDelete = async () => {
//         if (editingCertification?.id) {
//             setIsLoading(true);
//             setError(null);
            
//             try {
//                 await secureApiCall(() => 
//                     CertificationService.deleteCertification(token, editingCertification.id)
//                 );
                
//                 // Log the action for audit
//                 console.log(`Certificate deleted: ${editingCertification.id} at ${new Date().toISOString()}`);
                
//                 setCertificationList((prev) => prev.filter((cert) => cert.id !== editingCertification.id));
//                 setIsModalOpen(false);
//                 setConfirmDelete(false);
//             } catch (err) {
//                 setError("Failed to delete certificate. Please try again.");
//                 console.error('Error deleting certificate:', err);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//     };

//     const validateForm = (): boolean => {
//         const errors: FormErrors = {};
        
//         if (!certificateFormData.title.trim()) {
//             errors.title = "Judul sertifikasi wajib diisi";
//         } else if (certificateFormData.title.length > 100) {
//             errors.title = "Judul tidak boleh lebih dari 100 karakter";
//         }
        
//         // Only require file for new certificates
//         if (!editingCertification && !fileObject) {
//             errors.file = "File sertifikasi wajib diunggah";
//         }
        
//         setFormErrors(errors);
//         setWasValidated(true);
        
//         return Object.keys(errors).length === 0;
//     };

//     const handleSubmit = async () => {
//         if (!validateForm()) return;
        
//         setIsLoading(true);
//         setError(null);
        
//         try {
//             if (editingCertification?.id) {
//                 // Update existing certificate
//                 const updatedCertification = await secureApiCall(() => 
//                     CertificationService.editCertification(
//                         token, 
//                         editingCertification.id, 
//                         certificateFormData,
//                         fileObject
//                     )
//                 );
                
//                 // Log the action for audit
//                 console.log(`Certificate updated: ${editingCertification.id} at ${new Date().toISOString()}`);
                
//                 setCertificationList((prev) =>
//                     prev.map((cert) => (cert.id === editingCertification.id ? updatedCertification : cert))
//                 );
//             } else {
//                 // Add new certificate
//                 const newCertification = await secureApiCall(() => 
//                     CertificationService.addCertification(
//                         id, 
//                         token, 
//                         certificateFormData,
//                         fileObject
//                     )
//                 );
                
//                 // Log the action for audit
//                 console.log(`Certificate added: ${newCertification.id} at ${new Date().toISOString()}`);
                
//                 if (newCertification) {
//                     setCertificationList((prev) => [...prev, newCertification]);
//                 }
//             }
            
//             setIsModalOpen(false);
//             setFormErrors({});
//             setWasValidated(false);
//         } catch (err) {
//             setError("Failed to save certificate. Please try again.");
//             console.error('Error saving certificate:', err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleDownload = async (fileId?: string, fileName?: string) => {
//         if (!fileId || !fileName) return;
        
//         try {
//             // Use a secure URL pattern with proper validation
//             const fileUrl = await secureApiCall(() => 
//                 CertificationService.getDownloadUrl(token, fileId)
//             );
            
//             if (fileUrl) {
//                 // Log download attempt for security audit
//                 console.log(`File downloaded: ${fileId} at ${new Date().toISOString()}`);
                
//                 // Use safe download approach
//                 const link = document.createElement('a');
//                 link.href = fileUrl;
//                 link.setAttribute('download', fileName);
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//             }
//         } catch (err) {
//             setError("Failed to download file. Please try again.");
//             console.error('Error downloading file:', err);
//         }
//     };

//     const toggleEditMode = () => {
//         setIsEditMode(!isEditMode);
//     };

//     return (
//         <div className="min-h-[200px] w-full rounded-[8px] border border-rencanakan-base-gray p-6">
//             <div className="flex justify-between items-center pb-4">
//                 <Typography variant="p1" className="text-rencanakan-type-black font-medium">
//                     Sertifikasi
//                 </Typography>
//                 <div className="flex space-x-2">
//                     <button
//                         onClick={toggleEditMode}
//                         className="p-2 rounded-full bg-rencanakan-base-gray hover:bg-rencanakan-dark-gray hover:text-rencanakan-base-gray cursor-pointer"
//                         data-testid="edit-certificate-button"
//                         aria-label="Toggle edit mode"
//                     >
//                         <Edit size={20} />
//                     </button>
//                     <button
//                         onClick={handleAdd}
//                         className="p-2 rounded-full bg-rencanakan-sea-blue-300 text-white hover:bg-rencanakan-sea-blue-500 cursor-pointer"
//                         data-testid="add-certificate-button"
//                         aria-label="Add certificate"
//                     >
//                         <Plus size={20} />
//                     </button>
//                 </div>
//             </div>

//             {isLoading && <Typography variant="p3" className="text-rencanakan-dark-gray mt-2">Memuat...</Typography>}
//             {error && (
//                 <div className="flex items-center p-3 bg-red-50 text-red-700 rounded mt-2">
//                     <AlertTriangle size={16} className="mr-2" />
//                     <Typography variant="p3">{error}</Typography>
//                 </div>
//             )}

//             {!isLoading && certificationList.length > 0 ? (
//                 <div className="w-full space-y-4">
//                     {certificationList.map((cert) => (
//                         <div key={cert.id} className="min-h-18 space-y-1 space-x-2 flex items-center justify-between bg-rencanakan-lightest-gray border-rencanakan-light-gray border-[1px] rounded-xl p-4">
//                             <div className="flex space-x-2 items-center">
//                                 <img src="/pdf.svg" alt="PDF icon" className="h-8 w-8" draggable={false} />
//                                 <div>
//                                     <Typography variant="p4" className="font-medium text-rencanakan-type-black">
//                                         {/* Render safely with trusted content */}
//                                         {cert.title}
//                                     </Typography>
//                                     {cert.file && (
//                                         <Typography variant="p4" className="text-rencanakan-dark-gray">
//                                             {cert.file}
//                                         </Typography>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="flex space-x-2">
//                                 {isEditMode ? (
//                                     <button 
//                                         onClick={() => handleEdit(cert)}
//                                         data-testid={`edit-button-${cert.id}`}
//                                         className="p-2 rounded-full bg-rencanakan-base-gray hover:bg-rencanakan-dark-gray hover:text-rencanakan-base-gray cursor-pointer"
//                                         aria-label="Edit certificate"
//                                     >
//                                         <Pencil size={16} />
//                                     </button>
//                                 ) : (
//                                     <Button 
//                                         variant="primary" 
//                                         icon={<Download size={16} />}
//                                         iconPosition="end"
//                                         onClick={() => handleDownload(cert.id, cert.file)}
//                                         data-testid={`download-btn-${cert.id}`}
//                                         disabled={!cert.file}
//                                         aria-label="Download certificate"
//                                     >
//                                         Download File
//                                     </Button>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : !isLoading && (
//                 <Typography variant="p3" className="text-rencanakan-dark-gray">
//                     Tidak ada sertifikasi.
//                 </Typography>
//             )}

//             {isModalOpen && (
//                 <ModalFormWrapper
//                     isOpen={isModalOpen}
//                     title={editingCertification ? "Edit Sertifikasi" : "Tambah Sertifikasi"}
//                     onClose={() => setIsModalOpen(false)}
//                     onSubmit={handleSubmit}
//                     onDelete={editingCertification ? (confirmDelete ? handleDelete : handleDeleteRequest) : undefined}
//                     submitLabel={editingCertification ? "Simpan" : "Tambah"}
//                     deleteLabel={confirmDelete ? "Konfirmasi Hapus" : "Hapus"}
//                     isEditMode={!!editingCertification}
//                 >
//                     <div className="flex flex-col space-y-4 pt-1">
//                         {confirmDelete ? (
//                             <div className="bg-red-50 p-4 rounded-md text-center">
//                                 <AlertTriangle size={24} className="mx-auto mb-2 text-red-500" />
//                                 <Typography variant="p2" className="text-red-700 font-medium mb-2">
//                                     Konfirmasi Penghapusan
//                                 </Typography>
//                                 <Typography variant="p3" className="text-red-600 mb-4">
//                                     Apakah Anda yakin ingin menghapus sertifikasi ini? Tindakan ini tidak dapat dibatalkan.
//                                 </Typography>
//                                 <div className="flex justify-center space-x-3">
//                                     <Button 
//                                         variant="secondary" 
//                                         onClick={() => setConfirmDelete(false)}
//                                         data-testid="cancel-delete-btn"
//                                     >
//                                         Batal
//                                     </Button>
//                                     <Button 
//                                         variant="danger" 
//                                         onClick={handleDelete}
//                                         data-testid="confirm-delete-btn"
//                                     >
//                                         Ya, Hapus
//                                     </Button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <>
//                                 <div>
//                                     <Input
//                                         label="Judul*"
//                                         data-testid="input-title"
//                                         placeholder="Masukkan judul sertifikasi Anda"
//                                         name="title"
//                                         value={certificateFormData.title}
//                                         onChange={handleChange}
//                                         disabled={isLoading}
//                                         maxLength={100}
//                                     />
//                                     {wasValidated && formErrors.title && (
//                                         <Typography variant="p5" className="text-red-500 mt-1">
//                                             {formErrors.title}
//                                         </Typography>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <FileInput
//                                         onFileSelect={handleFileChange}
//                                         textLabel={editingCertification ? "File Baru (opsional)" : "File*"}
//                                         data-testid="file-input"
//                                         error={wasValidated && formErrors.file ? formErrors.file : undefined}
//                                         disabled={isLoading}
//                                         acceptedFileTypes={ALLOWED_FILE_TYPES.join(',')}
//                                         maxSize={MAX_FILE_SIZE}
//                                     />
//                                     <Typography variant="p5" className="text-rencanakan-dark-gray mt-1">
//                                         Format yang diterima: PDF. Maksimal 5MB.
//                                     </Typography>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </ModalFormWrapper>
//             )}
//         </div>
//     );
// };

// export default Certification;