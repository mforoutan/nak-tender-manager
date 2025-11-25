import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPersianNumbers(str: string | number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const strValue = typeof str === 'number' ? str.toString() : str;
  return strValue.replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("fa-IR");
}

export function formatDate(dateStr: string): string {
  // desired format: 
  // چهارشنبه، ۲۹ مرداد ۱۴۰۵ ساعت ۱۷:۰۰
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  // formatter yields something like: "چهارشنبه، ۲۹ مرداد ۱۴۰۵، ۱۷:۰۰"
  // replace the final comma before the time with " ساعت "
  const formatted = formatter.format(date);
  return formatted.replace(/،\s*([^،]+)$/, " ساعت $1");
}