import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Experience from '@/components/ui/experience';
import { ExperienceResponseDTO } from '@/lib/experience';
import '@testing-library/jest-dom';
import { ExperienceService } from '@/services/ExperienceService';
import DOMPurify from 'dompurify';
import { setupComponentMocks } from '@/__mocks__/components/setUpComponents';
setupComponentMocks();

// Setup component mocks
jest.mock('@/services/ExperienceService', () => ({
  ExperienceService: {
    getExperiences: jest.fn(),
    addExperience: jest.fn(),
    editExperience: jest.fn(),
    deleteExperience: jest.fn(),
  }
}));

const mockExperience: ExperienceResponseDTO[] = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Tech Corp',
    companyImage: 'https://example.com/image.jpg',
    employmentType: 'FULL_TIME',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    location: 'Jakarta',
    locationType: 'ON_SITE',
  }
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Experience Section Positive Case', () => {

  test('should render the experience list correctly', () => {
    render(<Experience experiences={mockExperience} />);
    
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp • Penuh Waktu')).toBeInTheDocument();
    expect(screen.getByText('01 Januari 2023 - 01 Januari 2024')).toBeInTheDocument();
  });

  test('should open add experience modal and submit valid data', () => {
    render(<Experience experiences={[]} />);
    
    fireEvent.click(screen.getByTestId("add-experience-button"));

    screen.debug();
    
    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Frontend Developer' } });
    fireEvent.change(screen.getByPlaceholderText(/Masukkan nama perusahaan tempat bekerja/i), { target: { value: 'Startup XYZ' } });
    fireEvent.change(screen.getByTestId("input-location"), { target: { value: 'Jakarta' } });
    fireEvent.change(screen.getByTestId("input-start-date"), { target: { value: '2024-02-01' } });
    fireEvent.change(screen.getByTestId("input-end-date"), { target: { value: '2024-03-01' } });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    waitFor(() => expect(screen.getByText('Frontend Developer')).toBeInTheDocument(), { timeout: 5000 });
    waitFor(() => expect(screen.getByText('Startup XYZ • Penuh Waktu')).toBeInTheDocument(), { timeout: 5000 });
    waitFor(() => expect(screen.getByText('01 Februari 2024 - 01 Maret 2024')).toBeInTheDocument(), { timeout: 5000 });
  });

  test('should open edit experience modal and update data', () => {
    render(<Experience experiences={mockExperience} />);
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-button-1")); // Ini button edit yang ada di tiap exp (ini exp pertama)
    
    fireEvent.change(screen.getByPlaceholderText("Masukkan judul pekerjaan Anda"), { target: { value: 'Senior Software Engineer' } });
    fireEvent.click(screen.getByText('Simpan'));
    
    waitFor(() => expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument(), { timeout: 5000 });

  });

  test('should allow setting "Saya sedang bekerja di posisi ini"', () => {
    render(<Experience experiences={mockExperience} />);
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-button-1")); // Ini button edit yang ada di tiap exp (ini exp pertama)
    
    const checkbox = screen.getByLabelText(/Saya sedang bekerja di posisi ini/i);
    fireEvent.click(checkbox);
    
    fireEvent.click(screen.getByText('Simpan'));
    
    waitFor(() => expect(screen.getByText('Software Engineer')).toBeInTheDocument(), { timeout: 5000 });
    waitFor(() => expect(screen.getByText('01 Januari 2023 - Sekarang')).toBeInTheDocument(), { timeout: 5000 });
  });

});

