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
        {steps.map((step, index) => {
          const isCompleted = index <= currentStep
          const isCurrent = index === currentStep
          const isLast = index === steps.length - 1

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    isCompleted && "bg-green-500 border-green-500 text-white",
                    isCurrent && !isCompleted && "border-primary bg-primary text-primary-foreground",
                    !isCurrent && !isCompleted && "border-gray-300 bg-white text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-2 text-xs text-center transition-colors",
                    (isCurrent || isCompleted) ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {step}
                </p>
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