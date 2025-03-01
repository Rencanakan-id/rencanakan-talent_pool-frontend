'use client'
import { Typography, Stepper, Input, Button } from "@/components";
import { useState } from "react";
import { StepOneForm } from "./register-1";

export const RegisterModule = () => {
  const [formState, setFormState] = useState(1);

  const handleNext = () => {
    setFormState(prev => Math.min(prev + 1, 4));
  };

  return (
    <div className="flex min-h-screen w-full justify-center items-center bg-rencanakan-sea-blue-500 pt-12 md:py-12">
      <div className="flex h-screen md:h-full flex-col justify-center bg-rencanakan-pure-white rounded-t-xl md:rounded-xl drop-shadow-md md:max-w-2xl mx-auto py-6 px-8">
        {formState === 1 ? (
          <StepOneForm />
        ) : (
          <>
            <Typography variant="h5" className="text-center">
              Lengkapi formulir dan mulai perjalanan karier kamu!
            </Typography>
            
            <div className="my-4 mx-4 justify-center items-center">
              <Stepper currentStep={formState - 1} />
            </div>

            {formState === 2 && (
              <div className="my-4">
                <Typography variant="h6" className="mb-4">Step 2 Content</Typography>
                {/* Add your step 2 form fields here */}
                <div className="space-y-4">
                  <Input 
                    label="Alamat" 
                    placeholder="Alamat lengkap" 
                  />
                  <Input 
                    label="Kota" 
                    placeholder="Kota" 
                  />
                  {/* Add more fields as needed */}
                </div>
              </div>
            )}

            {formState === 3 && (
              <div className="my-4">
                <Typography variant="h6" className="mb-4">Step 3 Content</Typography>
                {/* Add your step 3 form fields here */}
              </div>
            )}

            {formState === 4 && (
              <div className="my-4">
                <Typography variant="h6" className="mb-4">Step 4 Content</Typography>
                {/* Add your step 4 form fields here */}
              </div>
            )}
          </>
        )}

        <div className="flex justify-end mt-4">
          {formState > 1 && (
            <Button 
              variant="secondary" 
              onClick={() => setFormState(prev => Math.max(prev - 1, 1))}
            >
              Kembali
            </Button>
          )}
          <Button 
            variant="primary" 
            onClick={handleNext}
          >
            {formState === 4 ? "Selesai" : "Selanjutnya"}
          </Button>
        </div>
      </div>
    </div>
  );
};