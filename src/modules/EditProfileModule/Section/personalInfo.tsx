import { Button, Input, Typography } from '@/components';
import React from 'react';
import { UserProfile } from '@/components/ui/profile';

interface Props {
  data: UserProfile;
  initialData: UserProfile;
  onChange: (updated: Partial<UserProfile>) => void;
}

export const PersonalInfoSection: React.FC<Props> = ({ data, initialData, onChange }) => {
  const handleReset = () => {
    onChange({
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      phoneNumber: initialData.phoneNumber,
      nik: initialData.nik,
      npwp: initialData.npwp,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="w-full border border-gray-300 rounded-[4px] px-6 py-6">
      <Typography variant="p1" className="pb-4">
        Informasi Data Diri
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Nama Depan" name="firstName" value={data.firstName} onChange={handleChange} data-testId='first-name'/>
        <Input label="Nama Belakang" name="lastName" value={data.lastName} onChange={handleChange} data-testId='last-name'/>
        <Input label="No. Telepon" name="phoneNumber" value={data.phoneNumber} onChange={handleChange} data-testId='phone-number'/>
        <Input label="Email" name="email" value={data.email} onChange={handleChange} data-testId='email-input'/>
        <Input label="No. NIK" name="nik" value={data.nik} onChange={handleChange} data-testId='nik-input'/>
        <Input label="No. NPWP" name="npwp" value={data.npwp} onChange={handleChange} data-testId='npwp-input'/>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="primary-outline" onClick={handleReset}>
          Reset Perubahan
        </Button>
      </div>
    </div>
  );
};
