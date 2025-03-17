import { Typography } from '../atoms/typography';
import React from 'react';

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
  return (
    <div className="min-h-[200px] w-full rounded-[8px] border border-gray-300 px-6 py-6">
      <Typography variant="p1" className="pb-4">
        Pengalaman
      </Typography>

      {experiences.length > 0 ? (
        <div className="w-full space-y-2 divide-y divide-gray-300 pl-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="min-h-[112px] space-y-1">
              <Typography variant="h5"> {exp.title} </Typography>
              <Typography variant="p3">
                {' '}
                {exp.company} • {exp.employmentType}{' '}
              </Typography>
              <Typography variant="p3" className="text-gray-500">
                {' '}
                {exp.startDate} - {exp.endDate}{' '}
              </Typography>
              <Typography variant="p3" className="text-gray-500">
                {' '}
                {exp.location} - {exp.endDate}{' '}
              </Typography>
            </div>
          ))}
        </div>
      ) : (
        <Typography variant="p3" className="text-gray-500">
          Tidak ada pengalaman.
        </Typography>
      )}
    </div>
  );
};

export default Experience;