describe('Experience Section Negative Case', () => {
  test('should render no experience message', () => {
    render(<Experience experiences={[]} />);
    
    expect(screen.getByText('Tidak ada pengalaman.')).toBeInTheDocument();
  });
  
  test('should not submit if start date is empty', () => {
    render(<Experience experiences={[]} />);
    
    fireEvent.click(screen.getByTestId("add-experience-button"));
    
    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Backend Developer' } });
    fireEvent.change(screen.getByPlaceholderText(/Masukkan nama perusahaan tempat bekerja/i), { target: { value: 'AI Startup' } });
    
    fireEvent.click(screen.getByTestId('add-experience-button'));
    
    expect(screen.getByText('Tambah Pengalaman')).toBeInTheDocument();
  });

  test('should not submit when required fields are empty', () => {
    render(<Experience experiences={[]} />);
  
    
    fireEvent.click(screen.getByTestId('add-experience-button'));
    
    expect(screen.getByText('Tambah Pengalaman')).toBeInTheDocument();
  });
});

describe('Experience Section Edge Case', () => {
    test('should not submit if end date is before start date', () => {
        render(<Experience experiences={[]} />);
        
        fireEvent.click(screen.getByTestId("add-experience-button"));
        
        fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Frontend Developer' } });
        fireEvent.change(screen.getByPlaceholderText(/Masukkan nama perusahaan tempat bekerja/i), { target: { value: 'Startup XYZ' } });
        fireEvent.change(screen.getByTestId("input-location"), { target: { value: 'Jakarta' } });
        fireEvent.change(screen.getByTestId("input-start-date"), { target: { value: '2024-02-01' } });
        fireEvent.change(screen.getByTestId("input-end-date"), { target: { value: '2024-01-01' } });
        
        fireEvent.click(screen.getByTestId('submit-button'));
        
        expect(screen.getByText('Tambah Pengalaman')).toBeInTheDocument();
    });

    test('should delete error when field error is fixed', () => {
        render(<Experience experiences={[]} />);
        
        fireEvent.click(screen.getByTestId("add-experience-button"));
      
        fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Frontend Developer' } });
        fireEvent.change(screen.getByPlaceholderText(/Masukkan nama perusahaan tempat bekerja/i), { target: { value: 'Startup XYZ' } });
        fireEvent.change(screen.getByTestId("input-location"), { target: { value: 'Jakarta' } });
        fireEvent.change(screen.getByTestId("input-start-date"), { target: { value: '2024-02-01' } });
        fireEvent.change(screen.getByTestId("input-end-date"), { target: { value: '2024-01-01' } });
        
        fireEvent.click(screen.getByTestId('submit-button'));

        const checkbox = screen.getByTestId('checkbox-currently-working');
        fireEvent.click(checkbox);

        fireEvent.click(screen.getByTestId('submit-button'));

        waitFor(() => expect(screen.getByText('Frontend Developer')).toBeInTheDocument(), { timeout: 5000 });
    });

    test('should keep the same data if no changes are made', () => {
        render(<Experience experiences={mockExperience} />);
        
        fireEvent.click(screen.getByTestId("edit-experience-button"));

        expect(screen.getByText('Tech Corp • Penuh Waktu')).toBeInTheDocument();
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
        expect(screen.getByText('01 Januari 2023 - 01 Januari 2024')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('edit-button-1'));

        fireEvent.click(screen.getByText('Simpan'));

        waitFor(() => expect(screen.getByText('Tech Corp • Penuh Waktu')).toBeInTheDocument(), { timeout: 5000 });
        waitFor(() => expect(screen.getByText('Software Engineer')).toBeInTheDocument(), { timeout: 5000 });
        waitFor(() => expect(screen.getByText('01 Januari 2023 - 01 Januari 2024')).toBeInTheDocument(), { timeout: 5000 });
        
    });
});

