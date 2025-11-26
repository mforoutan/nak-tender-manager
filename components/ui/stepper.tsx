"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn, toPersianNumbers } from "@/lib/utils"

interface StepperProps {
  steps: string[]
  currentStep: number
  showLabelMobile?: boolean
  className?: string
}

export function Stepper({ steps, currentStep, showLabelMobile = true, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isLast = index === steps.length - 1

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full shadow-md border-2 transition-colors",
                    isCompleted && "bg-green-500 border-green-500 text-white",
                    isCurrent && !isCompleted && "border-transparent bg-green-100 text-black",
                    !isCurrent && !isCompleted && "border-transparent bg-white text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{toPersianNumbers((index + 1).toString())}</span>
                  )}
                </div>
                {showLabelMobile && (
                  <p
                    className={cn(
                      "hidden lg:block mt-2 font-bold text-xs text-center transition-colors",
                      isCompleted ? "text-green-500" : isCurrent ? "text-black" : "text-muted-foreground"
                    )}
                  >
                    {step}
                  </p>
                )}
              </div>

              {!isLast && (
                <div
                  className={cn(
                    "h-0.5 border border-dashed flex-1 mx-2 transition-colors",
                    isCompleted ? "border-green-500" : "border-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}