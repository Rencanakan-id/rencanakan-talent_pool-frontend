import React, { ChangeEvent } from "react";
import { Typography, Stepper, Input, FileInput } from "@/components";
import { RegisterFormData } from "@/lib/register";

interface StepOneFormProps {
  formData: RegisterFormData;
  updateFormData: (data: Partial<RegisterFormData>) => void;
}

export const StepOneForm: React.FC<StepOneFormProps> = ({ formData, updateFormData }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleFileChange = (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files && files.length > 0 ? files[0] : null;
    updateFormData({ [field]: file });
  };

  return (
    <div className="px-4">
      <Typography variant="h5" className="text-center mb-4">
        Lengkapi formulir dan mulai perjalanan karier kamu!
      </Typography>
      
      <Stepper currentStep={0} />


      <div className="space-y-6">
        <section>
          <Typography variant="h6" className="my-2">Masukkan Data Diri</Typography>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                name="firstName"
                label="Nama Depan"
                placeholder="Nama Depan"
                value={formData.firstName || ''}
                onChange={handleInputChange}
              />
              <Input
                name="lastName"
                label="Nama Belakang"
                placeholder="Nama Belakang"
                value={formData.lastName || ''}
                onChange={handleInputChange}
              />
            </div>

            <Input
              name="email"
              label="Email"
              placeholder="Masukkan email Anda"
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange}
            />

            <Input
              name="phoneNumber"
              label="Nomor Telepon"
              placeholder="Masukkan nomor WhatsApp Anda"
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
            />

            <Input
              name="nik"
              label="No. NIK"
              placeholder="Masukkan NIK Anda"
              value={formData.nik || ''}
              onChange={handleInputChange}
            />

            <Input
              name="npwp"
              label="No. NPWP"
              placeholder="Masukkan NPWP Anda"
              value={formData.npwp || ''}
              onChange={handleInputChange}
            />
          </div>
        </section>

        <section>
          <Typography variant="h6" className="mb-4">Upload Dokumen</Typography>

          <div className="space-y-4">
            <FileInput 
              data-slot="input" 
              textLabel="Foto KTP" 
              accept=".pdf,.jpg,.jpeg,.png"
              state={formData.ktpFile ? 'filled' : 'empty'}
              value={formData.ktpFile?.name || ''}
              onFileSelect={(file) => updateFormData({ ktpFile: file })}
            />
            <FileInput 
              data-slot="input" 
              textLabel="Foto NPWP" 
              accept=".pdf,.jpg,.jpeg,.png"
              state={formData.npwpFile ? 'filled' : 'empty'}
              value={formData.npwpFile?.name || ''}
              onFileSelect={(file) => updateFormData({ npwpFile: file })}
            />
            <FileInput 
              data-slot="input" 
              textLabel="Scan Ijazah" 
              accept=".pdf,.jpg,.jpeg,.png"
              state={formData.diplomaFile ? 'filled' : 'empty'}
              value={formData.diplomaFile?.name || ''}
              onFileSelect={(file) => updateFormData({ diplomaFile: file })}
            />
          </div>
        </section>
      </div>
    </div>
  );
};