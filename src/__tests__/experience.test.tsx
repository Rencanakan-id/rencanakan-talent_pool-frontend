import React from 'react';
import { render, screen } from '@testing-library/react';
import Experience from '../components/ui/experience';

// Mock Typography agar tidak perlu bergantung pada library lain
jest.mock('../components/atoms/typography', () => ({
  Typography: ({ variant, className, children }: { variant: string, className?: string, children: React.ReactNode }) => (
    <p data-testid={variant} className={className}>{children}</p>
  ),
}));

describe('Experience Component', () => {
  test('renders the component with static data', () => {
    render(<Experience />);

    expect(screen.getByText('Pengalaman')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp • FULL_TIME')).toBeInTheDocument();
    expect(screen.getByText('Jakarta, Indonesia - 2023-08-31')).toBeInTheDocument();
  });

  test('renders message when there is no data', () => {
    const mockSetState = jest.fn();
    
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [[], mockSetState]); 
  
    render(<Experience />);
  
    expect(screen.getByText('Tidak ada pengalaman.')).toBeInTheDocument();
  });
  
});
