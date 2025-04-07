import { Button } from '@/components';
import Certificate, { CertificateDetail } from '@/components/ui/certificate';
import Experience, { ExperienceDetail } from '@/components/ui/experience';
import Location from '@/components/ui/location';
import UserProfileCard, { UserProfile } from '@/components/ui/profile';
import RecommendationCard, { RecommendationResponseDTO, StatusType } from '@/components/ui/recommendation';
import { ArrowLeft, BookmarkIcon } from 'lucide-react';
import { useState } from 'react';

export const TalentInformation: React.FC = () => {
  const userProfile: UserProfile = {
    id: "user123",
    firstName: "Rudy",
    lastName: "Handoko",
    email: "dummy@example.com",
    phoneNumber: "+628123456789",
    address: "Jakarta Kota, DKI Jakarta",
    job: "Ahli Bangunan Gedung",
    photo: "image-3.png",
    aboutMe: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat.",
    price: 7550000,
    nik: "1234567890123456",
    npwp: "123456789012345",
    photoKtp: "image-3.png",
    photoNpwp: "image-3.png",
    photoIjazah: "image-3.png",
    experienceYears: 2,
    skkLevel: "Intermediate",
    currentLocation: "Surabaya, Jawa Timur",
    preferredLocations: ["Jakarta", "Bandung", "Surabaya"],
    skill: "React, Node.js, TypeScript",
  }

  const experience: ExperienceDetail[] = [
      {
        id: 1,
        title: 'Frontend Developer',
        employmentType: 'FULL_TIME',
        locationType: 'HYBRID',
        talentId: 1,
        company: 'Google',
        location: 'Mountain View, CA',
        startDate: '2019-01-01',
        endDate: '2021-01-01',
      },
      {
        id: 2,
        title: 'Backend Developer',
        employmentType: 'FULL_TIME',
        locationType: 'HYBRID',
        talentId: 1,
        company: 'Facebook',
        location: 'Menlo Park, CA',
        startDate: '2017-01-01',
        endDate: '2019-01-01',
      },
      {
        id: 3,
        title: 'Fullstack Developer',
        employmentType: 'FULL_TIME',
        locationType: 'HYBRID',
        talentId: 1,
        company: 'Amazon',
        location: 'Seattle, WA',
        startDate: '2015-01-01',
        endDate: '2017-01-01',
      },
    ];

  const certificate: CertificateDetail[] = [
      {
        id: 1,
        title: 'Sertifikasi 1',
        file: new File(['12345'], "Sertifikasi 1.pdf", { type: "application/pdf" })
      },
      {
        id: 2,
        title: 'Sertifikasi 2',
        file: new File(['1234'], "Sertifikasi 2.pdf", { type: "application/pdf" })
      },
      {
        id: 3,
        title: 'Sertifikasi 3',
        file: new File(["dummy content"], "Sertifikasi 3.pdf", { type: "application/pdf" })
      },
    ];

  const initialRecommendations: RecommendationResponseDTO[] = [
    {
      id: '1',
      talentId: '101',
      contractorId: 202,
      contractorName: 'John Doe',
      message: 'Pekerjaan sangat memuaskan, hasilnya sesuai harapan.',
      status: StatusType.PENDING,
    },
    {
      id: '2',
      talentId: '102',
      contractorId: 203,
      contractorName: 'Jane Smith',
      message: 'Pekerjaan luar biasa, sangat detail dan komunikatif.',
      status: StatusType.PENDING,
    },
  ];

  const [recommendationsList, setRecommendationsList] = useState<RecommendationResponseDTO[]>(initialRecommendations);
  
  const handleAcceptRecommendation = (id: string) => {
    setRecommendationsList(prevRecommendations =>
      prevRecommendations.map(rec =>
        rec.id === id ? { ...rec, status: StatusType.APPROVED } : rec
      )
    );
  };

  const handleDeclineRecommendation = (id: string) => {
    setRecommendationsList(prevRecommendations =>
      prevRecommendations.filter(rec => rec.id !== id)
    );
  };
      
  return !experience ? (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center">
      <div
        data-testid="loading-spinner"
        className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
      ></div>
    </div>
  ) : (
    <div className="flex w-full justify-center">
      <div className="m-6 w-full max-w-6xl justify-center bg-white">
        <div className="flex w-full justify-between p-4">
          <Button variant="primary-outline" className="flex py-2">
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </Button>
          <Button variant="primary" className="flex py-2">
            <BookmarkIcon className="h-6 w-6 text-white" />
            <span>Masukkan ke Favorit</span>
          </Button>
        </div>

        <div className="flex w-full flex-col items-center space-y-2 p-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
          <img src="/dummy/profile.svg" alt="Logo" className="h-[330px] w-[298px]" />
          <div className="w-full flex-col items-center space-y-4">
            <UserProfileCard user={userProfile} />
            <Experience experiences={experience} />
            <Location data={userProfile.preferredLocations} />
            <Certificate certificates={certificate} />
            <RecommendationCard 
              recommendations={recommendationsList} 
              onAccept={handleAcceptRecommendation}
              onDecline={handleDeclineRecommendation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
