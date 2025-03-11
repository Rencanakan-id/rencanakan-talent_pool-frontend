import React, { ChangeEvent } from "react";
import { Typography, Stepper, Input } from "@/components";
import { RegisterFormData } from "@/lib/register";

interface StepFourFormProps {
  formData: RegisterFormData;
  updateFormData: (data: Partial<RegisterFormData>) => void;
  updateFormCompleteness: (isComplete: boolean) => void;
  validationErrors?: {
    password?: string;
    passwordConfirmation?: string;
  };
}

export const StepFourForm: React.FC<StepFourFormProps> = ({
  formData,
  updateFormData,
  validationErrors = {}, 
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    updateFormData({
      [name]: type === "checkbox" ? checked : value,
    });
  };

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
              error={validationErrors.password}
            />
            <Input
              name="passwordConfirmation"
              label="Konfirmasi Kata Sandi"
              placeholder="Masukkan kata sandimu lagi disini"
              type="password"
              value={formData.passwordConfirmation || ''}
              onChange={handleInputChange}
              error={validationErrors.passwordConfirmation}
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