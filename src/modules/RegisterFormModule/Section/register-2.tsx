import { Typography, Stepper, Input, FileInput, Textarea } from '@/components';
import { Combobox } from '@/components/ui/combobox';
import { yearsOfExperience } from '@/data/yearsOfExperience';
import { skkLevels } from '@/data/skkLevels';
import { locations } from '@/data/location';
import { skills } from '@/data/skills';
import { RegisterFormData } from '@/lib/register';
import { ComboboxCheckBox } from '@/components/ui/comboboxCheckbox';

interface StepTwoFormProps {
  formData: RegisterFormData;
  updateFormData: (data: Partial<RegisterFormData>) => void;
  validationErrors?: {
    aboutMe?: string;
    yearsOfExperience?: string;
    skkLevel?: string;
    currentLocation?: string;
    preferredLocations?: string;
    skill?: string;
    otherSkill?: string;
    skkFile?: File;
  };
}

export const StepTwoForm: React.FC<StepTwoFormProps> = ({ formData, updateFormData, validationErrors = {} }) => {
  return (
    <>
      <Typography variant="h5">Ceritakan sedikit pengalaman kerja kamu</Typography>

      <div className="mx-4 my-4 items-center justify-center">
        <Stepper currentStep={1} />
      </div>

      <Typography variant="h6" className="mt-6">
        Tentang Pekerjaan
      </Typography>

      <div className="mb-4 space-y-6">
        <Textarea
          textLabel="Tentang Saya"
          placeholder="Ceritakan tentang dirimu secara singkat di sini..."
          value={formData.aboutMe || ''}
          onChange={(e) => updateFormData({ aboutMe: e.target.value })}
        />

        <Combobox
          data={yearsOfExperience}
          label="Lama Pengalaman"
          value={formData.yearsOfExperience || ''}
          onChange={(value) => updateFormData({ yearsOfExperience: value })}
          error={validationErrors?.yearsOfExperience}
        />

        <Combobox
          data={skkLevels}
          label="Level Sertifikasi SKK"
          value={formData.skkLevel || ''}
          onChange={(value) => updateFormData({ skkLevel: value })}
          error={validationErrors?.skkLevel}
        />

        <Combobox
          data={locations}
          label="Lokasi Saat Ini"
          value={formData.currentLocation || ''}
          onChange={(value) => updateFormData({ currentLocation: value })}
          error={validationErrors?.currentLocation}
        />

        <div>
          <ComboboxCheckBox
            data={locations}
            label="Bersedia Ditempatkan Di Mana"
            placeholder="Search..."
            value={(formData.preferredLocations || []).map(value => 
              locations.find(item => item.value === value)?.label || value
            ).join(', ')}
            onChange={(values) => updateFormData({ preferredLocations: values })}
            maxSelection={5}
            error={validationErrors?.preferredLocations}
          />
          <Typography variant="p4" className="my-2">
            Pilih maksimal 5 lokasi
          </Typography>
        </div>

        <div>
          <Combobox
            data={skills}
            label="Keahlian"
            value={formData.skill || ''}
            onChange={(value) => updateFormData({ skill: value })}
            error={validationErrors?.skill}
          />
          {formData.skill === 'lainnya' && (
            <Input
              className="mt-2"
              placeholder="Tulis di sini keahlian kamu"
              value={formData.otherSkill || ''}
              onChange={(e) => updateFormData({ otherSkill: e.target.value })}
              error={validationErrors?.otherSkill}
            />
          )}
        </div>
      </div>

      <div className="mb-4">
        <Typography variant="h6">Dokumen Pendukung</Typography>

        <div className="mt-2 space-y-2">
          <FileInput
            data-slot="input"
            textLabel="SKK"
            accept=".pdf,.jpg,.jpeg,.png"
            state={formData.skkFile ? 'filled' : 'empty'}
            value={formData.skkFile?.name || ''}
            onFileSelect={(file) => updateFormData({ skkFile: file })}
          />
        </div>
      </div>
    </>
  );
};
