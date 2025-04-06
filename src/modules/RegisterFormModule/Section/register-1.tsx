import React, { ChangeEvent } from 'react';
import { Typography, Stepper, Input, FileInput, ImageUpload } from '@/components';
import { RegisterFormData } from '@/lib/register';

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
    ktpFile?: string;
    npwpFile?: string;
    diplomaFile?: string;
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
      <Typography variant="h5" className="text-rencanakan-type-black mb-4">
        Lengkapi formulir dan mulai perjalanan karier kamu!
      </Typography>

      <Stepper currentStep={0} />

      <div className="mt-8 space-y-6">
        <section>
          <Typography variant="h6" className="text-rencanakan-type-black my-2">
            Masukkan Data Diri
          </Typography>

          <div className="mt-4 mb-6 space-y-1">
            <ImageUpload
              label="Foto Diri"
              maxSize={5 * 1024 * 1024}
              initialImage={formData.profilePhoto}
              onImageChange={(file) => updateFormData({ profilePhoto: file })}
            />
          </div>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                name="firstName"
                label="Nama Depan *"
                placeholder="Nama Depan"
                error={validationErrors.firstName}
                value={formData.firstName || ''}
                onChange={handleInputChange}
              />
              <Input
                name="lastName"
                label="Nama Belakang *"
                placeholder="Nama Belakang"
                error={validationErrors.lastName}
                value={formData.lastName || ''}
                onChange={handleInputChange}
              />
            </div>

            <Input
              name="email"
              label="Email *"
              placeholder="Masukkan email Anda"
              error={validationErrors.email}
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange}
            />

            <Input
              name="phoneNumber"
              label="Nomor Telepon *"
              placeholder="Masukkan nomor WhatsApp Anda"
              error={validationErrors.phoneNumber}
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
            />

            <Input
              name="nik"
              label="No. NIK *"
              placeholder="Masukkan NIK Anda"
              error={validationErrors.nik}
              value={formData.nik || ''}
              onChange={handleInputChange}
            />

            <Input
              name="npwp"
              label="No. NPWP *"
              error={validationErrors.npwp}
              placeholder="Masukkan NPWP Anda"
              value={formData.npwp || ''}
              onChange={handleInputChange}
            />
          </div>
        </section>

        <section>
          <Typography variant="h6" className="mb-4">
            Upload Dokumen
          </Typography>

          <div className="space-y-4">
            <FileInput
              data-slot="input"
              textLabel="Foto KTP"
              compTestId='ktp-file-input'
              accept=".pdf,.jpg,.jpeg,.png"
              state={formData.ktpFile ? 'filled' : 'empty'}
              value={formData.ktpFile?.name || ''}
              onFileSelect={(file) => updateFormData({ ktpFile: file })}
              error={validationErrors?.ktpFile}
            />
            <FileInput
              data-slot="input"
              textLabel="Foto NPWP"
              compTestId='npwp-file-input'
              accept=".pdf,.jpg,.jpeg,.png"
              state={formData.npwpFile ? 'filled' : 'empty'}
              value={formData.npwpFile?.name || ''}
              onFileSelect={(file) => updateFormData({ npwpFile: file })}
              error={validationErrors?.npwpFile}
            />
            <FileInput
              data-slot="input"
              textLabel="Scan Ijazah"
              compTestId='diploma-file-input'
              accept=".pdf,.jpg,.jpeg,.png"
              state={formData.diplomaFile ? 'filled' : 'empty'}
              value={formData.diplomaFile?.name || ''}
              onFileSelect={(file) => updateFormData({ diplomaFile: file })}
              error={validationErrors?.diplomaFile}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
