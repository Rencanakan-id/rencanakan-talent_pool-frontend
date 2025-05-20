import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Certificate from '@/components/ui/certificate';
import { CertificationResponseDTO } from '@/lib/certificate';
import { CertificationService } from '@/services/CertificationService';

interface FileInputProps {
    textLabel: string;
    accept?: string;
    state?: string;
    value?: string | null;
    onFileSelect: (file: File) => void;
    error?: string;
  }

jest.mock('@/services/CertificationService', () => ({
  CertificationService: {
    getCertifications: jest.fn(),
    addCertification: jest.fn(),
    editCertification: jest.fn(),
    deleteCertification: jest.fn(),
  }
}));

const mockOpen = jest.fn();
window.open = mockOpen;

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

const mockCertificatesResponse: CertificationResponseDTO[] = [
  {
    id: 1,
    title: 'Software Engineer',
    file: 'software-engineer.pdf',
    talentId: '123',
  },
  {
    id: 2,
    title: 'UI/UX Design',
    file: 'empty-cert.pdf',
    talentId: '123',
  }
];

describe('Certificate Section Positive Case', () => {
    test('should render the certificate list correctly', () => {
      render(<Certificate certificates={mockCertificatesResponse} />);
      
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
      const fileInput = screen.getByLabelText('File*');
      fireEvent.change(fileInput, { target: { files: [file] } });
      
      fireEvent.click(screen.getByTestId('submit-button'));
      
      waitFor(() => expect(screen.getByText('sertifikasi.pdf')).toBeInTheDocument(), { timeout: 5000 });
    });
  
    test('should open edit certificate modal and update data', () => {
      render(<Certificate certificates={mockCertificatesResponse} />);
      
      fireEvent.click(screen.getByTestId("edit-certificate-button"));
      fireEvent.click(screen.getByTestId("edit-button-1"));
      
      const file = new File(['dummy content'], 'sertifikasi.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText('File Baru (opsional)');
      fireEvent.change(fileInput, { target: { files: [file] } });
      fireEvent.click(screen.getByText('Simpan'));
      
      waitFor(() => expect(screen.getByText('sertifikasi.pdf')).toBeInTheDocument(), { timeout: 5000 });
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

      const fileInput = screen.getByLabelText('File*');
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
        render(<Certificate certificates={mockCertificatesResponse} />);
        
        fireEvent.click(screen.getByTestId("edit-certificate-button"));

        expect(screen.getByText('software-engineer.pdf')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('edit-button-1'));

        fireEvent.click(screen.getByText('Simpan'));

        waitFor(() => expect(screen.getByText('software-engineer.pdf')).toBeInTheDocument(), { timeout: 5000 });
        
    });
});

describe('Certificate Delete Functionality', () => {
  test('should delete an certificate when delete button is clicked', () => {
    render(<Certificate certificates={[mockCertificatesResponse[0]]} />);
    
    fireEvent.click(screen.getByTestId("edit-certificate-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    
    const deleteButton = screen.getByTestId("delete-button");
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(deleteButton);
    
    waitFor(() => expect(screen.getByText('software-engineer.pdf')).not.toBeInTheDocument(), { timeout: 5000 });
    waitFor(() => expect(screen.getByText('Tidak ada sertifikasi')).toBeInTheDocument(), { timeout: 5000 });
  });
  
  test('should delete only the selected certificate when multiple exist', () => {
  
    render(<Certificate certificates={mockCertificatesResponse} />);
    
    expect(screen.getByText('software-engineer.pdf')).toBeInTheDocument();
    expect(screen.getByText('empty-cert.pdf')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("edit-certificate-button"));
    
    fireEvent.click(screen.getByTestId("edit-button-1"));
    fireEvent.click(screen.getByTestId("delete-button"));
    
    waitFor(() => expect(screen.getByText('software-engineer.pdf')).not.toBeInTheDocument(), { timeout: 5000 });
    waitFor(() => expect(screen.getByText('empty-cert.pdf')).toBeInTheDocument(), { timeout: 5000 });
  });
  
  test('should not show delete button in add certificate mode', () => {
    render(<Certificate certificates={mockCertificatesResponse} />);
    
    fireEvent.click(screen.getByTestId("add-certificate-button"));
    
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByText('Tambah')).toBeInTheDocument();

    expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument();
  });
  
  test('should close the modal after deleting an certificate', () => {
    render(<Certificate certificates={mockCertificatesResponse} />);
    
    fireEvent.click(screen.getByTestId("edit-certificate-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    expect(screen.getByText('Edit Sertifikasi')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("delete-button"));
    waitFor(() => expect(screen.getByText('Edit Sertifikasi')).toBeInTheDocument(), { timeout: 5000 });
  });

  test('should show "no certificate" message after deleting the last certificate', () => {
    render(<Certificate certificates={[mockCertificatesResponse[0]]} />);
    
    fireEvent.click(screen.getByTestId("edit-certificate-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    fireEvent.click(screen.getByTestId("delete-button"));
    
    waitFor(() => expect(screen.getByText('Tidak ada sertifikasi.')).toBeInTheDocument(), { timeout: 5000 });
  }); 
  
  test('should keep edit mode active after deleting an certificate', () => { 
    render(<Certificate certificates={mockCertificatesResponse} />);
    
    fireEvent.click(screen.getByTestId("edit-certificate-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    fireEvent.click(screen.getByTestId("delete-button"));
    
    waitFor(() => expect(screen.getByTestId('edit-button-2')).toBeInTheDocument(), { timeout: 5000 });
  });


});

describe('Certificate Download Functionality', () => {
    beforeEach(() => {
      jest.clearAllMocks();
  });

  // Testing lines 159-160 - Download function
  test('should call window.open when download button is clicked', () => {
    render(<Certificate certificates={mockCertificatesResponse} />);
    
    // Find and click download button for the first certificate
    const downloadButton = screen.getByTestId('download-btn-1');
    fireEvent.click(downloadButton);
    
    // Check if window.open was called with correct parameters
    expect(mockOpen).toHaveBeenCalledWith('public/Catetan Kripto.pdf', '_blank');
  });

  // Testing line 248 - Download button conditional rendering
  test('should disable download button when file is not available', () => {
    const certificatesWithEmptyFile = [
      {
        id: 3,
        title: 'Empty Certificate',
        file: '',
        talentId: '123',
      }
    ];
    
    render(<Certificate certificates={certificatesWithEmptyFile} />);
    
    // Check if download button is disabled
    const downloadButton = screen.getByTestId('download-btn-3');
    expect(downloadButton).toBeDisabled();
  });
});

describe('Certificate Form Validation', () => {
  test('should validate form correctly', () => {
    render(<Certificate certificates={[]} />);
    
    // Open add modal
    fireEvent.click(screen.getByTestId('add-certificate-button'));
    
    // Submit empty form to trigger validation
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check validation errors
    expect(screen.getByText('Judul sertifikasi wajib diisi')).toBeInTheDocument();
    expect(screen.getByText('File sertifikasi wajib diunggah')).toBeInTheDocument();
    
    // Add title only
    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul sertifikasi Anda/i), { 
      target: { name: 'title', value: 'Frontend Developer' } 
    });
    
    // Submit again
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Title error should be gone, but file error should remain
    expect(screen.queryByText('Judul sertifikasi wajib diisi')).not.toBeInTheDocument();
    expect(screen.getByText('File sertifikasi wajib diunggah')).toBeInTheDocument();
    
    // Add file
    const file = new File(['dummy content'], 'sertifikasi.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText('File*');
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Should not show errors now that all fields are filled
    expect(screen.queryByText('File sertifikasi wajib diunggah')).not.toBeInTheDocument();
  });

  test('should not require file when editing a certificate', () => {
    render(<Certificate certificates={mockCertificatesResponse} />);
    
    // Enable edit mode
    fireEvent.click(screen.getByTestId('edit-certificate-button'));
    
    // Open edit modal
    fireEvent.click(screen.getByTestId('edit-button-1'));
    
    // Change title to empty
    fireEvent.change(screen.getByTestId('input-title'), { 
      target: { name: 'title', value: '' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Should only show title error, not file error
    expect(screen.getByText('Judul sertifikasi wajib diisi')).toBeInTheDocument();
    expect(screen.queryByText('File sertifikasi wajib diunggah')).not.toBeInTheDocument();
  });
});

describe('Certificate Service Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Testing lines 183-185 - Error handling in submit function
  test('should handle errors when adding a certificate fails', async () => {
    (CertificationService.addCertification as jest.Mock).mockRejectedValueOnce(new Error('Failed to save certificate'));
    
    render(<Certificate certificates={[]} />);
    
    // Open add modal
    fireEvent.click(screen.getByTestId('add-certificate-button'));
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul sertifikasi Anda/i), { 
      target: { name: 'title', value: 'Frontend Developer' } 
    });
    
    const file = new File(['dummy content'], 'sertifikasi.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText('File*');
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check error message
    await waitFor(() => {
      expect(screen.getByText('Failed to save certificate')).toBeInTheDocument();
    });
  });

  test('should handle errors when editing a certificate fails', async () => {
    (CertificationService.editCertification as jest.Mock).mockRejectedValueOnce(new Error('Failed to update certificate'));
    
    render(<Certificate certificates={mockCertificatesResponse} />);
    
    // Enable edit mode
    fireEvent.click(screen.getByTestId('edit-certificate-button'));
    
    // Open edit modal
    fireEvent.click(screen.getByTestId('edit-button-1'));
    
    // Submit form without changes
    fireEvent.click(screen.getByText('Simpan'));
    
    // Check error message
    await waitFor(() => {
      expect(screen.getByText('Failed to update certificate')).toBeInTheDocument();
    });
  });

  test('should handle errors when deleting a certificate fails', async () => {
    (CertificationService.deleteCertification as jest.Mock).mockRejectedValueOnce(new Error('Failed to delete certificate'));
    
    render(<Certificate certificates={mockCertificatesResponse} />);
    
    // Enable edit mode
    fireEvent.click(screen.getByTestId('edit-certificate-button'));
    
    // Open edit modal
    fireEvent.click(screen.getByTestId('edit-button-1'));
    
    // Click delete
    fireEvent.click(screen.getByTestId('delete-button'));
    
    // Check error message
    await waitFor(() => {
      expect(screen.getByText('Failed to delete certificate')).toBeInTheDocument();
    });
  });
});

