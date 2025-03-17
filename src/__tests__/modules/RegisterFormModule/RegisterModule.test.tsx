import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterModule } from "@/modules/RegisterFormModule";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';

describe("Registration Page", () => {
  it("renders the first step correctly", () => {
    render(<RegisterModule />);
    expect(screen.getByText("Lengkapi formulir dan mulai perjalanan karier kamu!")).toBeInTheDocument();
  });

  it("fills out the first step and proceeds", async () => {
    render(<RegisterModule />);
    
    await userEvent.type(screen.getByLabelText("Nama Depan *"), "John");
    await userEvent.type(screen.getByLabelText("Nama Belakang *"), "Doe");
    await userEvent.type(screen.getByLabelText("Email *"), "john.doe@example.com");
    await userEvent.type(screen.getByLabelText("Nomor Telepon *"), "081234567890");
    await userEvent.type(screen.getByLabelText("No. NIK *"), "1234567890123456");
    await userEvent.type(screen.getByLabelText("No. NPWP *"), "123456789012345");
    
    fireEvent.click(screen.getByText("Lanjut"));

    await waitFor(() => expect(screen.getByText("Ceritakan sedikit pengalaman kerja kamu")).toBeInTheDocument());
  });

  it("completes all steps and submits", async () => {
    render(<RegisterModule />);
    
    // Fill Step 1
    await userEvent.type(screen.getByLabelText("Nama Depan *"), "John");
    await userEvent.type(screen.getByLabelText("Nama Belakang *"), "Doe");
    await userEvent.type(screen.getByLabelText("Email *"), "john.doe@example.com");
    await userEvent.type(screen.getByLabelText("Nomor Telepon *"), "081234567890");
    await userEvent.type(screen.getByLabelText("No. NIK *"), "1234567890123456");
    await userEvent.type(screen.getByLabelText("No. NPWP *"), "123456789012345");
    fireEvent.click(screen.getByText("Lanjut"));

    // Step 2
    await waitFor(() => screen.getByText("Ceritakan sedikit pengalaman kerja kamu"));
    await userEvent.type(screen.getByLabelText("Tentang Saya *"), "Saya seorang developer berpengalaman.");
    fireEvent.click(screen.getByText("Lanjut"));
    
    // Step 3
    await waitFor(() => screen.getByText("Kira-kira begini perkiraan harga kamu, cocok gak?"));
    await userEvent.type(screen.getByLabelText("Tentukan Harga Kamu *"), "5000000");
    fireEvent.click(screen.getByText("Lanjut"));
    
    // Step 4
    await waitFor(() => screen.getByText("Semuanya udah oke, yuk buat akun!"));
    await userEvent.type(screen.getByLabelText("Kata Sandi *"), "password123");
    await userEvent.type(screen.getByLabelText("Konfirmasi Kata Sandi *"), "password123");
    fireEvent.click(screen.getByLabelText("Syarat dan Ketentuan"));
    fireEvent.click(screen.getByText("Selesai"));

    // Expect form submission
    await waitFor(() => expect(screen.getByText("Registrasi Berhasil!")).toBeInTheDocument());
  });
});
