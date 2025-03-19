import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterModule } from "@/modules/RegisterFormModule";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.HTMLElement.prototype.scrollIntoView = jest.fn();

describe("Registration Page Positive Case", () => {
  it("renders the first step correctly", () => {
    render(<RegisterModule />);
    expect(screen.getByText("Lengkapi formulir dan mulai perjalanan karier kamu!")).toBeInTheDocument();
  });

  it("fills out the first step and proceeds", async () => {
    render(<RegisterModule />);
    
    await userEvent.type(screen.getByPlaceholderText("Nama Depan"), "John");
    await userEvent.type(screen.getByPlaceholderText("Nama Belakang"), "Doe");
    await userEvent.type(screen.getByPlaceholderText("Masukkan email Anda"), "john.doe@example.com");
    await userEvent.type(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda"), "081234567890");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NIK Anda"), "1234567890123456");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NPWP Anda"), "123456789012345");
    
    fireEvent.click(screen.getByText("Selanjutnya"));

    await waitFor(() => expect(screen.getByText("Ceritakan sedikit pengalaman kerja kamu")).toBeInTheDocument());
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

  it("completes all steps and submits", async () => {
    render(<RegisterModule />);
    
    // Fill Step 1
    await userEvent.type(screen.getByPlaceholderText("Nama Depan"), "John");
    await userEvent.type(screen.getByPlaceholderText("Nama Belakang"), "Doe");
    await userEvent.type(screen.getByPlaceholderText("Masukkan email Anda"), "john.doe@example.com");
    await userEvent.type(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda"), "081234567890");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NIK Anda"), "1234567890123456");
    await userEvent.type(screen.getByPlaceholderText("Masukkan NPWP Anda"), "123456789012345");
    
    fireEvent.click(screen.getByText("Selanjutnya"));

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

    await waitFor(() => expect(screen.getByText("Kira-kira begini perkiraan harga kamu, cocok gak?")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Rp. -"), "5000000");
    fireEvent.click(screen.getByText("Selanjutnya"));
    
    await waitFor(() => expect(screen.getByText("Semuanya udah oke, yuk buat akun!")).toBeInTheDocument());
    await userEvent.type(screen.getByPlaceholderText("Buat kata sandi yang sulit (pastikan ada angka dan minimal 8 karakter)"), "password123");
    await userEvent.type(screen.getByPlaceholderText("Masukkan kata sandimu lagi disini"), "password123");
    fireEvent.click(screen.getByRole("checkbox"));
    await waitFor(() => {
      expect(screen.getByText("Daftar Kerja")).not.toBeDisabled();
    });
  });
});