describe('Experience Delete Functionality', () => {
  test('should delete an experience when delete button is clicked', () => {
    render(<Experience experiences={mockExperience} />);
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    
    const deleteButton = screen.getByTestId("delete-button");
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(deleteButton);
    
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
    waitFor(() => expect(screen.getByText('Tidak ada pengalaman')).toBeInTheDocument(), { timeout: 5000 });
  });
  
  test('should delete only the selected experience when multiple exist', () => {
    const multipleExperiences: ExperienceResponseDTO[] = [
      ...mockExperience,
      {
        id: 2,
        title: 'Product Manager',
        company: 'ABC Company',
        companyImage: 'https://example.com/image.jpg',
        employmentType: 'FULL_TIME' as const,
        startDate: '2022-01-01',
        endDate: '2023-01-01',
        location: 'Bandung',
        locationType: 'HYBRID' as const,
      }
    ];
    
    render(<Experience experiences={multipleExperiences} />);
    
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    fireEvent.click(screen.getByTestId("edit-button-1"));
    fireEvent.click(screen.getByTestId("delete-button"));
    
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
    waitFor(() => expect(screen.getByText('Product Manager')).toBeInTheDocument(), { timeout: 5000 });
  });
  
  test('should not show delete button in add experience mode', () => {
    render(<Experience experiences={mockExperience} />);
    
    fireEvent.click(screen.getByTestId("add-experience-button"));
    
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByText('Tambah')).toBeInTheDocument();

    expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument();
  });
  
  test('should close the modal after deleting an experience', () => {
    render(<Experience experiences={mockExperience} />);
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    expect(screen.getByText('Edit Pengalaman')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("delete-button"));
    waitFor(() => {
      expect(screen.queryByText('Edit Pengalaman')).not.toBeInTheDocument();
    });
  });

  test('should open any modal and close it with X button', () => {
    render(<Experience experiences={[]} />);
    
    fireEvent.click(screen.getByTestId("add-experience-button"));

    expect(screen.getByText('Tambah Pengalaman')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-modal-button"));

    expect(screen.queryByText('Tambah Pengalaman')).not.toBeInTheDocument();
  });

  test('should show "no experience" message after deleting the last experience', () => {
    render(<Experience experiences={mockExperience} />);
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    fireEvent.click(screen.getByTestId("delete-button"));
    
    waitFor(() => expect(screen.getByText('Tidak ada pengalaman')).toBeInTheDocument(), { timeout: 5000 });

  }); 
  
  test('should keep edit mode active after deleting an experience', () => {
    const multipleExperiences: ExperienceResponseDTO[] = [
      ...mockExperience,
      {
        id: 2,
        title: 'Product Manager',
        company: 'ABC Company',
        companyImage: 'https://example.com/image.jpg',
        employmentType: 'FULL_TIME',
        startDate: '2022-01-01',
        endDate: '2023-01-01',
        location: 'Bandung',
        locationType: 'HYBRID',
      }
    ];
    
    render(<Experience experiences={multipleExperiences} />);
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    fireEvent.click(screen.getByTestId("delete-button"));
    
    waitFor(() => expect(screen.getByTestId('edit-button-2')).toBeInTheDocument(), { timeout: 5000 });
 
  });
});

