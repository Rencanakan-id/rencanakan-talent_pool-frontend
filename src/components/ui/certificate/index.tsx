import React, { useState } from 'react';
import { Button } from '@/components';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

export interface CertificateDetail {
  id?: number;
  title: string;
  file: File | null;
  fileUrl?: string;
}

interface CertificateProps {
  certificates: CertificateDetail[];
  isEditable?: boolean;
  onAdd?: (certificate: CertificateDetail) => Promise<void>;
  onEdit?: (id: number, certificate: CertificateDetail) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

const Certificate: React.FC<CertificateProps> = ({
  certificates,
  isEditable = false,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<CertificateDetail | null>(null);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setFile(null);
    setEditingCertificate(null);
  };

  const handleOpenModal = (certificate?: CertificateDetail) => {
    if (certificate) {
      setEditingCertificate(certificate);
      setTitle(certificate.title);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !file) {
      alert('Please fill all required fields');
      return;
    }

    const certificateData: CertificateDetail = {
      title,
      file
    };

    try {
      setIsSubmitting(true);
      
      if (editingCertificate?.id) {
        await onEdit?.(editingCertificate.id, certificateData);
      } else {
        await onAdd?.(certificateData);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting certificate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await onDelete?.(id);
      } catch (error) {
        console.error('Error deleting certificate:', error);
      }
    }
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Sertifikat</h3>
        {isEditable && (
          <Button 
            variant="primary" 
            className="flex items-center gap-2"
            onClick={() => handleOpenModal()}
          >
            <PlusCircle size={20} />
            <span>Tambah</span>
          </Button>
        )}
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate, index) => (
            <div 
              key={certificate.id || index} 
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">{certificate.title}</h4>
                {isEditable && (
                  <div className="flex gap-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleOpenModal(certificate)}
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => certificate.id && handleDelete(certificate.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
              {certificate.fileUrl && (
                <a 
                  href={certificate.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No certificates available</p>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-xl font-semibold">
              {editingCertificate ? 'Edit Certificate' : 'Add Certificate'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block font-medium">Certificate Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-medium">Certificate File</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full rounded-lg border border-gray-300 p-2"
                  required={!editingCertificate}
                />
                {editingCertificate?.fileUrl && !file && (
                  <p className="mt-2 text-sm text-gray-500">
                    Current file: 
                    <a 
                      href={editingCertificate.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-1 text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificate;
