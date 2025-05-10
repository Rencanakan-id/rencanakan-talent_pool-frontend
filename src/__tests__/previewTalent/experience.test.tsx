import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Experience from '../../components/ui/experience';
import { ExperienceResponseDTO } from '@/lib/experience';

describe('Experience Component', () => {
  const mockExperiences: ExperienceResponseDTO[] = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Corp',
      companyImage: 'https://example.com/image.jpg',
      employmentType: 'FULL_TIME',
      startDate: '2020-06-01',
      endDate: '2023-08-31',
      location: 'Jakarta, Indonesia',
      locationType: 'ON_SITE',
    },
  ];

  test('renders the component with experience data', () => {
    render(<Experience experiences={mockExperiences} />);

    expect(screen.getByText('Pengalaman')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp • Penuh Waktu')).toBeInTheDocument();
    expect(screen.getByText('Jakarta, Indonesia • Di Lokasi')).toBeInTheDocument();
  });

  test('renders message when there is no data', () => {
    render(<Experience experiences={[]} />);

    expect(screen.getByText('Tidak ada pengalaman.')).toBeInTheDocument();
  });
});
