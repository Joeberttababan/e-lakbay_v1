import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AuthMode = 'login' | 'signup';

export interface AuthFormState {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  remember: boolean;
}

export interface SupabaseSignInPayload {
  email: string;
  password: string;
}

export interface SupabaseSignUpPayload {
  email: string;
  password: string;
  options?: {
    data?: Record<string, string>;
  };
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const hasMinPasswordLength = (password: string, minLength = 8) => password.trim().length >= minLength;

export const validateAuthForm = (mode: AuthMode, form: AuthFormState): string | null => {
  if (!form.email.trim()) return 'Please enter your email address.';
  if (!form.password.trim()) return 'Please enter your password.';
  if (mode === 'signup') {
    if (!form.fullName.trim()) return 'Please enter your full name.';
    if (!form.confirmPassword.trim()) return 'Please confirm your password.';
    if (form.password.trim() !== form.confirmPassword.trim()) return 'Passwords do not match.';
  }
  if (!hasMinPasswordLength(form.password)) return 'Password must be at least 8 characters.';
  return null;
};

export const buildSupabaseSignInPayload = (form: AuthFormState): SupabaseSignInPayload => ({
  email: normalizeEmail(form.email),
  password: form.password.trim(),
});

export const buildSupabaseSignUpPayload = (form: AuthFormState): SupabaseSignUpPayload => {
  const fullName = form.fullName.trim();
  return {
    email: normalizeEmail(form.email),
    password: form.password.trim(),
    options: fullName ? { data: { full_name: fullName } } : undefined,
  };
};
