"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn, toPersianNumbers } from "@/lib/utils"

interface StepperProps {
  steps: string[]
  currentStep: number
  showLabelMobile?: boolean
  className?: string
  lastStepVariant?: 'default' | 'large' // New prop for customizing last step
}

export function Stepper({ steps, currentStep, showLabelMobile = true, className, lastStepVariant = 'default' }: StepperProps) {

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isLast = index === steps.length - 1
          const isLargeVariant = isLast && lastStepVariant === 'large'

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full shadow-md border-2 transition-colors",
                    isLargeVariant ? "p-4" : "w-10 h-10",
                    isCompleted && "bg-green-500 border-green-500 text-white",
                    isCurrent && !isCompleted && "border-transparent bg-green-100 text-black",
                    !isCurrent && !isCompleted && "border-transparent bg-white text-muted-foreground"
                  )}
                >
                  {isLargeVariant ? (
                    <div className="relative bg-[#D9D9D9] rounded-full p-3.5">
                      <div className="absolute top-0 right-0 size-5 flex justify-center items-center bg-[#71717A] mask-[url('/icons/badge-shape.svg')]">
                        <img className="z-10 w-0.5" src="/icons/exclamation-mark.png" />
                      </div>

                      <svg className="fill-[#B2B2B2]" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 16.0002C16 17.5824 16.4692 19.1292 17.3483 20.4448C18.2273 21.7604 19.4768 22.7858 20.9386 23.3913C22.4004 23.9968 24.009 24.1552 25.5608 23.8465C27.1127 23.5378 28.5382 22.7759 29.657 21.6571C30.7758 20.5382 31.5377 19.1128 31.8464 17.5609C32.1551 16.009 31.9967 14.4005 31.3912 12.9387C30.7857 11.4768 29.7603 10.2274 28.4447 9.34835C27.1291 8.46929 25.5823 8.00009 24.0001 8.00009C21.8783 8.00009 19.8435 8.84295 18.3432 10.3433C16.8429 11.8436 16 13.8784 16 16.0002V16.0002Z" />
                        <rect x="12" y="28.0003" width="24.0002" height="12.0001" rx="6.00006" />
                      </svg>
                    </div>
                  ) : isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : isCurrent && isLast && isLargeVariant ? (
                    <div className="relative bg-[#DFFFE7] rounded-full p-3.5">
                      <div className="absolute top-0 right-0 size-5 flex justify-center items-center bg-[#34C759] mask-[url('/icons/badge-shape.svg')]">
                        <img className="z-10 w-0.5" src="/icons/exclamation-mark.png" />
                      </div>

                      <svg className="fill-[#34C759]" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 16.0002C16 17.5824 16.4692 19.1292 17.3483 20.4448C18.2273 21.7604 19.4768 22.7858 20.9386 23.3913C22.4004 23.9968 24.009 24.1552 25.5608 23.8465C27.1127 23.5378 28.5382 22.7759 29.657 21.6571C30.7758 20.5382 31.5377 19.1128 31.8464 17.5609C32.1551 16.009 31.9967 14.4005 31.3912 12.9387C30.7857 11.4768 29.7603 10.2274 28.4447 9.34835C27.1291 8.46929 25.5823 8.00009 24.0001 8.00009C21.8783 8.00009 19.8435 8.84295 18.3432 10.3433C16.8429 11.8436 16 13.8784 16 16.0002V16.0002Z" />
                        <rect x="12" y="28.0003" width="24.0002" height="12.0001" rx="6.00006" />
                      </svg>
                    </div>
                  ) : (
                    <span className="text-sm font-medium">{toPersianNumbers((index + 1).toString())}</span>
                  )}
                </div>
                {showLabelMobile && !isLargeVariant && (
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