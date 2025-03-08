import { render, screen, fireEvent } from "@testing-library/react";
import { StepOneForm } from "./register-1";
import "@testing-library/jest-dom";
// import { RegisterFormData } from "@/lib/register";

describe("StepOneForm", () => {
  let mockUpdateFormData: jest.Mock;

  beforeEach(() => {
    mockUpdateFormData = jest.fn();
    render(
      <StepOneForm
        formData={{
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          nik: "",
          npwp: "",
          ktpFile: null,
          npwpFile: null,
          diplomaFile: null,
          address: "",
          city: "",
          price: "",
        }}
        updateFormData={mockUpdateFormData}
      />
    );
  });

  test("renders form fields correctly", () => {
    expect(screen.getByPlaceholderText("Nama Depan")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nama Belakang")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Masukkan email Anda")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Masukkan nomor WhatsApp Anda")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Masukkan NIK Anda")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Masukkan NPWP Anda")).toBeInTheDocument();
  });

  test("calls updateFormData when typing in input fields", () => {
    fireEvent.change(screen.getByPlaceholderText("Nama Depan"), {
      target: { value: "Fernando" },
    });
    expect(mockUpdateFormData).toHaveBeenCalledWith({ firstName: "Fernando" });

    fireEvent.change(screen.getByPlaceholderText("Nama Belakang"), {
      target: { value: "Valentino" },
    });
    expect(mockUpdateFormData).toHaveBeenCalledWith({ lastName: "Valentino" });

    fireEvent.change(screen.getByPlaceholderText("Masukkan email Anda"), {
      target: { value: "fernando@example.com" },
    });
    expect(mockUpdateFormData).toHaveBeenCalledWith({ email: "fernando@example.com" });
  });

  test("displays file inputs correctly", () => {
    expect(screen.getByText("Foto KTP")).toBeInTheDocument();
    expect(screen.getByText("Foto NPWP")).toBeInTheDocument();
    expect(screen.getByText("Scan Ijazah")).toBeInTheDocument();
  });

  test("calls updateFormData when uploading files", () => {
    const file = new File(["dummy content"], "ktp.jpg", { type: "image/jpeg" });

    fireEvent.change(screen.getByLabelText("Foto KTP"), {
      target: { files: [file] },
    });

    expect(mockUpdateFormData).toHaveBeenCalledWith({ ktpFile: file });
  });

  test("does not allow submission if required fields are empty", () => {
    const nextButton = screen.getByText("Selanjutnya");
    expect(nextButton).toBeDisabled();
  });
});
