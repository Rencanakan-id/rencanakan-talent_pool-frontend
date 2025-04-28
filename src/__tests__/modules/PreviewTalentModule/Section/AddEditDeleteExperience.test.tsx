import { render, screen, fireEvent } from '@testing-library/react';
import Experience, { ExperienceDetail } from '@/components/ui/experience';
import '@testing-library/jest-dom';

jest.mock('@/components', () => ({
  Typography: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>
}));

const mockExperience: ExperienceDetail[] = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Tech Corp',
    employmentType: 'FULL_TIME',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    location: 'Jakarta',
    locationType: 'ON_SITE',
    talentId: 1,
  }
];

// Mock handlers untuk CRUD operations
const mockAddHandler = jest.fn();
const mockEditHandler = jest.fn();
const mockDeleteHandler = jest.fn();

describe('Experience Section Positive Case', () => {
  test('should render the experience list correctly', () => {
    render(<Experience experiences={mockExperience} />);
    
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp • Penuh Waktu')).toBeInTheDocument();
    expect(screen.getByText('01 Januari 2023 - 01 Januari 2024')).toBeInTheDocument();
  });

  test('should open add experience modal and submit valid data', () => {
    render(<Experience experiences={[]} editable={true} />);
    
    fireEvent.click(screen.getByTestId("add-experience-button"));
    
    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Frontend Developer' } });
    fireEvent.change(screen.getByPlaceholderText(/Masukkan nama perusahaan tempat bekerja/i), { target: { value: 'Startup XYZ' } });
    fireEvent.change(screen.getByTestId("input-location"), { target: { value: 'Jakarta' } });
    fireEvent.change(screen.getByTestId("input-start-date"), { target: { value: '2024-02-01' } });
    fireEvent.change(screen.getByTestId("input-end-date"), { target: { value: '2024-03-01' } });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Startup XYZ • Penuh Waktu')).toBeInTheDocument();
    expect(screen.getByText('01 Februari 2024 - 01 Maret 2024')).toBeInTheDocument();
  });

  test('should open edit experience modal and update data', () => {
    render(<Experience experiences={mockExperience} editable={true} />);
    
    // Klik tombol untuk mengaktifkan edit mode
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    // Pastikan edit button untuk experience dengan id=1 sudah muncul
    const editButton = screen.getByTestId("edit-button-1");
    expect(editButton).toBeInTheDocument();
    
    // Klik edit button untuk experience dengan id=1
    fireEvent.click(editButton);
    
    // Ubah judul pengalaman
    fireEvent.change(screen.getByPlaceholderText("Masukkan judul pekerjaan Anda"), { target: { value: 'Senior Software Engineer' } });
    
    // Klik tombol simpan
    fireEvent.click(screen.getByText('Simpan'));
    
    // Verifikasi perubahan judul
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
  });

  test('should allow setting "Saya sedang bekerja di posisi ini"', () => {
    render(<Experience experiences={mockExperience} editable={true} />);
    
    // Aktifkan mode edit
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    // Pastikan tombol edit untuk experience dengan id=1 sudah muncul
    const editButton = screen.getByTestId("edit-button-1");
    expect(editButton).toBeInTheDocument();
    
    // Klik tombol edit
    fireEvent.click(editButton);
    
    // Klik checkbox "Saya sedang bekerja di posisi ini"
    const checkbox = screen.getByLabelText(/Saya sedang bekerja di posisi ini/i);
    fireEvent.click(checkbox);
    
    // Simpan perubahan
    fireEvent.click(screen.getByText('Simpan'));
    
    // Verifikasi bahwa tanggal akhir sekarang adalah "Sekarang"
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('01 Januari 2023 - Sekarang')).toBeInTheDocument();
  });

  test('should call onAdd handler when provided', () => {
    render(<Experience experiences={[]} editable={true} onAdd={mockAddHandler} />);
    
    fireEvent.click(screen.getByTestId("add-experience-button"));
    
    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Frontend Developer' } });
    fireEvent.change(screen.getByPlaceholderText(/Masukkan nama perusahaan tempat bekerja/i), { target: { value: 'Startup XYZ' } });
    fireEvent.change(screen.getByTestId("input-location"), { target: { value: 'Jakarta' } });
    fireEvent.change(screen.getByTestId("input-start-date"), { target: { value: '2024-02-01' } });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    expect(mockAddHandler).toHaveBeenCalled();
  });

  test('should call onEdit handler when provided', () => {
    render(<Experience experiences={mockExperience} editable={true} onEdit={mockEditHandler} />);
    
    // Aktifkan mode edit
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    // Pastikan tombol edit untuk experience dengan id=1 sudah muncul
    const editButton = screen.getByTestId("edit-button-1");
    expect(editButton).toBeInTheDocument();
    
    // Klik tombol edit
    fireEvent.click(editButton);
    
    // Ubah judul pengalaman
    fireEvent.change(screen.getByPlaceholderText("Masukkan judul pekerjaan Anda"), { target: { value: 'Senior Software Engineer' } });
    
    // Simpan perubahan
    fireEvent.click(screen.getByText('Simpan'));
    
    // Verifikasi bahwa handler onEdit dipanggil
    expect(mockEditHandler).toHaveBeenCalled();
  });
});