describe('Experience State Management Coverage', () => {
  test('should validate form errors when submitting with missing fields', async () => {
    render(<Experience experiences={[]} />);
    
    // Open add modal
    fireEvent.click(screen.getByTestId("add-experience-button"));
    
    // Submit empty form to trigger validation
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText('Judul pekerjaan harus diisi')).toBeInTheDocument();
      expect(screen.getByText('Nama perusahaan harus diisi')).toBeInTheDocument();
      expect(screen.getByText('Lokasi harus diisi')).toBeInTheDocument();
      expect(screen.getByText('Tanggal mulai harus diisi')).toBeInTheDocument();
    });
  });

  test('should clear form errors when input values change after validation', async () => {
    render(<Experience experiences={[]} />);
    
    // Open add modal
    fireEvent.click(screen.getByTestId("add-experience-button"));
    
    // Submit empty form to trigger validation
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check if title error is displayed
    await waitFor(() => {
      expect(screen.getByText('Judul pekerjaan harus diisi')).toBeInTheDocument();
    });
    
    // Fill the title input to clear error
    fireEvent.change(screen.getByTestId('input-title'), { 
      target: { name: 'title', value: 'New Title' } 
    });
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Judul pekerjaan harus diisi')).not.toBeInTheDocument();
    });
  });

  test('should toggle currently working checkbox correctly', async () => {
    render(<Experience experiences={[]} />);
    
    // Open add modal
    fireEvent.click(screen.getByTestId("add-experience-button"));
    
    // Initially the end date field should be visible
    expect(screen.getByTestId('input-end-date')).toBeInTheDocument();
    
    // Check the currently working checkbox
    const checkbox = screen.getByTestId('checkbox-currently-working');
    fireEvent.click(checkbox);
    
    // End date field should now be hidden
    await waitFor(() => {
      expect(screen.queryByTestId('input-end-date')).not.toBeInTheDocument();
    });
    
    // Uncheck the currently working checkbox
    fireEvent.click(checkbox);
    
    // End date field should be visible again
    await waitFor(() => {
      expect(screen.getByTestId('input-end-date')).toBeInTheDocument();
    });
  });

  test('should handle errors when adding a experience fails', async () => {
    (ExperienceService.addExperience as jest.Mock).mockRejectedValueOnce(new Error('Failed to save experience'));
    
    render(<Experience experiences={[]} />);
    
    // Open add modal
    fireEvent.click(screen.getByTestId('add-experience-button'));
    
    fireEvent.click(screen.getByTestId("add-experience-button"));
    
    // Fill required fields
    fireEvent.change(screen.getByTestId('input-title'), { 
      target: { name: 'title', value: 'New Job' } 
    });
    fireEvent.change(screen.getByTestId('input-company'), { 
      target: { name: 'company', value: 'New Company' } 
    });
    fireEvent.change(screen.getByTestId('input-location'), { 
      target: { name: 'location', value: 'New Location' } 
    });
    fireEvent.change(screen.getByTestId('input-start-date'), { 
      target: { name: 'startDate', value: '2023-01-01' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to save experience')).toBeInTheDocument();
    });

  });

  test('should handle errors when editing a experience fails', async () => {
    (ExperienceService.editExperience as jest.Mock).mockRejectedValueOnce(new Error('Failed to update experience'));
    
    render(<Experience experiences={mockExperience} />);
    
    // Enable edit mode
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    
    // Make a change
    fireEvent.change(screen.getByTestId('input-title'), { 
      target: { name: 'title', value: 'Updated Job' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to update experience')).toBeInTheDocument();
    });
  });

  test('should handle errors when deleting a experience fails', async () => {
    (ExperienceService.deleteExperience as jest.Mock).mockRejectedValueOnce(new Error('Failed to delete experience'));
    
    render(<Experience experiences={mockExperience} />);
    
    // Enable edit mode
    fireEvent.click(screen.getByTestId('edit-experience-button'));
    
    // Open edit modal
    fireEvent.click(screen.getByTestId('edit-button-1'));
    
    // Click delete
    fireEvent.click(screen.getByTestId('delete-button'));
    
    // Check error message
    await waitFor(() => {
      expect(screen.getByText('Failed to delete experience')).toBeInTheDocument();
    });
  });

  test('should handle DOMPurify sanitization when input changes', async () => {
    const sanitizeSpy = jest.spyOn(DOMPurify, 'sanitize');
    
    render(<Experience experiences={[]} />);
    
    // Open add modal
    fireEvent.click(screen.getByTestId("add-experience-button"));
    
    // Input with HTML tags
    const maliciousText = '<script>alert("XSS")</script>Test Title';
    fireEvent.change(screen.getByTestId('input-title'), { 
      target: { name: 'title', value: maliciousText } 
    });
    
    // Verify sanitize was called
    expect(sanitizeSpy).toHaveBeenCalledWith(maliciousText);
    
    sanitizeSpy.mockRestore();
  });
});