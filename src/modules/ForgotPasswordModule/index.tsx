import { AuthBanner, Button, Input, Typography } from "@/components";
import { sendPasswordResetEmail } from "@/services/api";
import { useState } from "react";

interface FormState {
  email: string;
  errors: {
    email?: string;
  };
}

export const ForgotPasswordModule = () => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    errors: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: undefined, // Clear error when user types
      }
    }));
  };

  // 2. Validate email function
  const validateEmail = (email: string): boolean => {
    // Check if empty
    if (!email.trim()) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          email: 'Email harus diisi',
        }
      }));
      return false;
    }
    
    const trimmedEmail = email.trim();
    
    // More permissive regex that still avoids backtracking issues
    const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}(?:\.[^\s@]{1,63})+$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          email: 'Format email tidak valid',
        }
      }));
      return false;
    }
    
    return true;
  };

  // 3. Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const isValid = validateEmail(formState.email);
    if (!isValid) return;
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Call API to send password reset email
      await sendPasswordResetEmail(formState.email.trim());
      
      
      // Optionally redirect to login page after success
      // navigate('/login');
    } catch (error) {
      // Show error message
      console.error('Gagal mengirim email verifikasi. Silakan coba lagi.');
      console.error('Error sending reset email:', error);
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
            Lupa Kata Sandi
          </Typography>
          <form onSubmit={handleSubmit}>
            <Input
              data-testid="email-input"
              name="email"
              label="E-mail"
              placeholder="Masukkan email Anda"
              value={formState.email}
              onChange={handleChange}
              error={formState.errors.email}
            />
            <div className="mt-6">
              <Button
                variant="primary"
                className={`w-full ${isSubmitting ? 'disabled' : ""}`}
                data-testid="login-button"
                type="submit"
              >
                {isSubmitting ? 'MEMPROSES...' : 'VERIFIKASI'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center flex flex-row-reverse justify-between">
            <Typography variant="p4">
              Belum punya akun?{' '}
              <a
                className="text-rencanakan-sea-blue-500 cursor-pointer hover:text-blue-700 underline"
                href="/register"
              >
                Daftar
              </a>
            </Typography>
            <Typography variant="p4">
              Sudah punya akun?{' '}
              <a
                className="text-rencanakan-sea-blue-500 cursor-pointer hover:text-blue-700 underline"
                href="/login"
              >
                Masuk
              </a>
            </Typography>
          </div>
        </div>
        {/* Right side - Banner */}
        <AuthBanner />
      </div>
    </div>
  );
};