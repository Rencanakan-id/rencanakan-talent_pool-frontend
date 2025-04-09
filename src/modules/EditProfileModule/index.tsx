import { useEffect, useState } from 'react';
import { Button, ImageUpload } from '@/components';
import { ArrowLeft } from 'lucide-react';
import { UserProfile } from '@/components/ui/profile';
import { PersonalInfoSection } from './Section/personalInfo';
import { JobInfoSection } from './Section/jobInfo';
import axios from 'axios';
import { useUserProfile } from '@/components/hooks/useUserProfile';
import { useAuth } from "@/components/context/authContext";
import { useNavigate } from 'react-router-dom';

export const EditProfileModule: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, isLoading: isUserLoading } = useUserProfile();
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [initialData, setInitialData] = useState<UserProfile | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
      setInitialData(userProfile);
    }
  }, [userProfile]);

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
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updated };
    });
  };

  const handleSave = async () => {
    if (!formData) return;

    try {

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
        price: formData.price,
      };

      const response = await axios.put(
        `http://88.222.245.148:8080/api/users/${formData.id}`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.data) {
        setInitialData(response.data.data);
        setFormData(response.data.data);
        navigate('/preview');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleBack = () => {
    navigate('/preview')
  }

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
  };

  if (isUserLoading || !formData || !initialData) {
    return (
      <div className="absolute inset-0 flex h-full w-full items-center justify-center">
        <div
          data-testid="loading-spinner"
          className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
        ></div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center">
      <div className="m-6 w-full max-w-6xl bg-white p-6 rounded-lg shadow">
        <div className="flex w-full justify-between pb-4">
          <Button variant="primary-outline" className="flex py-2" onClick={handleBack}>
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
