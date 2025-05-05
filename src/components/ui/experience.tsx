import React, { useState, useEffect } from 'react';
import { Typography } from '../atoms/typography';
import { Pencil, Plus, Edit } from 'lucide-react';
import { Input } from './input';
import { Combobox } from './combobox';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { ModalFormWrapper } from './modalFormWrapper';
import { ExperienceService, ExperienceRequestDTO, ExperienceResponseDTO, EmploymentType, LocationType } from '@/services/ExperienceService';
import { useAuth } from '../context/authContext';

// Define employment type labels
const employmentTypeLabels: Record<string, string> = {
  'FULL_TIME': 'Penuh Waktu',
  'PART_TIME': 'Paruh Waktu',
  'SELF_EMPLOYED': 'Wiraswasta',
  'FREELANCE': 'Pekerja Lepas',
  'CONTRACT': 'Kontrak',
  'INTERNSHIP': 'Magang',
  'APPRENTICESHIP': 'Pelatihan',
  'SEASONAL': 'Musiman',
  '': 'Pilih Jenis Pekerjaan'
};

// Define location type labels
const locationTypeLabels: Record<string, string> = {
  'ON_SITE': 'Di Lokasi',
  'HYBRID': 'Hybrid',
  'REMOTE': 'Remote',
  '': 'Pilih Tipe Lokasi'
};

interface ExperienceProps {
  experiences?: ExperienceResponseDTO[] | null;
}

// Define error state interface
interface FormErrors {
  title?: string;
  company?: string;
  employmentType?: string;
  startDate?: string;
  location?: string;
  locationType?: string;
  endDate?: string;
}

