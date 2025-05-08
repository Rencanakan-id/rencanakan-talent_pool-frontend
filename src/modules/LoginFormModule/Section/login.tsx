// login.tsx - UI/Presentation component only
import { Typography, Input, Button } from '@/components';
import { ChangeEvent } from 'react';
import { LoginFormData } from '@/lib/login';

interface LoginFormProps {
  formData: LoginFormData;
  updateFormData: (data: Partial<LoginFormData>) => void;
  isFormValid: boolean;
  handleLogin: () => void;
  emailError: string;
  commentError: string;
}

export const LoginForm = ({
  formData,
  updateFormData,
  isFormValid,
  handleLogin,
  emailError,
  commentError,
}: LoginFormProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="bg-rencanakan-sea-blue-500 flex min-h-screen w-full items-center justify-center">
      <div className="flex h-full w-full overflow-hidden rounded-none shadow-lg md:h-auto md:w-4/5 md:max-w-5xl md:rounded-xl">
        {/* Left side - Form */}
        <div className="bg-rencanakan-pure-white w-full p-8 md:w-1/2">
          <div className="mb-8">
            <img src="/rencanakanLogo.svg" alt="Rencanakan Logo" className="h-10" />
          </div>

          <Typography variant="h5" className="mb-6">
            Masuk
          </Typography>

          <div className="space-y-4">
            <Input
              data-testid="email-input"
              name="email"
              label="E-mail"
              placeholder="Masukkan email Anda"
              type="email"
              value={formData.email ?? ''}
              onChange={handleInputChange}
              error={emailError}
              data-error={emailError} // Add this line
            />

            <Input
              data-testid="password-input"
              name="password"
              label="Kata Sandi"
              placeholder="Masukkan kata sandi"
              type="password"
              value={formData.password ?? ''}
              onChange={handleInputChange}
              error={commentError}
              data-error={commentError} // Add this line
            />
          </div>

          <Typography variant="p4" className="mt-2 text-rencanakan-sea-blue-500">
            <a href="/forgot-password" className="hover:text-blue-700 text-blue-500">
              Lupa kata sandi?
            </a>
          </Typography>

          <div className="mt-4">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleLogin}
              disabled={!isFormValid}
              data-testid="login-button"
            >
              MASUK
            </Button>
          </div>
          <div className="mt-4 text-center">
            <Typography variant="p4">
              Belum punya akun?{' '}
              <a
                className="text-rencanakan-sea-blue-500 cursor-pointer hover:text-blue-700"
                href="/register"
                style={{ textDecoration: 'underline' }}
              >
                Daftar di sini
              </a>
            </Typography>
          </div>
        </div>

        {/* Right side - Banner */}
        <div className="bg-rencanakan-premium-gold-300 hidden p-8 md:block md:w-1/2">
          <div className="flex h-full flex-col justify-center">
            <Typography variant="h4" className="mb-4 text-white">
              Selamat datang!
            </Typography>
            <Typography variant="p2" className="text-white">
              Talent Pool adalah fitur dari Rencanakan.id yang memungkinkan tenaga ahli di bidang
              konstruksi untuk mendaftar dan menunjukkan keterampilan mereka. Fitur ini memudahkan
              kontraktor dalam mencari dan merekrut talenta sesuai kebutuhan proyek mereka secara
              cepat dan efisien.
            </Typography>
            <Typography variant="p5" className="mt-4">
              <a
                className="cursor-pointer text-white hover:text-blue-700"
                href="https://rencanakan.id/about-us/"
              >
                Pelajari lebih lanjut
              </a>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
