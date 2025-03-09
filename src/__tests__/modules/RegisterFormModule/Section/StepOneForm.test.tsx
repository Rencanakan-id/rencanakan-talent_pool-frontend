import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepOneForm } from "../../../../modules/RegisterFormModule/Section/register-1";
import "@testing-library/jest-dom";

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

  test("calls updateFormData when typing in input fields", async () => {
    await userEvent.type(screen.getByPlaceholderText("Nama Depan"), "Fernando");
    expect(mockUpdateFormData).toHaveBeenCalledWith({ firstName: "Fernando" });

    await userEvent.type(screen.getByPlaceholderText("Nama Belakang"), "Valentino");
    expect(mockUpdateFormData).toHaveBeenCalledWith({ lastName: "Valentino" });

    await userEvent.type(screen.getByPlaceholderText("Masukkan email Anda"), "fernando@example.com");
    expect(mockUpdateFormData).toHaveBeenCalledWith({ email: "fernando@example.com" });

  });


});
