import { useState } from 'react';
import { Typography } from '../atoms/typography';
import { Modal } from './modal';
import { Pencil, Plus, Edit } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { Combobox } from './combobox';

export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'SELF_EMPLOYED'
  | 'FREELANCE'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'APPRENTICESHIP'
  | 'SEASONAL';

export type LocationType = 'ON_SITE' | 'HYBRID';

export interface ExperienceDetail {
  id: number;
  title: string;
  company: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string;
  location: string;
  locationType: LocationType;
  talentId: number;
}

interface ExperienceProps {
  experiences?: ExperienceDetail[];
}

const Experience: React.FC<ExperienceProps> = ({ experiences = [] }) => {
  const [experienceList, setExperienceList] = useState<ExperienceDetail[]>(experiences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceDetail | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [experienceFormData, setExperienceFormData] = useState<ExperienceDetail>({
    id: 0,
    title: '',
    company: '',
    employmentType: 'FULL_TIME',
    startDate: '',
    endDate: '',
    location: '',
    locationType: 'ON_SITE',
    talentId: 0,
  });

  // Handle perubahan input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExperienceFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle klik tombol edit
  const handleEdit = (exp: ExperienceDetail) => {
    setEditingExperience(exp);
    setExperienceFormData(exp); // Set data yang sedang diedit ke form
    setIsModalOpen(true);
  };

  // Handle klik tombol tambah
  const handleAdd = () => {
    setEditingExperience(null);
    setExperienceFormData({
      id: experienceList.length + 1, // ID unik
      title: '',
      company: '',
      employmentType: 'FULL_TIME',
      startDate: '',
      endDate: '',
      location: '',
      locationType: 'ON_SITE',
      talentId: 0,
    });
    setIsModalOpen(true);
  };

  // Handle submit form (Tambah/Edit)
  const handleSubmit = () => {
    if (editingExperience) {
      // Mode Edit: Update data dalam array
      setExperienceList((prev) =>
        prev.map((exp) =>
          exp.id === editingExperience.id ? { ...experienceFormData } : exp
        )
      );
    } else {
      // Mode Tambah: Tambahkan data baru ke array
      setExperienceList((prev) => [...prev, experienceFormData]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="min-h-[200px] w-full rounded-lg border border-rencanakan-base-gray p-6">
      {/* Header dengan tombol Add dan Edit */}
      <div className="flex justify-between items-center">
        <Typography variant="p1">Pengalaman</Typography>
        <div className="flex space-x-2">
          {/* Tombol Edit */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="p-2 rounded-full bg-rencanakan-base-gray hover:bg-rencanakan-dark-gray hover:text-rencanakan-base-gray hover:scale-105 transition-transform cursor-pointer"
          >
            <Edit size={20} />
          </button>
          {/* Tombol Add */}
          <button
            onClick={handleAdd}
            className="p-2 rounded-full bg-rencanakan-sea-blue-300 text-white hover:bg-rencanakan-sea-blue-500 hover:scale-105 transition-transform cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {experienceList.length > 0 ? (
        <div className="w-full space-y-2 divide-y divide-gray-300">
          {experienceList.map((exp) => (
            <div key={exp.id} className="min-h-[112px] space-y-1 flex justify-between items-center">
              <div className='flex gap-4 items-start'>
                <img src='https://i.pinimg.com/736x/11/48/4f/11484f06170418c48b0b183b8868b64f.jpg' width={32} height={32} alt='No image' className='items-start justify-start' />
                <div>
                  <Typography variant="h6">{exp.title}</Typography>
                  <Typography variant="p4">{exp.company} • {exp.employmentType}</Typography>
                  <Typography variant="p4" className="text-rencanakan-dark-gray">
                    {exp.startDate} - {exp.endDate}
                  </Typography>
                  <Typography variant="p4" className="text-rencanakan-dark-gray">
                    {exp.location} • {exp.locationType}
                  </Typography>
                </div>
              </div>
              {/* Tampilkan ikon Pensil jika isEditMode true */}
              {isEditMode && (
                <button
                  onClick={() => handleEdit(exp)}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Typography variant="p3" className="text-rencanakan-dark-gray">
          Tidak ada pengalaman.
        </Typography>
      )}

      {/* Modal untuk Add / Edit */}
      {isModalOpen && (
        <Modal
          size='large' 
          title={editingExperience ? 'Edit Pengalaman' : 'Tambah Pengalaman'} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
        >
            <div className="flex flex-col space-y-4">
              <Input label="Judul*" name="title" value={experienceFormData.title} onChange={handleChange} placeholder="Judul" />
              <Input label="Perusahaan*" name="company" value={experienceFormData.company} onChange={handleChange} placeholder="Perusahaan" />
    
              <Combobox
                data={[
                  { value: 'FULL_TIME', label: 'Full Time' },
                  { value: 'PART_TIME', label: 'Part Time' },
                  { value: 'SELF_EMPLOYED', label: 'Self Employed' },
                  { value: 'FREELANCE', label: 'Freelance' },
                  { value: 'CONTRACT', label: 'Contract' },
                  { value: 'INTERNSHIP', label: 'Internship' },
                  { value: 'APPRENTICESHIP', label: 'Apprenticeship' },
                  { value: 'SEASONAL', label: 'Seasonal' },
                ]}
                value={experienceFormData.employmentType}
                onChange={(value) =>
                  setExperienceFormData((prev) => ({
                    ...prev,
                    employmentType: value as EmploymentType,
                  }))
                }
                label="Jenis Pekerjaan*"
                placeholder="Pilih Jenis Pekerjaan"
              />

              <Input label='Lokasi*' name='location' value={experienceFormData.location} onChange={handleChange} placeholder='Lokasi' />

              <Combobox
                data={[
                  { value: 'ON_SITE', label: 'On Site' },
                  { value: 'HYBRID', label: 'Hybrid' },
                ]}
                value={experienceFormData.locationType}
                onChange={(value) =>
                  setExperienceFormData((prev) => ({
                    ...prev,
                    locationType: value as LocationType,
                  }))
                }
                label="Tipe Lokasi*"
                placeholder="Pilih Tipe Lokasi"
              />

              {/* Input Tanggal Mulai dan Selesai */}
              <div className="flex space-x-2">
                <Input label="Tanggal Mulai*" name="startDate" value={experienceFormData.startDate} onChange={handleChange} placeholder="Tanggal Mulai" type='date' />
                <Input label="Tanggal Selesai" name="endDate" value={experienceFormData.endDate} onChange={handleChange} placeholder="Tanggal Selesai" type='date' />
              </div>

              <Button variant="primary" className='rounded-md font-[500]' onClick={handleSubmit}>
                <Typography variant="p2">{editingExperience ? 'Simpan' : 'Tambah'}</Typography>
              </Button>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default Experience;
