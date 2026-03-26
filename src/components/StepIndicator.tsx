import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = ['Investment Type', 'Risk Profile', 'AI Advisor'];

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {steps.map((label, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'gradient-primary text-primary-foreground'
                    : isActive
                    ? 'gradient-primary text-primary-foreground shadow-glow'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step}
              </div>
              <span
                className={`hidden text-sm font-medium sm:block ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-8 sm:w-12 ${
                  isCompleted ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
