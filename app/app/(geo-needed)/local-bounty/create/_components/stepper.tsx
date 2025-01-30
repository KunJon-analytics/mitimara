import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { formSteps, FormStep } from "@/lib/validations/local-bounty/create";

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: FormStep;
}

export const Stepper = ({ currentStep, className, ...props }: StepperProps) => {
  const currentStepIndex = formSteps.findIndex((i) => i === currentStep);
  return (
    <div className={cn("flex items-center", className)} {...props}>
      {formSteps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2",
                index < currentStepIndex
                  ? "border-primary bg-primary text-primary-foreground"
                  : index === currentStepIndex
                  ? "border-primary text-primary"
                  : "border-muted-foreground text-muted-foreground"
              )}
            >
              {index < currentStepIndex ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-sm capitalize",
                index <= currentStepIndex
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
          {index < formSteps.length - 1 && (
            <div
              className={cn(
                "h-[2px] flex-1",
                index < currentStepIndex ? "bg-primary" : "bg-muted-foreground"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
