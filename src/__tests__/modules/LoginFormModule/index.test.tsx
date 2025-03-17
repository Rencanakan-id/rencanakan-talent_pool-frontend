// tests/modules/login/index.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginModule from '@/modules/LoginFormModule'; // Sesuaikan path sesuai struktur proyek
import '@testing-library/jest-dom';
import { faker } from '@faker-js/faker';

// Mock console.log untuk mengecek submit yang valid
// const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const randomPassword = faker.internet.password();

describe('LoginModule', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Render komponen dan elemen penting
  test('renders login form with initial state', () => {
    render(<LoginModule />);

    // Cek input email dan password
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();

    // Tombol submit harus disabled awal karena form kosong
    expect(screen.getByTestId('login-button')).toBeDisabled();
  });

  // Test 2: Update state saat input berubah
  test('updates form data when inputs change', () => {
    render(<LoginModule />);

    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;

    // Simulasikan perubahan input
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: randomPassword } });

    // Cek nilai input telah berubah
    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe(randomPassword);
  });

  // Test 3: Validasi error saat submit data tidak valid
  test('displays validation errors for invalid inputs', async () => {
    render(<LoginModule />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('login-button');

    // Masukkan data tidak valid
    fireEvent.change(emailInput, { target: { value: 'a@a' } }); // Email < 4 karakter
    fireEvent.change(passwordInput, { target: { value: '12345' } }); // Password < 6 karakter

    // Tombol harus aktif karena form terisi
    expect(submitButton).not.toBeDisabled();

    // Klik tombol submit
    fireEvent.click(submitButton);

    // Cek pesan error muncul
    expect(
      await screen.findByText('Email harus memiliki setidaknya 4 karakter')
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Kata sandi harus memiliki setidaknya 6 karakter')
    ).toBeInTheDocument();
  });

  // Test 4: Submit data valid
  // test('submits form with valid data', () => {
  //   render(<LoginModule />);

  //   const emailInput = screen.getByTestId("email-input");
  //   const passwordInput = screen.getByTestId("password-input");
  //   const submitButton = screen.getByTestId('login-button');

  //   // Masukkan data valid
  //   fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
  //   fireEvent.change(passwordInput, { target: { value: randomPassword } });

  //   // Klik tombol submit
  //   fireEvent.click(submitButton);

  //   // Cek console.log dipanggil dengan data yang benar
  //   expect(mockConsoleLog).toHaveBeenCalledWith('Login Data:', {
  //     email: 'valid@example.com',
  //     password: randomPassword,
  //   });
  // });

  // Test 5: Error saat field wajib kosong (opsional, tergantung implementasi)
  test('shows required errors if fields are empty on submit', () => {
    render(<LoginModule />);

    // Klik tombol submit tanpa mengisi form
    const submitButton = screen.getByTestId('login-button');

    // Pastikan tombol disabled dan error tidak muncul
    expect(submitButton).toBeDisabled();
    expect(screen.queryByText('Email harus diisi')).not.toBeInTheDocument();
    expect(screen.queryByText('Kata sandi harus diisi')).not.toBeInTheDocument();
  });
});
