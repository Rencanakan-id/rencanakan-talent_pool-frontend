import { useState } from 'react';
import { Typography } from '../atoms/typography';
import { Modal } from './modal';
import { Pencil, Plus, Edit } from 'lucide-react';
import { Input } from './input';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceDetail | null>(null);
  const [isEditMode, setIsEditMode] = useState(false); // State untuk menampilkan ikon pensil

  const handleEdit = (exp: ExperienceDetail) => {
    setEditingExperience(exp);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-[200px] w-full rounded-[8px] border border-gray-300 px-6 py-6">
      {/* Header dengan tombol Add dan Edit */}
      <div className="flex justify-between items-center">
        <Typography variant="p1">Pengalaman</Typography>
        <div className="flex space-x-2">
          {/* Tombol Edit */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <Edit size={20} />
          </button>
          {/* Tombol Add */}
          <button
            onClick={handleAdd}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {experiences.length > 0 ? (
        <div className="w-full space-y-2 divide-y divide-gray-300 pl-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="min-h-[112px] space-y-1 flex justify-between items-center">
              <div>
                <Typography variant="h5">{exp.title}</Typography>
                <Typography variant="p3">{exp.company} • {exp.employmentType}</Typography>
                <Typography variant="p3" className="text-gray-500">
                  {exp.startDate} - {exp.endDate}
                </Typography>
                <Typography variant="p3" className="text-gray-500">
                  {exp.location} - {exp.locationType}
                </Typography>
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
        <Typography variant="p3" className="text-gray-500">
          Tidak ada pengalaman.
        </Typography>
      )}

      {/* Modal untuk Add / Edit */}
      {isModalOpen && (
        <Modal title={editingExperience ? 'Edit Pengalaman' : 'Tambah Pengalaman'} isOpen={true} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col space-y-4">
            <Input label="Judul" placeholder="Judul" />
            <Input label="Perusahaan" placeholder="Perusahaan" />
            <Input label="Jenis Pekerjaan" placeholder="Jenis Pekerjaan" />
            <div className="flex space-x-2">
              <Input label="Tanggal Mulai" placeholder="Tanggal Mulai" type='date' />
              <Input label="Tanggal Selesai" placeholder="Tanggal Selesai" type='date' />
            </div>

            <button className="bg-blue-500 text-white py-2 rounded-md">
              {editingExperience ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Experience;
