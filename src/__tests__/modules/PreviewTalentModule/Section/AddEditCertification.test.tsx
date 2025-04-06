import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Certificate, { CertificateDetail } from '@/components/ui/certificate';

const mockCertificates: CertificateDetail[] = [
  {
    id: 1,
    title: 'Software Engineer',
    file: new File(['dummy content'], 'software-engineer.pdf', { type: 'application/pdf' }), 
  },
  {
    id: 2,
    title: 'UI/UX Design',
    file: new File([], 'empty-cert.pdf', { type: 'application/pdf' })
  }
];

describe('Certificate Section Positive Case', () => {
    test('should render the certificate list correctly', () => {
      render(<Certificate certificates={mockCertificates} />);
      
      expect(screen.getByText('software-engineer.pdf')).toBeInTheDocument();
      expect(screen.getByText('empty-cert.pdf')).toBeInTheDocument();
    });
  
    test('should open add certificate modal and submit valid data', () => {
      render(<Certificate certificates={[]} />);
      
      fireEvent.click(screen.getByTestId("add-certificate-button"));
  
      screen.debug();
      
      fireEvent.change(screen.getByPlaceholderText(/Masukkan judul sertifikasi Anda/i), { target: { value: 'Frontend Developer' } });
      fireEvent.change(screen.getByTestId("input-published"), { target: { value: '2024-02-01' } });
      const file = new File(['dummy content'], 'sertifikasi.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText('Media');
      fireEvent.change(fileInput, { target: { files: [file] } });
      
      fireEvent.click(screen.getByTestId('submit-button'));
      
      expect(screen.getByText('sertifikasi.pdf')).toBeInTheDocument();
    });
  
    test('should open edit certificate modal and update data', () => {
      render(<Certificate certificates={mockCertificates} />);
      
      fireEvent.click(screen.getByTestId("edit-certificate-button"));
      fireEvent.click(screen.getByTestId("edit-button-1"));
      
      const file = new File(['dummy content'], 'sertifikasi.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText('Media');
      fireEvent.change(fileInput, { target: { files: [file] } });
      fireEvent.click(screen.getByText('Simpan'));
      
      expect(screen.getByText('sertifikasi.pdf')).toBeInTheDocument();
    });
  
  
  });
  
describe('Certificate Section Negative Case', () => {
    test('should render no certificate message', () => {
        render(<Certificate certificates={[]} />);
        
        expect(screen.getByText('Tidak ada pengalaman.')).toBeInTheDocument();
    });

    test('should not submit if published date is empty', () => {
        render(<Certificate certificates={[]} />);
        
        fireEvent.click(screen.getByTestId("add-certificate-button"));
        
        fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Backend Developer' } });
        fireEvent.change(screen.getByPlaceholderText(/Masukkan nama perusahaan tempat bekerja/i), { target: { value: 'AI Startup' } });
        
        fireEvent.click(screen.getByTestId('add-certificate-button'));
        
        expect(screen.getByText('Tambah Pengalaman')).toBeInTheDocument();
    });

    test('should not submit when required fields are empty', () => {
        render(<Certificate certificates={[]} />);

        fireEvent.click(screen.getByTestId('add-certificate-button'));
        
        expect(screen.getByText('Tambah Pengalaman')).toBeInTheDocument();
    });
});

describe('Certificate Section Edge Case', () => {

    test('should keep the same data if no changes are made', () => {
        render(<Certificate certificates={mockCertificates} />);
        
        fireEvent.click(screen.getByTestId("edit-certificate-button"));

        expect(screen.getByText('software-engineer.pdf')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('edit-button-1'));

        fireEvent.click(screen.getByText('Simpan'));

        expect(screen.getByText('software-engineer.pdf')).toBeInTheDocument();
        
    });
});
  