import { useEffect, useState } from 'react';
import { Button, ImageUpload } from '@/components';
import { ArrowLeft } from 'lucide-react';
import { UserProfile } from '@/components/ui/profile';
import { PersonalInfoSection } from './Section/personalInfo';
import { JobInfoSection } from './Section/jobInfo';
import axios from 'axios';

interface EditProfileModuleProps {
  userProfile: UserProfile;
}

export const EditProfileModule: React.FC<EditProfileModuleProps> = ({ userProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [initialData, setInitialData] = useState<UserProfile>(userProfile);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      const imageUrl = '/dummy/profile.png';
  
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'profile.png', { type: blob.type });
        setPhotoFile(file);
      } catch (error) {
        console.error('Failed to load hardcoded image:', error);
      }
    };
  
    loadImage();
  }, []);

  const handleChange = (updated: Partial<UserProfile>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  const handleSave = async () => {
    console.log(formData)
    try {
      const token = localStorage.getItem('authToken');

      const updatedProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        nik: formData.nik,
        npwp: formData.npwp,
        aboutMe: formData.aboutMe,
        experienceYears: formData.experienceYears,
        skkLevel: formData.skkLevel,
        currentLocation: formData.currentLocation,
        preferredLocations: formData.preferredLocations ?? [],
        skill: formData.skill,
        price: formData.price
      };
      
      const response = await axios.put(
        `/users/${formData.id}`, 
        updatedProfile,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.data) {
        setInitialData(response.data.data);
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
  };

  return (
    <div className="flex w-full justify-center">
      <div className="m-6 w-full max-w-6xl bg-white p-6 rounded-lg shadow">
        <div className="flex w-full justify-between pb-4">
          <Button variant="primary-outline" className="flex py-2">
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </Button>
          <Button variant="primary" className="py-2" onClick={handleSave}>
            Simpan Perubahan
          </Button>
        </div>

        <div className="mt-4 mb-6 space-y-1">
          <ImageUpload
            label="Foto Diri"
            maxSize={5 * 1024 * 1024}
            initialImage={photoFile}
            onImageChange={handlePhotoChange}
            className="max-w-[200px] w-full aspect-square"
          />
        </div>

        <PersonalInfoSection
          data={formData}
          initialData={initialData}
          onChange={handleChange}
        />

        <JobInfoSection
          data={formData}
          initialData={initialData}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};