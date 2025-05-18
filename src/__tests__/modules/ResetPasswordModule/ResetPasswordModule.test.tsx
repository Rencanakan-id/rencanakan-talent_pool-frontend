import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ResetPasswordModule } from '@/modules';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as ForgotPwService from "@/services/ForgotPwService";

// Mock the resetPassword function
jest.mock("@/services/ForgotPwService", () => ({
  resetPassword: jest.fn(),
}));

// Helper to render with token in URL
const renderWithToken = (token = "mock-token") => {
  return render(
    <MemoryRouter initialEntries={[`/reset-password?token=${token}`]}>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordModule />} />
        <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ResetPasswordModule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows validation errors when inputs are empty", async () => {
    renderWithToken();

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    expect(await screen.findByText("Password minimal 6 karakter")).toBeInTheDocument();
    expect(await screen.findByText("Konfirmasi password harus diisi")).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    renderWithToken();

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("confirm-password-input"), {
      target: { value: "differentPassword" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    expect(await screen.findByText("Password tidak cocok")).toBeInTheDocument();
  });

  it("submits successfully and navigates to login page", async () => {
    (ForgotPwService.resetPassword as jest.Mock).mockResolvedValueOnce(undefined);

    renderWithToken();

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("confirm-password-input"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(ForgotPwService.resetPassword).toHaveBeenCalledWith("mock-token", "password123");
    });

    expect(await screen.findByTestId("login-page")).toBeInTheDocument();
  });

  it("does not submit if token is missing", async () => {
    render(
      <MemoryRouter initialEntries={[`/reset-password`]}>
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordModule />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("confirm-password-input"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(ForgotPwService.resetPassword).not.toHaveBeenCalled();
    });
  });
});
