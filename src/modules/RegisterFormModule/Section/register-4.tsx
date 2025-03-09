import React, { ChangeEvent, useState, useEffect } from "react";
import { Typography, Stepper, Input } from "@/components";
import { RegisterFormData } from "@/lib/register";

interface StepFourFormProps {
  formData: RegisterFormData;
  updateFormData: (data: Partial<RegisterFormData>) => void;
  updateValidationStatus: (data: { step4Valid: boolean }) => void;
}

export const StepFourForm: React.FC<StepFourFormProps> = ({
  formData,
  updateFormData,
  updateValidationStatus,
}) => {
  const [errors, setErrors] = useState<{
    password?: string;
    passwordConfirmation?: string;
  }>({});

  const validatePassword = (password: string | undefined) => {
    if (!password) return "Kata sandi tidak boleh kosong";
    if (password.length < 8) return "Kata sandi minimal 8 karakter";
    if (!/[A-Z]/.test(password)) return "Kata sandi harus memiliki huruf kapital";
    if (!/[a-z]/.test(password)) return "Kata sandi harus memiliki huruf kecil";
    if (!/[0-9]/.test(password)) return "Kata sandi harus memiliki angka";
    if (/[ \t]/.test(password)) return "Kata sandi tidak boleh mengandung spasi";
    return "";
  };

  const validatePasswordMatch = (password: string | undefined, confirmation: string | undefined) => {
    if (!confirmation) return "Konfirmasi kata sandi tidak boleh kosong";
    if (password !== confirmation) return "Kata sandi tidak cocok";
    return "";
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    updateFormData({
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    const { password, passwordConfirmation, termsAndConditions } = formData;
    
    const passwordError = validatePassword(password);
    const confirmationError = validatePasswordMatch(password, passwordConfirmation);
    
    setErrors({
      password: password ? passwordError : undefined,
      passwordConfirmation: passwordConfirmation ? confirmationError : undefined,
    });

    const isValid = passwordError === "" && confirmationError === "" && termsAndConditions;

    updateValidationStatus({ step4Valid: !!isValid });
  }, [formData.password, formData.passwordConfirmation, formData.termsAndConditions, updateValidationStatus]);

  return (
    <div>
      <Typography variant="h5" className="text-center mb-4">
        Semuanya udah oke, yuk buat akun!
      </Typography>
      <Stepper currentStep={3} />
      <div className="space-y-6 mt-8 mb-4">
        <section>
          <div className="space-y-8">
            <Input
              name="password"
              label="Kata Sandi"
              placeholder="Buat kata sandi yang sulit (pastikan ada angka dan minimal 8 karakter)"
              type="password"
              value={formData.password || ''}
              onChange={handleInputChange}
              error={errors.password}
            />
            <Input
              name="passwordConfirmation"
              label="Konfirmasi Kata Sandi"
              placeholder="Masukkan kata sandimu lagi disini"
              type="password"
              value={formData.passwordConfirmation || ''}
              onChange={handleInputChange}
              error={errors.passwordConfirmation}
            />
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="termsAndConditions"
                name="termsAndConditions"
                checked={formData.termsAndConditions || false}
                onChange={handleInputChange}
                className="mt-1 accent-rencanakan-sea-blue-300"
              />
              <Typography variant="p4" className="ml-1.5">
                Dengan ini, saya menyatakan bahwa saya telah membaca dan menyetujui{" "}
                <a href="#" className="font-semibold underline">
                  Syarat dan Ketentuan
                </a>{" "}
                yang berlaku pada Rencanakan.id
              </Typography>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};