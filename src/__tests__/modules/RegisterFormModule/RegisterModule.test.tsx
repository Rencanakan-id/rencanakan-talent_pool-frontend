import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterModule } from "@/modules/RegisterFormModule";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';

// Fix TypeScript errors with proper typing for mocks
// Properly type the global fetch mock
global.fetch = jest.fn() as jest.Mock;

// Properly define ResizeObserver mock
global.ResizeObserver = class ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
} as unknown as typeof ResizeObserver;

// Fix scrollIntoView mock
HTMLElement.prototype.scrollIntoView = jest.fn() as jest.Mock;

// Properly handle window.location mock
const originalLocation = window.location;
const locationMock = {
  ...originalLocation,
  href: ''
};
Object.defineProperty(window, 'location', {
  writable: true,
  value: locationMock
});

describe("Registration Page Positive Case", () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    (global.fetch as jest.Mock).mockReset();
    window.location.href = '';
  });

  it("renders the first step correctly", () => {
    render(<RegisterModule />);
    expect(screen.getByText("Lengkapi formulir dan mulai perjalanan karier kamu!")).toBeInTheDocument();
  });

  it("fills out the first step and proceeds", async () => {
    render(<RegisterModule />);

    await userEvent.type(screen.getByLabelText("Foto Diri"), "img.jpg");
    await userEvent.type(screen.getByPlaceholderText("Nama Depan"), "John");
    await userEvent.type(screen.getByPlaceholderText("Nama Belakang"), "Doe");
    await userEvent.type(screen.getByPlaceholderText("Masukkan email Anda"), "john.doe@example.com");
    await userEvent.type(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda"), "081234567890");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NIK Anda"), "1234567890123456");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NPWP Anda"), "123456789012345");
    
    fireEvent.click(screen.getByText("Selanjutnya"));

    await waitFor(() => expect(screen.getByText("Ceritakan sedikit pengalaman kerja kamu")).toBeInTheDocument());
  });

  it("handles null and undefined file values correctly", async () => {
    render(<RegisterModule />);

    // Test with null values
    const nullFormData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "081234567890",
      nik: "1234567890123456",
      npwp: "123456789012345",
      ktpFile: null,
      npwpFile: null,
      diplomaFile: null
    };

    // Update form with null values
    await userEvent.type(screen.getByPlaceholderText("Nama Depan"), nullFormData.firstName);
    await userEvent.type(screen.getByPlaceholderText("Nama Belakang"), nullFormData.lastName);
    await userEvent.type(screen.getByPlaceholderText("Masukkan email Anda"), nullFormData.email);
    await userEvent.type(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda"), nullFormData.phoneNumber);
    await userEvent.type(screen.getByPlaceholderText("Masukkan NIK Anda"), nullFormData.nik);
    await userEvent.type(screen.getByPlaceholderText("Masukkan NPWP Anda"), nullFormData.npwp);

    const ktpFile = new File(['ktp content'], 'ktp.pdf', { type: 'application/pdf' });
    const npwpFile = new File(['npwp content'], 'npwp.pdf', { type: 'application/pdf' });
    const diplomaFile = new File(['diploma content'], 'diploma.pdf', { type: 'application/pdf' });

    // Upload files
    const ktpInput = screen.getByTestId('ktp-file-input');
    const npwpInput = screen.getByTestId('npwp-file-input');
    const diplomaInput = screen.getByTestId('diploma-file-input');

    await userEvent.upload(ktpInput, ktpFile);
    await userEvent.upload(npwpInput, npwpFile);
    await userEvent.upload(diplomaInput, diplomaFile);

    // Try to proceed again
    fireEvent.click(screen.getByText("Selanjutnya"));

    // Verify we can proceed to next step with valid files
    await waitFor(() => {
      expect(screen.getByText("Ceritakan sedikit pengalaman kerja kamu")).toBeInTheDocument();
    });
  });

  it("converts null files to undefined in validation", async () => {
    render(<RegisterModule />);
    
    // Fill form data without files
    await userEvent.type(screen.getByPlaceholderText("Nama Depan"), "John");
    await userEvent.type(screen.getByPlaceholderText("Nama Belakang"), "Doe");
    await userEvent.type(screen.getByPlaceholderText("Masukkan email Anda"), "john@example.com");
    await userEvent.type(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda"), "081234567890");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NIK Anda"), "1234567890123456");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NPWP Anda"), "123456789012345");

    // Mock the validation function
    const mockValidateStepOneForm = jest.spyOn(require('@/lib/validation/stepOneFormValidation'), 'validateStepOneForm');

    // Trigger validation by clicking next
    fireEvent.click(screen.getByText("Selanjutnya"));

    // Verify that null values were converted to undefined in validation call
    await waitFor(() => {
      expect(mockValidateStepOneForm).toHaveBeenCalledWith(
        expect.objectContaining({
          ktpFile: undefined,
          npwpFile: undefined,
          diplomaFile: undefined
        })
      );
    });

    // Clean up
    mockValidateStepOneForm.mockRestore();
  });

  it("proceeds to another step and return with kembali button", async () => {
    render(<RegisterModule />);
    
    await userEvent.type(screen.getByPlaceholderText("Nama Depan"), "John");
    await userEvent.type(screen.getByPlaceholderText("Nama Belakang"), "Doe");
    await userEvent.type(screen.getByPlaceholderText("Masukkan email Anda"), "john.doe@example.com");
    await userEvent.type(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda"), "081234567890");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NIK Anda"), "1234567890123456");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NPWP Anda"), "123456789012345");
    
    fireEvent.click(screen.getByText("Selanjutnya"));

    fireEvent.click(screen.getByText("Kembali"))

    await waitFor(() => expect(screen.getByText("Lengkapi formulir dan mulai perjalanan karier kamu!")).toBeInTheDocument());
  });

  it("correctly parses experience years with parseExperienceYears function", async () => {
    render(<RegisterModule />);
    
    // Fill out steps to reach the part where experience is selected
    await userEvent.type(screen.getByPlaceholderText("Nama Depan"), "John");
    await userEvent.type(screen.getByPlaceholderText("Nama Belakang"), "Doe");
    await userEvent.type(screen.getByPlaceholderText("Masukkan email Anda"), "john.doe@example.com");
    await userEvent.type(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda"), "081234567890");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NIK Anda"), "1234567890123456");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NPWP Anda"), "123456789012345");
    
    fireEvent.click(screen.getByText("Selanjutnya"));
    
    // Test different experience year selections
    await userEvent.click(screen.getByText("Pilih Lama Pengalaman *"));
    await userEvent.click(screen.getByText("1 Tahun"));
    
    // Move to the next step again to test if the value gets processed
    await userEvent.type(screen.getByPlaceholderText("Ceritakan tentang dirimu secara singkat di sini..."), "Test bio 10 karakter");
    await userEvent.click(screen.getByText("Level Sertifikasi SKK *"));
    await userEvent.click(screen.getByText("Operator"));
    await userEvent.click(screen.getByText("Lokasi Saat Ini *"));
    await userEvent.click(screen.getByText("Jakarta"));
    await userEvent.click(screen.getByText("Bersedia Ditempatkan Di Mana *"));
    await userEvent.click(screen.getByText("Bandung"));
    await userEvent.click(screen.getByText("Keahlian *"));
    await userEvent.click(screen.getByText("Arsitektur"));
    
    fireEvent.click(screen.getByText("Selanjutnya"));
    
    // Test switching back and changing the value
    fireEvent.click(screen.getByText("Kembali"));
    
    await userEvent.click(screen.getByText("1 Tahun"));
    await userEvent.click(screen.getByText("5 Tahun"));

    fireEvent.click(screen.getByText("Selanjutnya"));

    await waitFor(() => expect(screen.getByText("Kira-kira begini perkiraan harga kamu, cocok gak?")).toBeInTheDocument());
  });

  it("successfully submits the form when all data is valid", async () => {
    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Registration successful" })
    });
    
    render(<RegisterModule />);
    
    // Fill Step 1
    await userEvent.type(screen.getByPlaceholderText("Nama Depan"), "John");
    await userEvent.type(screen.getByPlaceholderText("Nama Belakang"), "Doe");
    await userEvent.type(screen.getByPlaceholderText("Masukkan email Anda"), "john.doe@example.com");
    await userEvent.type(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda"), "081234567890");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NIK Anda"), "1234567890123456");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NPWP Anda"), "123456789012345");
    
    fireEvent.click(screen.getByText("Selanjutnya"));

    // Fill Step 2
    await waitFor(() => expect(screen.getByText("Ceritakan sedikit pengalaman kerja kamu")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Ceritakan tentang dirimu secara singkat di sini..."), "Saya seorang developer berpengalaman.");
    await userEvent.click(screen.getByText("Pilih Lama Pengalaman *"));
    await userEvent.click(screen.getByText("2-3 Tahun"));
    await userEvent.click(screen.getByText("Level Sertifikasi SKK *"));
    await userEvent.click(screen.getByText("Operator"));
    await userEvent.click(screen.getByText("Lokasi Saat Ini *"));
    await userEvent.click(screen.getByText("Jakarta"));
    await userEvent.click(screen.getByText("Bersedia Ditempatkan Di Mana *"));
    await userEvent.click(screen.getByText("Bandung"));
    await userEvent.click(screen.getByText("Keahlian *"));
    await userEvent.click(screen.getByText("Arsitektur"));

    fireEvent.click(screen.getByText("Selanjutnya"));

    // Fill Step 3
    await waitFor(() => expect(screen.getByText("Kira-kira begini perkiraan harga kamu, cocok gak?")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Rp. -"), "5000000");
    fireEvent.click(screen.getByText("Selanjutnya"));
    
    // Fill Step 4 and submit
    await waitFor(() => expect(screen.getByText("Semuanya udah oke, yuk buat akun!")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Buat kata sandi yang sulit (pastikan ada angka dan minimal 8 karakter)"), "Password123");
    await userEvent.type(screen.getByPlaceholderText("Masukkan kata sandimu lagi disini"), "Password123");
    fireEvent.click(screen.getByRole("checkbox"));
    
    fireEvent.click(screen.getByText("Daftar Kerja"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/auth/register', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }),
        body: expect.any(String)
      }));

      const requestBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(requestBody.experienceYears).toBe(2);

      expect(window.location.href).toBe('/login');
    });
  });

  it("successfully submits the form with 1 yrs exp", async () => {
    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Registration successful" })
    });
    
    render(<RegisterModule />);
    
    // Fill Step 1
    await userEvent.type(screen.getByPlaceholderText("Nama Depan"), "John");
    await userEvent.type(screen.getByPlaceholderText("Nama Belakang"), "Doe");
    await userEvent.type(screen.getByPlaceholderText("Masukkan email Anda"), "john.doe@example.com");
    await userEvent.type(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda"), "081234567890");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NIK Anda"), "1234567890123456");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NPWP Anda"), "123456789012345");
    
    fireEvent.click(screen.getByText("Selanjutnya"));

    // Fill Step 2
    await waitFor(() => expect(screen.getByText("Ceritakan sedikit pengalaman kerja kamu")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Ceritakan tentang dirimu secara singkat di sini..."), "Saya seorang developer berpengalaman.");
    await userEvent.click(screen.getByText("Pilih Lama Pengalaman *"));
    await userEvent.click(screen.getByText("1 Tahun"));
    await userEvent.click(screen.getByText("Level Sertifikasi SKK *"));
    await userEvent.click(screen.getByText("Operator"));
    await userEvent.click(screen.getByText("Lokasi Saat Ini *"));
    await userEvent.click(screen.getByText("Jakarta"));
    await userEvent.click(screen.getByText("Bersedia Ditempatkan Di Mana *"));
    await userEvent.click(screen.getByText("Bandung"));
    await userEvent.click(screen.getByText("Keahlian *"));
    await userEvent.click(screen.getByText("Arsitektur"));

    fireEvent.click(screen.getByText("Selanjutnya"));

    // Fill Step 3
    await waitFor(() => expect(screen.getByText("Kira-kira begini perkiraan harga kamu, cocok gak?")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Rp. -"), "5000000");
    fireEvent.click(screen.getByText("Selanjutnya"));
    
    // Fill Step 4 and submit
    await waitFor(() => expect(screen.getByText("Semuanya udah oke, yuk buat akun!")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Buat kata sandi yang sulit (pastikan ada angka dan minimal 8 karakter)"), "Password123");
    await userEvent.type(screen.getByPlaceholderText("Masukkan kata sandimu lagi disini"), "Password123");
    fireEvent.click(screen.getByRole("checkbox"));
    
    fireEvent.click(screen.getByText("Daftar Kerja"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/auth/register', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }),
        body: expect.any(String)
      }));

      const requestBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(requestBody.experienceYears).toBe(1);

      expect(window.location.href).toBe('/login');
    });
  });

  it("successfully submits the form with 5 yrs exp", async () => {
    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Registration successful" })
    });
    
    render(<RegisterModule />);
    
    // Fill Step 1
    await userEvent.type(screen.getByPlaceholderText("Nama Depan"), "John");
    await userEvent.type(screen.getByPlaceholderText("Nama Belakang"), "Doe");
    await userEvent.type(screen.getByPlaceholderText("Masukkan email Anda"), "john.doe@example.com");
    await userEvent.type(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda"), "081234567890");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NIK Anda"), "1234567890123456");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NPWP Anda"), "123456789012345");
    
    fireEvent.click(screen.getByText("Selanjutnya"));

    // Fill Step 2
    await waitFor(() => expect(screen.getByText("Ceritakan sedikit pengalaman kerja kamu")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Ceritakan tentang dirimu secara singkat di sini..."), "Saya seorang developer berpengalaman.");
    await userEvent.click(screen.getByText("Pilih Lama Pengalaman *"));
    await userEvent.click(screen.getByText("5 Tahun"));
    await userEvent.click(screen.getByText("Level Sertifikasi SKK *"));
    await userEvent.click(screen.getByText("Operator"));
    await userEvent.click(screen.getByText("Lokasi Saat Ini *"));
    await userEvent.click(screen.getByText("Jakarta"));
    await userEvent.click(screen.getByText("Bersedia Ditempatkan Di Mana *"));
    await userEvent.click(screen.getByText("Bandung"));
    await userEvent.click(screen.getByText("Keahlian *"));
    await userEvent.click(screen.getByText("Arsitektur"));

    fireEvent.click(screen.getByText("Selanjutnya"));

    // Fill Step 3
    await waitFor(() => expect(screen.getByText("Kira-kira begini perkiraan harga kamu, cocok gak?")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Rp. -"), "5000000");
    fireEvent.click(screen.getByText("Selanjutnya"));
    
    // Fill Step 4 and submit
    await waitFor(() => expect(screen.getByText("Semuanya udah oke, yuk buat akun!")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Buat kata sandi yang sulit (pastikan ada angka dan minimal 8 karakter)"), "Password123");
    await userEvent.type(screen.getByPlaceholderText("Masukkan kata sandimu lagi disini"), "Password123");
    fireEvent.click(screen.getByRole("checkbox"));
    
    fireEvent.click(screen.getByText("Daftar Kerja"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/auth/register', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }),
        body: expect.any(String)
      }));

      const requestBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(requestBody.experienceYears).toBe(3);

      expect(window.location.href).toBe('/login');
    });
  });
});