describe('Experience Section Negative Case', () => {
  test('should render no experience message', () => {
    render(<Experience experiences={[]} />);
    
    expect(screen.getByText('Tidak ada pengalaman.')).toBeInTheDocument();
  });
  
  test('should not submit if start date is empty', () => {
    render(<Experience experiences={[]} editable={true} />);
    
    fireEvent.click(screen.getByTestId("add-experience-button"));
    
    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Backend Developer' } });
    fireEvent.change(screen.getByPlaceholderText(/Masukkan nama perusahaan tempat bekerja/i), { target: { value: 'AI Startup' } });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    expect(screen.getByText('Tambah Pengalaman')).toBeInTheDocument();
  });

  test('should not submit when required fields are empty', () => {
    render(<Experience experiences={[]} editable={true} />);
    
    fireEvent.click(screen.getByTestId('add-experience-button'));
    fireEvent.click(screen.getByTestId('submit-button'));
    
    expect(screen.getByText('Tambah Pengalaman')).toBeInTheDocument();
  });

  test('should not show edit controls when editable is false', () => {
    render(<Experience experiences={mockExperience} editable={false} />);
    
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.queryByTestId("edit-experience-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("add-experience-button")).not.toBeInTheDocument();
  });
});

describe('Experience Section Edge Case', () => {
    test('should not submit if end date is before start date', () => {
        render(<Experience experiences={[]} editable={true} />);
        
        fireEvent.click(screen.getByTestId("add-experience-button"));
        
        fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Frontend Developer' } });
        fireEvent.change(screen.getByPlaceholderText(/Masukkan nama perusahaan tempat bekerja/i), { target: { value: 'Startup XYZ' } });
        fireEvent.change(screen.getByTestId("input-location"), { target: { value: 'Jakarta' } });
        fireEvent.change(screen.getByTestId("input-start-date"), { target: { value: '2024-02-01' } });
        fireEvent.change(screen.getByTestId("input-end-date"), { target: { value: '2024-01-01' } });
        
        fireEvent.click(screen.getByTestId('submit-button'));
        
        expect(screen.getByText('Tambah Pengalaman')).toBeInTheDocument();
    });

    test('should keep the same data if no changes are made', () => {
        render(<Experience experiences={mockExperience} editable={true} />);
        
        fireEvent.click(screen.getByTestId("edit-experience-button"));

        expect(screen.getByText('Tech Corp • Penuh Waktu')).toBeInTheDocument();
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
        expect(screen.getByText('01 Januari 2023 - 01 Januari 2024')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('edit-button-1'));

        fireEvent.click(screen.getByText('Simpan'));

        expect(screen.getByText('Tech Corp • Penuh Waktu')).toBeInTheDocument();
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
        expect(screen.getByText('01 Januari 2023 - 01 Januari 2024')).toBeInTheDocument();
    });
});

describe('Experience Delete Functionality', () => {
  test('should delete an experience when delete button is clicked', () => {
    render(<Experience experiences={mockExperience} editable={true} />);
    
    // Aktifkan mode edit
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    // Pastikan tombol edit untuk experience dengan id=1 sudah muncul
    const editButton = screen.getByTestId("edit-button-1");
    expect(editButton).toBeInTheDocument();
    
    // Klik tombol edit
    fireEvent.click(editButton);
    
    // Pastikan tombol delete ada
    const deleteButton = screen.getByTestId("delete-button");
    expect(deleteButton).toBeInTheDocument();
    
    // Klik tombol delete
    fireEvent.click(deleteButton);
    
    // Verifikasi bahwa experience telah dihapus
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
    expect(screen.getByText('Tidak ada pengalaman.')).toBeInTheDocument();
  });
  
  test('should delete only the selected experience when multiple exist', () => {
    const multipleExperiences: ExperienceDetail[] = [
      ...mockExperience,
      {
        id: 2,
        title: 'Product Manager',
        company: 'ABC Company',
        employmentType: 'FULL_TIME' as const,
        startDate: '2022-01-01',
        endDate: '2023-01-01',
        location: 'Bandung',
        locationType: 'HYBRID' as const,
        talentId: 1,
      }
    ];
    
    render(<Experience experiences={multipleExperiences} editable={true} />);
    
    // Verifikasi bahwa kedua experience ada
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
    
    // Aktifkan mode edit
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    // Pastikan tombol edit untuk experience dengan id=1 sudah muncul
    const editButton = screen.getByTestId("edit-button-1");
    expect(editButton).toBeInTheDocument();
    
    // Klik tombol edit untuk experience pertama
    fireEvent.click(editButton);
    
    // Klik tombol delete
    fireEvent.click(screen.getByTestId("delete-button"));
    
    // Verifikasi bahwa hanya experience pertama yang dihapus
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });
  
  test('should not show delete button in add experience mode', () => {
    render(<Experience experiences={mockExperience} editable={true} />);
    
    fireEvent.click(screen.getByTestId("add-experience-button"));
    
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByText('Tambah')).toBeInTheDocument();

    expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument();
  });
  
  test('should close the modal after deleting an experience', () => {
    render(<Experience experiences={mockExperience} editable={true} />);
    
    // Aktifkan mode edit
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    // Pastikan tombol edit untuk experience dengan id=1 sudah muncul
    const editButton = screen.getByTestId("edit-button-1");
    expect(editButton).toBeInTheDocument();
    
    // Klik tombol edit
    fireEvent.click(editButton);
    
    // Verifikasi modal terbuka
    expect(screen.getByText('Edit Pengalaman')).toBeInTheDocument();
    
    // Klik tombol delete
    fireEvent.click(screen.getByTestId("delete-button"));
    
    // Verifikasi modal tertutup
    expect(screen.queryByText('Edit Pengalaman')).not.toBeInTheDocument();
  });

  test('should show "no experience" message after deleting the last experience', () => {
    render(<Experience experiences={mockExperience} editable={true} />);
    
    // Aktifkan mode edit
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    // Pastikan tombol edit untuk experience dengan id=1 sudah muncul
    const editButton = screen.getByTestId("edit-button-1");
    expect(editButton).toBeInTheDocument();
    
    // Klik tombol edit
    fireEvent.click(editButton);
    
    // Klik tombol delete
    fireEvent.click(screen.getByTestId("delete-button"));
    
    // Verifikasi pesan "tidak ada pengalaman" muncul
    expect(screen.getByText('Tidak ada pengalaman.')).toBeInTheDocument();
  });
  
  test('should keep edit mode active after deleting an experience', () => {
    const multipleExperiences: ExperienceDetail[] = [
      ...mockExperience,
      {
        id: 2,
        title: 'Product Manager',
        company: 'ABC Company',
        employmentType: 'FULL_TIME',
        startDate: '2022-01-01',
        endDate: '2023-01-01',
        location: 'Bandung',
        locationType: 'HYBRID',
        talentId: 1,
      }
    ];
    
    render(<Experience experiences={multipleExperiences} editable={true} />);
    
    // Aktifkan mode edit
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    // Pastikan tombol edit untuk experience dengan id=1 sudah muncul
    const editButton = screen.getByTestId("edit-button-1");
    expect(editButton).toBeInTheDocument();
    
    // Klik tombol edit
    fireEvent.click(editButton);
    
    // Klik tombol delete
    fireEvent.click(screen.getByTestId("delete-button"));
    
    // Verifikasi bahwa tombol edit untuk experience dengan id=2 masih ada
    // (ini berarti mode edit masih aktif)
    expect(screen.getByTestId("edit-button-2")).toBeInTheDocument();
  });
  
  test('should call onDelete handler when provided', () => {
    render(
      <Experience 
        experiences={mockExperience} 
        editable={true} 
        onDelete={mockDeleteHandler} 
      />
    );
    
    // Aktifkan mode edit
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    // Pastikan tombol edit untuk experience dengan id=1 sudah muncul
    const editButton = screen.getByTestId("edit-button-1");
    expect(editButton).toBeInTheDocument();
    
    // Klik tombol edit
    fireEvent.click(editButton);
    
    // Klik tombol delete
    fireEvent.click(screen.getByTestId("delete-button"));
    
    // Verifikasi bahwa handler onDelete dipanggil dengan ID yang benar
    expect(mockDeleteHandler).toHaveBeenCalledWith(1);
  });
});

describe('Experience Delete Edge Cases', () => {
  test('should not attempt to delete when no onDelete handler is provided', () => {
    // This test verifies that the component handles the absence of an onDelete handler
    render(<Experience experiences={mockExperience} editable={true} />);
    
    // Activate edit mode
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    // Click the edit button for experience with id=1
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    // Click the delete button
    fireEvent.click(screen.getByTestId("delete-button"));
    
    // Verify the experience is removed from local state even without handler
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
  });

  test('should handle delete button click immediately after switching to edit mode', () => {
    render(<Experience experiences={mockExperience} editable={true} />);
    
    // Activate edit mode and immediately edit
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    // Delete without making any changes
    fireEvent.click(screen.getByTestId("delete-button"));
    
    // Verify the experience was deleted
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
  });
});
