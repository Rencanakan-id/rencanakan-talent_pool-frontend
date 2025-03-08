import React, { useState } from 'react';
import { Typography } from '../atoms/typography';

function Experience() {
  const dummyExperience = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Corp',
      employmentType: 'FULL_TIME',
      startDate: '2020-06-01',
      endDate: '2023-08-31',
      location: 'Jakarta, Indonesia',
      locationType: 'ONSITE',
      talentId: 101,
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'Startup XYZ',
      employmentType: 'CONTRACT',
      startDate: '2019-02-15',
      endDate: '2020-05-30',
      location: 'Remote',
      locationType: 'REMOTE',
      talentId: 102,
    },
    {
      id: 3,
      title: 'Backend Developer',
      company: 'Enterprise Solutions',
      employmentType: 'PART_TIME',
      startDate: '2018-09-01',
      endDate: '2019-12-15',
      location: 'Bandung, Indonesia',
      locationType: 'HYBRID',
      talentId: 103,
    },
  ];
  const [experiences] = useState(dummyExperience);

  return (
    <div className="min-h-[200px] w-auto max-w-[825px] min-w-[200px] rounded-[8px] border border-gray-500 px-6 py-6">
      <Typography variant="p1" className="pb-4">
        Pengalaman
      </Typography>

      {experiences.length > 0 ? (
        <div className="w-auto max-w-[825px] min-w-[200px] space-y-2 divide-y divide-gray-300 pl-6">
          {dummyExperience.map((exp) => (
            <div className="min-h-[112px] w-auto max-w-[825px] min-w-[200px] space-y-1">
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
        <p className="text-gray-500">Tidak ada pengalaman.</p>
      )}
    </div>
  );
}

export default Experience;
