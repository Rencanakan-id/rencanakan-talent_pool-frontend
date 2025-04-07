import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
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

    expect(screen.getByText('software-engineer.pdf')).toBeInTheDocument();
    expect(screen.getByText('13Bytes')).toBeInTheDocument();
  });

  test('renders message when there is no data', () => {
    render(<Certificate certificates={[]} />);

    expect(screen.getByText('Tidak ada sertifikasi.')).toBeInTheDocument();
  });

  test('render component with undefined certificates', () => {
    render(<Certificate />);

    expect(screen.getByText('Tidak ada sertifikasi.')).toBeInTheDocument();
  });

  test('formats pdf with 0 bytes data', () => {
    render(<Certificate certificates={[mockCertificates[1]]} />);

    expect(screen.getByText('empty-cert.pdf')).toBeInTheDocument();
    expect(screen.getByText('0Bytes')).toBeInTheDocument();
  });

  test('renders download buttons for each certificate', () => {
    render(<Certificate certificates={mockCertificates} />);
    
    const downloadButtons = screen.getAllByText('Download File');
    expect(downloadButtons).toHaveLength(2);
  });

  test('initiates download when button is clicked', () => {
    render(<Certificate certificates={mockCertificates} />);
    const mockCreateObjectURL = jest.fn().mockReturnValue('mock-url');
    URL.createObjectURL = mockCreateObjectURL;

    const mockAppendChild = jest.fn();
    const mockRemoveChild = jest.fn();
    document.body.appendChild = mockAppendChild;
    document.body.removeChild = mockRemoveChild;
    
    const mockClick = jest.fn();
    document.createElement = jest.fn().mockImplementation(() => ({
      href: '',
      download: '',
      click: mockClick
    }));
    
    URL.revokeObjectURL = jest.fn();
    
    
    const downloadButton = screen.getByTestId('download-btn-1');
    fireEvent.click(downloadButton);

    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockCertificates[0].file);
    expect(mockClick).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

});