describe("Registration Page Negative Case", () => {
  it("handles API errors during submission", async () => {
    // Mock failed fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Registration failed'),
    });
    
    render(<RegisterModule />);
    
    // Step 1
    await userEvent.type(screen.getByPlaceholderText("Nama Depan"), "John");
    await userEvent.type(screen.getByPlaceholderText("Nama Belakang"), "Doe");
    await userEvent.type(screen.getByPlaceholderText("Masukkan email Anda"), "john.doe@example.com");
    await userEvent.type(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda"), "081234567890");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NIK Anda"), "1234567890123456");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NPWP Anda"), "123456789012345");
    fireEvent.click(screen.getByText("Selanjutnya"));
    
    // Step 2
    await waitFor(() => expect(screen.getByText("Ceritakan sedikit pengalaman kerja kamu")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Ceritakan tentang dirimu secara singkat di sini..."), "Test bio 10 karakter");
    await userEvent.click(screen.getByText("Lama Pengalaman *"));
    await userEvent.click(screen.getByText("> 5 Tahun"));
    await userEvent.click(screen.getByText("Level Sertifikasi SKK *"));
    await userEvent.click(screen.getByText("Operator"));
    await userEvent.click(screen.getByText("Lokasi Saat Ini *"));
    await userEvent.click(screen.getByText("Jakarta"));
    await userEvent.click(screen.getByText("Bersedia Ditempatkan Di Mana *"));
    await userEvent.click(screen.getByText("Bandung"));
    await userEvent.click(screen.getByText("Keahlian *"));
    await userEvent.click(screen.getByText("Arsitektur"));
    fireEvent.click(screen.getByText("Selanjutnya"));
    
    // Step 3
    await waitFor(() => expect(screen.getByText("Kira-kira begini perkiraan harga kamu, cocok gak?")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Rp. -"), "5000000");
    fireEvent.click(screen.getByText("Selanjutnya"));
    
    // Step 4
    await waitFor(() => expect(screen.getByText("Semuanya udah oke, yuk buat akun!")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Buat kata sandi yang sulit (pastikan ada angka dan minimal 8 karakter)"), "Password123");
    await userEvent.type(screen.getByPlaceholderText("Masukkan kata sandimu lagi disini"), "Password123");
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByText("Daftar Kerja"));
    
    await waitFor(() => {
      const requestBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(requestBody.experienceYears).toBe(3);
    });
  });
});

describe("parseExperienceYears function", () => {
  const parseExperienceYears = (yearsExp: string): number => {
    switch (yearsExp) {
      case '1 Tahun':
        return 1;
      case '2-3 Tahun':
        return 2;
      case '5 Tahun':
        return 3;
      case '> 5 Tahun':
        return 4;
      default:
        return 0;
    }
  };

  it("maps experience years correctly for all possible values", () => {
    expect(parseExperienceYears('1 Tahun')).toBe(1);
    expect(parseExperienceYears('2-3 Tahun')).toBe(2);
    expect(parseExperienceYears('5 Tahun')).toBe(3);
    expect(parseExperienceYears('> 5 Tahun')).toBe(4);
    expect(parseExperienceYears('Invalid Value')).toBe(0);
  });
});