import { AuthBanner, Button, Input, Typography } from "@/components";
import { resetPassword } from "@/services/ForgotPwService";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const MIN_PASSWORD_LENGTH = 6;

interface FormState {
  password: string;
  confirmPassword: string;
  errors: {
    pw?: string;
    confirmPw?: string;
  };
}

export const ResetPasswordModule = () => {
  const [formState, setFormState] = useState<FormState>({
    password: '',
    confirmPassword: '',
    errors: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: undefined,
      }
    }));
  };

  const validatePasswords = (): boolean => {
    const { password, confirmPassword } = formState;
    const errors: FormState["errors"] = {};

    if (password.length < MIN_PASSWORD_LENGTH) {
        errors.pw= `Password minimal ${MIN_PASSWORD_LENGTH} karakter`;
    }
    if (!confirmPassword) {
        errors.confirmPw= "Konfirmasi password harus diisi";
    } else if (password !== confirmPassword) {
        errors.confirmPw = "Password tidak cocok";
    }

    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({ ...prev, errors }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords() || isSubmitting || !token) return;

    setIsSubmitting(true);

    try {
      await resetPassword(token, formState.password.trim());
      // Success - redirect to login
      navigate('/login');
    } catch (error) {
      console.error("Gagal mereset password:", error);
      // Optionally, show user-facing error here
    } finally {
      setIsSubmitting(false);
    }
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
            Reset Kata Sandi
          </Typography>
          <form onSubmit={handleSubmit}>
            <Input
              name="password"
              type="password"
              label="Password Baru"
              data-testid="password-input"
              placeholder="Masukkan password baru"
              value={formState.password}
              onChange={handleChange}
              error={formState.errors.pw}
            />
            <Input
              name="confirmPassword"
              type="password"
              label="Konfirmasi Password"
              data-testid="confirm-password-input"
              placeholder="Konfirmasi password baru"
              value={formState.confirmPassword}
              onChange={handleChange}
              error={formState.errors.confirmPw}
              className="mt-4"
            />
            <div className="mt-6">
              <Button
                variant="primary"
                data-testid="submit-button"
                className={`w-full ${isSubmitting ? 'disabled' : ""}`}
                type="submit"
              >
                {isSubmitting ? 'MEMPROSES...' : 'RESET PASSWORD'}
              </Button>
            </div>
          </form>
        </div>
        {/* Right side - Banner */}
        <AuthBanner />
      </div>
    </div>
  );
};
