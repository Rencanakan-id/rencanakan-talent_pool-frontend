import React from 'react';
import clsx from 'clsx';
import { CheckIcon } from './check-icon';

interface StepperProps {
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = [1, 2, 3, 4];

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div 
            className={clsx(
              'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-semibold z-10',
              {
                'bg-rencanakan-success-green-25 text-rencanakan-success-green-100': index < currentStep,
                'bg-rencanakan-success-green-25 text-rencanakan-main-black': index === currentStep,
                'bg-rencanakan-light-gray text-rencanakan-main-black': index > currentStep
              }
            )}
          >
            {index < currentStep ? (
              <CheckIcon />
            ) : (
              step
            )}
          </div>
          {index < steps.length - 1 && (
            <div 
              className={clsx(
                'flex-grow h-1', 
                index < currentStep 
                  ? 'bg-rencanakan-success-green-25' 
                  : 'bg-rencanakan-light-gray'
              )}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export { Stepper };