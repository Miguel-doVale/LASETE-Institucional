import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function safeUrl(value: string, allowEmail = false): string | undefined {
  if (!value) return undefined;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || (allowEmail && u.protocol === 'mailto:')
      ? u.href
      : undefined;
  } catch {
    return undefined;
  }
}
