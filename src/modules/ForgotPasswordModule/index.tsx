import { AuthBanner, Button, Input, Typography } from "@/components";

export const ForgotPasswordModule = () => {

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
                />
    
                <Input
                  data-testid="password-input"
                  name="password"
                  label="Kata Sandi"
                  placeholder="Masukkan kata sandi"
                />
              </div>
    
              <div className="mt-6">
                <Button
                  variant="primary"
                  className="w-full"
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
            <AuthBanner />
          </div>
        </div>
  );
};