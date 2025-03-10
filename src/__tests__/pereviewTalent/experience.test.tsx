import { render, screen } from '@testing-library/react';
import Experience,{ ExperienceDetail } from '../../components/ui/experience';


<<<<<<< HEAD
// Mock Typography agar tidak perlu bergantung pada library lain
jest.mock('../../components/atoms/typography', () => ({
  Typography: ({
    variant,
    className,
    children,
  }: {
    variant: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <p data-testid={variant} className={className}>
      {children}
    </p>
  ),
}));
=======
>>>>>>> 9480b17af720245fb2b925c784eb44158a76d413

describe('Experience Component', () => {
  const mockExperiences: ExperienceDetail[] = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Corp',
      employmentType: 'FULL_TIME',
      startDate: '2020-06-01',
      endDate: '2023-08-31',
      location: 'Jakarta, Indonesia',
      locationType: 'ON_SITE',
      talentId: 101,
    },
  ];

  test('renders the component with experience data', () => {
    render(<Experience experiences={mockExperiences} />);

    expect(screen.getByText('Pengalaman')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp • FULL_TIME')).toBeInTheDocument();
    expect(screen.getByText('Jakarta, Indonesia - 2023-08-31')).toBeInTheDocument();
  });

  test('renders message when there is no data', () => {
<<<<<<< HEAD
    const mockSetState = jest.fn();

    jest.spyOn(React, 'useState').mockImplementationOnce(() => [[], mockSetState]);

    render(<Experience />);

    expect(screen.getByText('Tidak ada pengalaman.')).toBeInTheDocument();
  });
=======
    render(<Experience experiences={[]} />);

    expect(screen.getByText('Tidak ada pengalaman.')).toBeInTheDocument();
  });
  test('renders message when there is no data', () => {
    render(<Experience  />);

    expect(screen.getByText('Tidak ada pengalaman.')).toBeInTheDocument();
  });

>>>>>>> 9480b17af720245fb2b925c784eb44158a76d413
});



