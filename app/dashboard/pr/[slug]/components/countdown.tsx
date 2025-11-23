"use client"

import { useEffect, useState } from "react"
import { toPersianNumbers } from "@/lib/utils"

interface CountdownProps {
  targetDate: Date | string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const target = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex flex-row-reverse gap-10 justify-center items-center text-white">
      <div className="w-10 flex flex-col items-center">
        <div className="text-4xl font-extrabold">{toPersianNumbers(String(timeLeft.days))}</div>
        <div className="text-sm font-bold">روز</div>
      </div>
      <div className="w-10 flex flex-col items-center">
        <div className="text-4xl font-extrabold">{toPersianNumbers(String(timeLeft.hours))}</div>
        <div className="text-sm font-bold">ساعت</div>
      </div>
      <div className="w-10 flex flex-col items-center">
        <div className="text-4xl font-extrabold">{toPersianNumbers(String(timeLeft.minutes))}</div>
        <div className="text-sm font-bold">دقیقه</div>
      </div>
      <div className="w-10 flex flex-col items-center">
        <div className="text-4xl font-extrabold">{toPersianNumbers(String(timeLeft.seconds))}</div>
        <div className="text-sm font-bold">ثانیه</div>
      </div>
    </div>
  )
}
