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
    
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Startup XYZ • Penuh Waktu')).toBeInTheDocument();
    expect(screen.getByText('01 Februari 2024 - 01 Maret 2024')).toBeInTheDocument();
  });

  test('should open edit experience modal and update data', () => {
    render(<Experience experiences={mockExperience} />);
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-button-1")); // Ini button edit yang ada di tiap exp (ini exp pertama)
    
    fireEvent.change(screen.getByPlaceholderText("Masukkan judul pekerjaan Anda"), { target: { value: 'Senior Software Engineer' } });
    fireEvent.click(screen.getByText('Simpan'));
    
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
  });

  test('should allow setting "Saya sedang bekerja di posisi ini"', () => {
    render(<Experience experiences={mockExperience} />);
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-button-1")); // Ini button edit yang ada di tiap exp (ini exp pertama)
    
    const checkbox = screen.getByLabelText(/Saya sedang bekerja di posisi ini/i);
    fireEvent.click(checkbox);
    
    fireEvent.click(screen.getByText('Simpan'));
    
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('01 Januari 2023 - Sekarang')).toBeInTheDocument();
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

    test('should keep the same data if no changes are made', () => {
        render(<Experience experiences={mockExperience} />);
        
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
    render(<Experience experiences={mockExperience} />);
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    
    const deleteButton = screen.getByTestId("delete-button");
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(deleteButton);
    
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
    
    render(<Experience experiences={multipleExperiences} />);
    
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    
    fireEvent.click(screen.getByTestId("edit-button-1"));
    fireEvent.click(screen.getByTestId("delete-button"));
    
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
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
    expect(screen.queryByText('Edit Pengalaman')).not.toBeInTheDocument();
  });

  test('should show "no experience" message after deleting the last experience', () => {
    render(<Experience experiences={mockExperience} />);
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    fireEvent.click(screen.getByTestId("delete-button"));
    
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
    
    render(<Experience experiences={multipleExperiences} />);
    
    fireEvent.click(screen.getByTestId("edit-experience-button"));
    fireEvent.click(screen.getByTestId("edit-button-1"));
    fireEvent.click(screen.getByTestId("delete-button"));
    
    expect(screen.getByTestId("edit-button-2")).toBeInTheDocument();
  });
});