import { Button } from '@/components';
import Experience, { ExperienceDetail } from '@/components/ui/experience';
import { ArrowLeft, BookmarkIcon } from 'lucide-react';

export const TalentExperience: React.FC = () => {

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
          <img src="image-3.png" alt="Logo" className="h-[330px] w-[298px]" />
          <div className="w-full flex-col items-center space-y-4">
            <Experience experiences={experience} />
          </div>
        </div>
      </div>
    </div>
  );
};
