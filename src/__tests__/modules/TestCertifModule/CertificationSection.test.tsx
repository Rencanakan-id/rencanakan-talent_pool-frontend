import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Certificate, { CertificateDetail } from '@/components/ui/certificate';

describe('Certificate Component', () => {
  const mockCertificates: CertificateDetail[] = [
    {
      id: 1,
      title: 'Software Engineer',
      file: new File(['dummy content'], 'software-engineer.pdf', { type: 'application/pdf' }), 
    },
    {
      id: 2,
      title: 'UI/UX Design',
      // Edge case: 0 byte file
      file: new File([], 'empty-cert.pdf', { type: 'application/pdf' })
    }
  ];

  test('renders the component with experience data', () => {
    render(<Certificate certificates={mockCertificates} />);

    expect(screen.getByText('Sertifikasi')).toBeInTheDocument();
    expect(screen.getByText('software-engineer.pdf')).toBeInTheDocument();
    expect(screen.getByText('13Bytes')).toBeInTheDocument();
  });

  test('renders message when there is no data', () => {
    render(<Certificate certificates={[]} />);

    expect(screen.getByText('Tidak ada sertifikasi.')).toBeInTheDocument();
  });

  test('formats pdf with 0 bytes data', () => {
    render(<Certificate certificates={[mockCertificates[1]]} />);

    expect(screen.getByText('empty-cert.pdf')).toBeInTheDocument();
    expect(screen.getByText('0Bytes')).toBeInTheDocument();
  });

});
