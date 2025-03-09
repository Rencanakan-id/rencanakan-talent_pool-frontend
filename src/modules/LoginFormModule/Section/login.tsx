// login.tsx - UI/Presentation component only
import { Typography, Input, Button } from "@/components";
import { ChangeEvent } from "react";
import { LoginFormData } from "@/lib/login";

interface LoginFormProps {
  formData: LoginFormData;
  updateFormData: (data: Partial<LoginFormData>) => void;
  isFormValid: boolean;
  handleLogin: () => void;
  emailError: string;
  passwordError: string;
}

export const LoginForm = ({ 
  formData, 
  updateFormData, 
  isFormValid, 
  handleLogin,
  emailError,
  passwordError
}: LoginFormProps) => {
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="flex min-h-screen w-full justify-center items-center bg-rencanakan-sea-blue-500">
      <div className="flex h-full w-full overflow-hidden rounded-none md:h-auto md:w-4/5 md:max-w-5xl md:rounded-xl shadow-lg">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 bg-rencanakan-pure-white p-8">
          <div className="mb-8">
            <img src="/rencanakanLogo.svg" alt="Rencanakan Logo" className="h-10" />
          </div>
          
          <Typography variant="h5" className="mb-6">
            Silahkan Masuk
          </Typography>
          
          <div className="space-y-4">
          <Input 
            name="email" 
            label="E-mail" 
            placeholder="Masukkan email Anda" 
            type="email"
            value={formData.email ?? ''} 
            onChange={handleInputChange} 
            error={emailError}
          />
            
          <Input 
            name="password" 
            label="Kata Sandi" 
            placeholder="Masukkan kata sandi" 
            type="password"
            value={formData.password ?? ''} 
            onChange={handleInputChange} 
            error={passwordError}
          />
          </div>
          
          <div className="mt-6">
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
            Belum punya akun?{" "}
            <a
                className="text-rencanakan-sea-blue-500 cursor-pointer hover:text-blue-700"
                href="/register"
                style={{ textDecoration: "underline" }}
            >
                DAFTAR
            </a>
          </Typography>
          </div>
        </div>
        
        {/* Right side - Banner */}
        <div className="hidden md:block md:w-1/2 bg-rencanakan-premium-gold-300 p-8">
            <div className="h-full flex flex-col justify-center">
                <Typography variant="h4" className="mb-4 text-white">
                    Selamat datang!!
                </Typography>
                <Typography variant="p1" className="text-white">
                    Talent Pool adalah fitur dari Rencanakan.id yang memungkinkan tenaga ahli 
                    di bidang konstruksi untuk mendaftar dan menunjukkan keterampilan mereka. 
                    Fitur ini memudahkan kontraktor dalam mencari dan merekrut talenta sesuai 
                    kebutuhan proyek mereka secara cepat dan efisien.
                </Typography>
                <Typography variant="p5" className="mt-4">
                    <a className="cursor-pointer text-white hover:text-blue-700"
                        href= 'https://rencanakan.id/about-us/'
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