const Experience: React.FC<ExperienceProps> = ({ experiences = [] }) => {
  const { user, token } = useAuth();
  const id = user.id?? '';

  const [experienceList, setExperienceList] = useState<ExperienceResponseDTO[]>(experiences || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceResponseDTO | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [wasValidated, setWasValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [experienceFormData, setExperienceFormData] = useState<ExperienceRequestDTO>({
    title: '',
    company: '',
    companyImage: '', // Assuming this is not used in the form, but required in the DTO
    employmentType: 'FULL_TIME',
    startDate: '',
    endDate: null,
    location: '',
    locationType: 'ON_SITE',
  });

  useEffect(() => {
    // If experiences is not provided, fetch from API
    if (!experiences || experiences.length === 0) {
      fetchExperiences();
    }
  }, [user.id, token]);

  const fetchExperiences = async () => {
    if (!user.id || !token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const experiences = await ExperienceService.getExperiences(user.id, token);
      setExperienceList(experiences || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
      console.error('Error fetching experiences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExperienceFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it was previously set
    if (wasValidated && formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Sekarang';
    try {
      return format(parseISO(dateStr), 'dd MMMM yyyy', { locale: idLocale });
    } catch (e) {
      return dateStr;
    }
  };

  const handleAdd = () => {
    setEditingExperience(null);
    setExperienceFormData({
      title: '',
      company: '',
      companyImage: '', // Assuming this is not used in the form, but required in the DTO
      employmentType: 'FULL_TIME',
      startDate: '',
      endDate: null,
      location: '',
      locationType: 'ON_SITE',
    });
    setIsCurrentlyWorking(false);
    setIsModalOpen(true);
    setFormErrors({});
    setWasValidated(false);
  };

  const handleEdit = (exp: ExperienceResponseDTO) => {
    setEditingExperience(exp);
    setExperienceFormData(exp);
    setIsCurrentlyWorking(exp.endDate === null);
    setIsModalOpen(true);
    setFormErrors({});
    setWasValidated(false);
  };

  const handleDelete = async () => {
    if (editingExperience && editingExperience.id) {
      setIsLoading(true);
      setError(null);
      
      try {
        await ExperienceService.deleteExperience(token, editingExperience.id);
        setExperienceList((prev) => prev.filter((exp) => exp.id !== editingExperience.id));
        setIsModalOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete experience');
        console.error('Error deleting experience:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    // Validate required fields
    if (!experienceFormData.title.trim()) {
      errors.title = 'Judul pekerjaan harus diisi';
      isValid = false;
    }

    if (!experienceFormData.company.trim()) {
      errors.company = 'Nama perusahaan harus diisi';
      isValid = false;
    }

    if (!experienceFormData.employmentType) {
      errors.employmentType = 'Jenis pekerjaan harus dipilih';
      isValid = false;
    }

    if (!experienceFormData.location.trim()) {
      errors.location = 'Lokasi harus diisi';
      isValid = false;
    }

    if (!experienceFormData.locationType) {
      errors.locationType = 'Tipe lokasi harus dipilih';
      isValid = false;
    }

    if (!experienceFormData.startDate) {
      errors.startDate = 'Tanggal mulai harus diisi';
      isValid = false;
    }

    // Validate end date is after start date if provided
    if (!isCurrentlyWorking && experienceFormData.endDate) {
      if (experienceFormData.startDate && new Date(experienceFormData.startDate) > new Date(experienceFormData.endDate)) {
        errors.endDate = 'Tanggal selesai harus setelah tanggal mulai';
        isValid = false;
      }
    }

    setFormErrors(errors);
    setWasValidated(true);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      if (editingExperience && editingExperience.id) {
        // Update existing experience
        const updatedExperience = await ExperienceService.editExperience(
          token, 
          editingExperience.id, 
          experienceFormData
        );
        
        setExperienceList((prev) =>
          prev.map((exp) => (exp.id === editingExperience.id ? updatedExperience : exp))
        );
      } else {
        // Add new experience
        const {  ...experienceData } = experienceFormData;
        console.log(user.id, token, experienceData);
        const newExperience = await ExperienceService.addExperience(id, token, experienceData);
        
        if (newExperience) {
          setExperienceList((prev) => [...prev, newExperience]);
        }

      }
      
      setIsModalOpen(false);
      setFormErrors({});
      setWasValidated(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save experience');
      console.error('Error saving experience:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get the display label for employment type
  const getEmploymentTypeLabel = (type: EmploymentType) => {
    return employmentTypeLabels[type] || type;
  };

  // Helper function to get the display label for location type
  const getLocationTypeLabel = (type: LocationType) => {
    return locationTypeLabels[type] || type;
  };

  return (
    <div className="min-h-[200px] w-full rounded-lg border border-rencanakan-base-gray p-6">
      <div className="flex justify-between items-center">
        <Typography variant="p1">Pengalaman</Typography>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="p-2 rounded-full bg-rencanakan-base-gray hover:bg-rencanakan-dark-gray hover:text-rencanakan-base-gray cursor-pointer"
            data-testid="edit-experience-button"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={handleAdd}
            className="p-2 rounded-full bg-rencanakan-sea-blue-300 text-white hover:bg-rencanakan-sea-blue-500 cursor-pointer"
            data-testid="add-experience-button"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {isLoading && <Typography variant="p3" className="text-rencanakan-dark-gray mt-2">Memuat...</Typography>}
      {error && <Typography variant="p3" className="text-red-500 mt-2">{error}</Typography>}

      {!isLoading && experienceList.length > 0 ? (
        <div className="w-full space-y-2 divide-y divide-gray-300">
          {experienceList.map((exp) => (
            <div key={exp.id} className="min-h-[112px] space-y-1 flex justify-between items-center">
              <div className="flex gap-4 items-start">
                <img
                  src="https://i.pinimg.com/736x/11/48/4f/11484f06170418c48b0b183b8868b64f.jpg"
                  width={32}
                  height={32}
                  alt="Exp logo"
                  draggable="false"
                />
                <div>
                  <Typography variant="h6">{exp.title}</Typography>
                  <Typography variant="p4">{exp.company} • {getEmploymentTypeLabel(exp.employmentType)}</Typography>
                  <Typography variant="p4" className="text-rencanakan-dark-gray">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </Typography>
                  <Typography variant="p4" className="text-rencanakan-dark-gray">
                    {exp.location} • {getLocationTypeLabel(exp.locationType)}
                  </Typography>
                </div>
              </div>
              {isEditMode && (
                <button 
                  data-testid={`edit-button-${exp.id}`}
                  onClick={() => handleEdit(exp)} 
                  className="p-2 rounded-full bg-rencanakan-base-gray hover:bg-rencanakan-dark-gray hover:text-rencanakan-base-gray cursor-pointer"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : !isLoading && (
        <Typography variant="p3" className="text-rencanakan-dark-gray">Tidak ada pengalaman.</Typography>
      )}

      {isModalOpen && (
        <ModalFormWrapper
            isOpen={isModalOpen}
            title={editingExperience ? "Edit Pengalaman" : "Tambah Pengalaman"}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            onDelete={editingExperience ? handleDelete : undefined}
            submitLabel={editingExperience ? "Simpan" : "Tambah"}
            isEditMode={!!editingExperience}
        >
          <div className="flex flex-col space-y-4 pt-1">
            <div>
              <Input 
                label="Judul*" 
                data-testid="input-title"
                placeholder='Masukkan judul pekerjaan Anda' 
                name="title" 
                value={experienceFormData.title} 
                onChange={handleChange} 
              />
              {wasValidated && formErrors.title && (
                <Typography variant="p5" className="text-red-500 mt-1">{formErrors.title}</Typography>
              )}
            </div>

            <div>
              <Input 
                label="Perusahaan*" 
                data-testid="input-company"
                placeholder='Masukkan nama perusahaan tempat bekerja' 
                name="company" 
                value={experienceFormData.company} 
                onChange={handleChange} 
              />
              {wasValidated && formErrors.company && (
                <Typography variant="p5" className="text-red-500 mt-1">{formErrors.company}</Typography>
              )}
            </div>
            
            <div>
              <Combobox
                data={Object.entries(employmentTypeLabels).filter(([value]) => value !== '').map(([value, label]) => ({ value, label }))}
                value={experienceFormData.employmentType}
                onChange={(value) => {
                  setExperienceFormData((prev) => ({ ...prev, employmentType: value as EmploymentType }));
                  if (wasValidated && formErrors.employmentType) {
                    setFormErrors(prev => ({ ...prev, employmentType: undefined }));
                  }
                }}
                label="Jenis Pekerjaan*"
                placeholder="Cari jenis pekerjaan..."
                data-testid="input-employment-type"
              />
              {wasValidated && formErrors.employmentType && (
                <Typography variant="p5" className="text-red-500 mt-1">{formErrors.employmentType}</Typography>
              )}
            </div>

            <div>
              <Input 
                label="Lokasi*" 
                data-testid="input-location"
                name="location" 
                value={experienceFormData.location} 
                onChange={handleChange} 
                placeholder="Masukkan lokasi tempat bekerja"
              />
              {wasValidated && formErrors.location && (
                <Typography variant="p5" className="text-red-500 mt-1">{formErrors.location}</Typography>
              )}
            </div>

            <div>
              <Combobox
                data={Object.entries(locationTypeLabels).filter(([value]) => value !== '').map(([value, label]) => ({ value, label }))}
                value={experienceFormData.locationType}
                onChange={(value) => {
                  setExperienceFormData((prev) => ({ ...prev, locationType: value as LocationType }));
                  if (wasValidated && formErrors.locationType) {
                    setFormErrors(prev => ({ ...prev, locationType: undefined }));
                  }
                }}
                label="Tipe Lokasi*"
                placeholder="Cari tipe lokasi..."
                data-testid="input-location-type"
              />
              {wasValidated && formErrors.locationType && (
                <Typography variant="p5" className="text-red-500 mt-1">{formErrors.locationType}</Typography>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input 
                id="currently-working"
                type="checkbox" 
                data-testid="checkbox-currently-working"
                checked={isCurrentlyWorking} 
                onChange={() => {
                  setIsCurrentlyWorking(!isCurrentlyWorking);
                  setExperienceFormData(prev => ({ ...prev, endDate: !isCurrentlyWorking ? null : '' }));
                  if (wasValidated && formErrors.endDate) {
                    setFormErrors(prev => ({ ...prev, endDate: undefined }));
                  }
                }} 
              />
              <label htmlFor="currently-working">
                <Typography variant='p5'>Saya sedang bekerja di posisi ini</Typography>
              </label>
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <div className={isCurrentlyWorking ? "col-span-2" : "col-span-1"}>
                <Input 
                  label="Tanggal Mulai*" 
                  data-testid="input-start-date"
                  name="startDate" 
                  value={experienceFormData.startDate} 
                  onChange={handleChange} 
                  type="date" 
                  className="w-full"
                />
                {wasValidated && formErrors.startDate && (
                  <Typography variant="p5" className="text-red-500 mt-1">{formErrors.startDate}</Typography>
                )}
              </div>
              {!isCurrentlyWorking && (
                <div className="flex justify-end">
                  <div className="w-full">
                    <Input 
                      label="Tanggal Selesai" 
                      data-testid="input-end-date"
                      name="endDate" 
                      value={experienceFormData.endDate ?? ''} 
                      onChange={handleChange} 
                      type="date"
                      className="w-full"
                    />
                    {wasValidated && formErrors.endDate && (
                      <Typography variant="p5" className="text-red-500 mt-1">{formErrors.endDate}</Typography>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ModalFormWrapper>
      )}
    </div>
  );
};

export default Experience;