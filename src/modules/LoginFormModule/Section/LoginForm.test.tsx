import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "./login";
import "@testing-library/jest-dom";

describe("LoginForm", () => {
  let mockUpdateFormData: jest.Mock;
  let mockHandleLogin: jest.Mock;

  beforeEach(() => {
    mockUpdateFormData = jest.fn();
    mockHandleLogin = jest.fn();

    render(
      <LoginForm
        formData={{ email: "", password: "" }}
        updateFormData={mockUpdateFormData}
        isFormValid={false}
        handleLogin={mockHandleLogin}
      />
    );
  });

  test("renders input fields correctly", () => {
    expect(screen.getByPlaceholderText("Masukkan email Anda")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Masukkan kata sandi")).toBeInTheDocument();
  });

  test("calls updateFormData when typing in input fields", () => {
    fireEvent.change(screen.getByPlaceholderText("Masukkan email Anda"), {
      target: { value: "test@example.com" },
    });
    expect(mockUpdateFormData).toHaveBeenCalledWith({ email: "test@example.com" });

    fireEvent.change(screen.getByPlaceholderText("Masukkan kata sandi"), {
      target: { value: "password123" },
    });
    expect(mockUpdateFormData).toHaveBeenCalledWith({ password: "password123" });
  });

  test("login button is disabled when form is invalid", () => {
    const loginButton = screen.getByText("MASUK");
    expect(loginButton).toBeDisabled();
  });

  test("calls handleLogin when login button is clicked", () => {
    render(
      <LoginForm
        formData={{ email: "user@example.com", password: "securePass" }}
        updateFormData={mockUpdateFormData}
        isFormValid={true}
        handleLogin={mockHandleLogin}
      />
    );

    const loginButton = screen.getByText("MASUK");
    fireEvent.click(loginButton);
    expect(mockHandleLogin).toHaveBeenCalled();
  });
});
