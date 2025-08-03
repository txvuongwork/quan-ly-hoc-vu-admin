import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateWithDateFns(date: string | Date, type: string) {
  return format(date, type);
}

export const convertISOToDateString = (isoString: string): string => {
  const date = parseISO(isoString);
  return format(date, "yyyy-MM-dd");
};
