import React, { ChangeEvent, useEffect } from "react";
import { Typography, Stepper, Input, FileInput, ImageUpload } from "@/components";
import { RegisterFormData } from "@/lib/register";

interface StepOneFormProps {
  formData: RegisterFormData;
  updateFormData: (data: Partial<RegisterFormData>) => void;
  validationErrors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    nik?: string;
    npwp?: string;
  };
}

export const StepOneForm: React.FC<StepOneFormProps> = ({ 
  formData, 
  updateFormData,
  validationErrors = {},
  }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div>
      <Typography variant="h5" className="mb-4 text-rencanakan-type-black">
        Lengkapi formulir dan mulai perjalanan karier kamu!
      </Typography>
      
      <Stepper currentStep={0} />


      <div className="space-y-6 mt-8">
        <section>
          <Typography variant="h6" className="my-2 text-rencanakan-type-black">Masukkan Data Diri</Typography>

          <div className="space-y-1 mb-6 mt-4">
            <ImageUpload label="Foto Diri" maxSize={5} />
          </div>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                name="firstName"
                label="Nama Depan"
                placeholder="Nama Depan"
                error={validationErrors.firstName}
                value={formData.firstName || ''}
                onChange={handleInputChange}
              />
              <Input
                name="lastName"
                label="Nama Belakang"
                placeholder="Nama Belakang"
                error={validationErrors.lastName}
                value={formData.lastName || ''}
                onChange={handleInputChange}
              />
            </div>

            <Input
              name="email"
              label="Email"
              placeholder="Masukkan email Anda"
              error={validationErrors.email}
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange}
            />

            <Input
              name="phoneNumber"
              label="Nomor Telepon"
              placeholder="Masukkan nomor WhatsApp Anda"
              error={validationErrors.phoneNumber}
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
            />

            <Input
              name="nik"
              label="No. NIK"
              placeholder="Masukkan NIK Anda"
              error={validationErrors.nik}
              value={formData.nik || ''}
              onChange={handleInputChange}
            />

            <Input
              name="npwp"
              label="No. NPWP"
              error={validationErrors.npwp}
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