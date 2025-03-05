import React from 'react';
import { CheckIcon } from './check-icon';

interface StepperProps {
  currentStep: number;
}

const getStepClass = (index: number, currentStep: number) => {
  if (index < currentStep) return 'bg-rencanakan-success-green-25 text-rencanakan-success-green-100';
  if (index === currentStep) return 'bg-rencanakan-success-green-25 text-rencanakan-main-black';
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
              <CheckIcon />
            ) : (
              step
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-grow h-1 ${index < currentStep ? 'bg-rencanakan-success-green-25' : 'bg-rencanakan-light-gray'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export { Stepper };
