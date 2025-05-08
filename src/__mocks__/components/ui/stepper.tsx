interface StepperProps {
  currentStep: number;
}

export const mockStepper = ({ currentStep }: StepperProps) => (
  <div>{`Current step: ${currentStep}`}</div>
);