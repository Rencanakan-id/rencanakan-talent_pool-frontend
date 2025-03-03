import React from 'react';

interface StepperProps {
  currentStep: number;
}

const getStepClass = (index: number, currentStep: number) => {
  if (index < currentStep) return 'bg-[#3E884F40] text-[#3E884F]';
  if (index === currentStep) return 'bg-[#3E884F40] text-rencanakan-main-black';
  return 'bg-rencanakan-light-gray text-rencanakan-main-black';
};

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = [1, 2, 3, 4];

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-semibold z-10 ${getStepClass(index, currentStep)}`}>
            {index < currentStep ? (
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#3E884F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-grow h-1 ${index < currentStep ? 'bg-[#3E884F40]' : 'bg-rencanakan-light-gray'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export { Stepper };
