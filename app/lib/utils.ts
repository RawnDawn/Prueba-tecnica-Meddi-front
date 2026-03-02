import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate time left between now and a specific date
 * @param date 
 * @returns 
 */
export function calculateTimeLeft(date: string | Date) {
  const now = new Date();
  const due = new Date(date);
  const diffMs = due.getTime() - now.getTime();

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return days > 0 ? `${days} día${days > 1 ? "s" : ""}` :
    hours > 0 ? `${hours} hora${hours > 1 ? "s" : ""}` :
      `${minutes} minuto${minutes > 1 ? "s" : ""}`;
}