import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Certificate, { CertificateDetail } from '@/components/ui/certificate';

interface FileInputProps {
    textLabel: string;
    accept?: string;
    state?: string;
    value?: string | null;
    onFileSelect: (file: File) => void;
    error?: string;
  }

jest.mock('@/components/ui/fileInput', () => ({
  FileInput: ({ textLabel, accept, state, value, onFileSelect, error }: FileInputProps) => (
    <div>
      <label>{textLabel}</label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        aria-label={textLabel}
      />
      {state === 'filled' && <span>{value}</span>}
      {error && <div className="error-message">{error}</div>}
    </div>
  ),
}));

const mockCertificates: CertificateDetail[] = [
  {
    id: 1,
    title: 'Software Engineer',
    file: new File(['dummy content'], 'software-engineer.pdf', { type: 'application/pdf' }),
    publishDate: '2023-01-01',
  },
  {
    id: 2,
    title: 'UI/UX Design',
    file: new File([], 'empty-cert.pdf', { type: 'application/pdf' }),
    publishDate: '2023-01-01',
  }
];

describe('Certificate Section Positive Case', () => {
    test('should render the certificate list correctly', () => {
      render(<Certificate certificates={mockCertificates} />);
      
      expect(screen.getByText('software-engineer.pdf')).toBeInTheDocument();
      expect(screen.getByText('empty-cert.pdf')).toBeInTheDocument();
    });

    test('should open any modal and close it with X button', () => {
      render(<Certificate certificates={[]} />);
      
      fireEvent.click(screen.getByTestId("add-certificate-button"));
  
      expect(screen.getByText('Tambah Sertifikasi')).toBeInTheDocument();
  
      fireEvent.click(screen.getByTestId("close-modal-button"));
  
      expect(screen.queryByText('Tambah Sertifikasi')).not.toBeInTheDocument();
    });
  
    test('should open add certificate modal and submit valid data', () => {
      render(<Certificate certificates={[]} />);
      
      fireEvent.click(screen.getByTestId("add-certificate-button"));
  
      screen.debug();
      
      fireEvent.change(screen.getByPlaceholderText(/Masukkan judul sertifikasi Anda/i), { target: { value: 'Frontend Developer' } });
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
  
    test('should clear errors when inputs are changed after validation', async () => {
      render(<Certificate />);

      const addButton = screen.getByTestId('add-certificate-button');
      fireEvent.click(addButton);

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      expect(screen.getByText('Judul sertifikasi wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('File sertifikasi wajib diunggah')).toBeInTheDocument();

      const titleInput = screen.getByTestId('input-title');
      fireEvent.change(titleInput, { target: { name: 'title', value: 'New Certificate' } });

      const fileInput = screen.getByLabelText('Media');
      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      
      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.queryByText('Judul sertifikasi wajib diisi')).not.toBeInTheDocument();
      expect(screen.queryByText('File sertifikasi wajib diunggah')).not.toBeInTheDocument();
    });
  
  });
  
describe('Certificate Section Negative Case', () => {
    test('should render no certificate message', () => {
        render(<Certificate certificates={[]} />);
        
        expect(screen.getByText('Tidak ada sertifikasi.')).toBeInTheDocument();
    });

    test('should not submit when required fields are empty', () => {
        render(<Certificate certificates={[]} />);

        fireEvent.click(screen.getByTestId('add-certificate-button'));
        
        expect(screen.getByText('Tambah Sertifikasi')).toBeInTheDocument();
    });

    test('should show error message when required fields arent filled', () => {
        render(<Certificate certificates={[]} />);
        
        fireEvent.click(screen.getByTestId('add-certificate-button'));
        
        fireEvent.click(screen.getByTestId('submit-button'));
        
        expect(screen.getByText('Judul sertifikasi wajib diisi')).toBeInTheDocument();
        expect(screen.getByText('File sertifikasi wajib diunggah')).toBeInTheDocument();
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

describe('Certificate Delete Functionality', () => {
  test('should delete an certificate when delete button is clicked', () => {
    render(<Certificate certificates={[mockCertificates[0]]} />);
    
    fireEvent.click(screen.getByTestId("edit-certificate-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    
    const deleteButton = screen.getByTestId("delete-button");
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(deleteButton);
    
    expect(screen.queryByText('software-engineer.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('Tidak ada sertifikasi.')).toBeInTheDocument();
  });
  
  test('should delete only the selected certificate when multiple exist', () => {
  
    render(<Certificate certificates={mockCertificates} />);
    
    expect(screen.getByText('software-engineer.pdf')).toBeInTheDocument();
    expect(screen.getByText('empty-cert.pdf')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("edit-certificate-button"));
    
    fireEvent.click(screen.getByTestId("edit-button-1"));
    fireEvent.click(screen.getByTestId("delete-button"));
    
    expect(screen.queryByText('software-engineer.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('empty-cert.pdf')).toBeInTheDocument();
  });
  
  test('should not show delete button in add certificate mode', () => {
    render(<Certificate certificates={mockCertificates} />);
    
    fireEvent.click(screen.getByTestId("add-certificate-button"));
    
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByText('Tambah')).toBeInTheDocument();

    expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument();
  });
  
  test('should close the modal after deleting an certificate', () => {
    render(<Certificate certificates={mockCertificates} />);
    
    fireEvent.click(screen.getByTestId("edit-certificate-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    expect(screen.getByText('Edit Sertifikasi')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("delete-button"));
    expect(screen.queryByText('Edit Sertifikasi')).not.toBeInTheDocument();
  });

  test('should show "no certificate" message after deleting the last certificate', () => {
    render(<Certificate certificates={[mockCertificates[0]]} />);
    
    fireEvent.click(screen.getByTestId("edit-certificate-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    fireEvent.click(screen.getByTestId("delete-button"));
    
    expect(screen.getByText('Tidak ada sertifikasi.')).toBeInTheDocument();
  }); 
  
  test('should keep edit mode active after deleting an certificate', () => { 
    render(<Certificate certificates={mockCertificates} />);
    
    fireEvent.click(screen.getByTestId("edit-certificate-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    fireEvent.click(screen.getByTestId("delete-button"));
    
    expect(screen.getByTestId("edit-button-2")).toBeInTheDocument();
  });
});