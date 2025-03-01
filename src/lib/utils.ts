import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that combines clsx and tailwind-merge.
 * It allows you to conditionally apply Tailwind CSS classes and
 * automatically resolves class conflicts.
 * 
 * @param inputs - The class values to be combined
 * @returns A string of merged Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
