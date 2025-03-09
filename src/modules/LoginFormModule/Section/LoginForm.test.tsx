import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "./login";
import { faker } from "@faker-js/faker";
import "@testing-library/jest-dom";

const randomPassword = faker.internet.password();

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
        emailError=""
        passwordError=""
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
    expect(mockUpdateFormData).toHaveBeenCalledWith(expect.objectContaining({ email: "test@example.com" }));

    fireEvent.change(screen.getByPlaceholderText("Masukkan kata sandi"), {
      target: { value: randomPassword },
    });
    expect(mockUpdateFormData).toHaveBeenCalledWith(expect.objectContaining({ password: randomPassword }));
  });

  test("login button is disabled when form is invalid", () => {
    const loginButton = screen.getByTestId("login-button");
    expect(loginButton).toBeDisabled();
  });
});

describe("LoginForm - Valid Form", () => {
  let mockUpdateFormData: jest.Mock;
  let mockHandleLogin: jest.Mock;

  beforeEach(() => {
    mockUpdateFormData = jest.fn();
    mockHandleLogin = jest.fn();

    render(
      <LoginForm
        formData={{ email: "user@example.com", password: randomPassword }}
        updateFormData={mockUpdateFormData}
        isFormValid={true}
        handleLogin={mockHandleLogin}
        emailError=""
        passwordError=""
      />
    );
  });

  test("calls handleLogin when login button is clicked", () => {
    const loginButton = screen.getByTestId("login-button");
    expect(loginButton).toBeInTheDocument();
    fireEvent.click(loginButton);
    expect(mockHandleLogin).toHaveBeenCalled();
  });
});
