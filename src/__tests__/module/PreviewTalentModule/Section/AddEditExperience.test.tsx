import { render, screen, fireEvent } from '@testing-library/react';
import Experience, { ExperienceDetail } from '@/components/ui/experience';
import '@testing-library/jest-dom';

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
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('01 Januari 2023 - 01 Januari 2024')).toBeInTheDocument();
  });

  test('should open add experience modal and submit valid data', () => {
    render(<Experience experiences={[]} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Tambah/i }));
    
    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Frontend Developer' } });
    fireEvent.change(screen.getByPlaceholderText(/Masukkan nama perusahaan tempat bekerja/i), { target: { value: 'Startup XYZ' } });
    fireEvent.change(screen.getByLabelText(/Tanggal Mulai/i), { target: { value: '2024-02-01' } });
    
    fireEvent.click(screen.getByText('Tambah'));
    
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Startup XYZ')).toBeInTheDocument();
    expect(screen.getByText('01 Februari 2024 - Sekarang')).toBeInTheDocument();
  });

  test('should open edit experience modal and update data', () => {
    render(<Experience experiences={mockExperience} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    
    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Senior Software Engineer' } });
    fireEvent.click(screen.getByText('Simpan'));
    
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
  });

  test('should allow setting "Saya sedang bekerja di posisi ini"', () => {
    render(<Experience experiences={mockExperience} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    
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
    
    fireEvent.click(screen.getByRole('button', { name: /Tambah/i }));
    
    fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Backend Developer' } });
    fireEvent.change(screen.getByPlaceholderText(/Masukkan nama perusahaan tempat bekerja/i), { target: { value: 'AI Startup' } });
    
    fireEvent.click(screen.getByText('Tambah'));
    
    expect(screen.getByText('Tambah Pengalaman')).toBeInTheDocument();
  });

  test('should not submit when required fields are empty', () => {
    render(<Experience experiences={[]} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Tambah/i }));
    
    fireEvent.click(screen.getByText('Tambah'));
    
    expect(screen.getByText('Tambah Pengalaman')).toBeInTheDocument();
  });
});

describe('Experience Section Edge Case', () => {
    test('should not submit if end date is before start date', () => {
        render(<Experience experiences={[]} />);
        
        fireEvent.click(screen.getByRole('button', { name: /Tambah/i }));
        
        fireEvent.change(screen.getByPlaceholderText(/Masukkan judul pekerjaan Anda/i), { target: { value: 'Frontend Developer' } });
        fireEvent.change(screen.getByPlaceholderText(/Masukkan nama perusahaan tempat bekerja/i), { target: { value: 'Startup XYZ' } });
        fireEvent.change(screen.getByLabelText(/Tanggal Mulai/i), { target: { value: '2024-02-01' } });
        fireEvent.change(screen.getByLabelText(/Tanggal Selesai/i), { target: { value: '2024-01-01' } });
        
        fireEvent.click(screen.getByText('Tambah'));
        
        expect(screen.getByText('Tambah Pengalaman')).toBeInTheDocument();
    });

    test('should keep the same data if no changes are made', () => {
        render(<Experience experiences={mockExperience} />);
        
        fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
        fireEvent.click(screen.getByText('Simpan'));
        
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
        expect(screen.getByText('Tech Corp')).toBeInTheDocument();
        expect(screen.getByText('01 Januari 2023 - 01 Januari 2024')).toBeInTheDocument();
    });
});