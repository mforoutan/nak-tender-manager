"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperProps {
  steps: string[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full transition-colors bg-white shadow-md",
                  index < currentStep
                    ? "bg-green-500 text-primary-foreground"
                    : index === currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {index < currentStep ? (
                  <Check className="size-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  index < currentStep
                    ? "text-green-500"
                    : index === currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                    //  "text-muted-foreground"

                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5  border-1 border-dashed flex-1 transition-colors",
                  index < currentStep
                    ? "border-green-500"
                    : "border-muted-foreground/25"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}