import React, { useEffect, useMemo, useState } from 'react';
import { useModal } from './ModalContext';
import { Button } from './modern-ui/button';
import {
  buildSupabaseSignInPayload,
  buildSupabaseSignUpPayload,
  type AuthFormState,
  type AuthMode,
  validateAuthForm,
} from '../lib/utils';

interface GlobalModalProps {
  onAuthSubmit?: (payload: unknown, mode: AuthMode) => void | Promise<void>;
  onModeChange?: (mode: AuthMode) => void;
}

const initialFormState: AuthFormState = {
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
  remember: false,
};

export const GlobalModal: React.FC<GlobalModalProps> = ({ onAuthSubmit, onModeChange }) => {
  const { open, type, closeModal, openModal } = useModal();
  const [formState, setFormState] = useState<AuthFormState>(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);
  useEffect(() => {
    setFormState(initialFormState);
    setFormError(null);
  }, [type]);

  const isSignup = type === 'signup';

  const primaryLabel = useMemo(() => (isSignup ? 'Create Account' : 'Log In'), [isSignup]);
  const switchLabel = useMemo(
    () => (isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"),
    [isSignup]
  );

  const handleChange = (key: keyof AuthFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = key === 'remember' ? event.target.checked : event.target.value;
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!type) return;

    const validationError = validateAuthForm(type, formState);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = isSignup
      ? buildSupabaseSignUpPayload(formState)
      : buildSupabaseSignInPayload(formState);

    setFormError(null);
    if (onAuthSubmit) {
      await onAuthSubmit(payload, type);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={closeModal}
      role="presentation"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={closeModal}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold mb-2 text-center" id="auth-modal-title">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          {isSignup ? 'Start planning your next journey in minutes.' : 'Sign in to continue exploring.'}
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full name"
              value={formState.fullName}
              onChange={handleChange('fullName')}
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={formState.email}
            onChange={handleChange('email')}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formState.password}
            onChange={handleChange('password')}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {isSignup && (
            <input
              type="password"
              placeholder="Confirm password"
              value={formState.confirmPassword}
              onChange={handleChange('confirmPassword')}
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          )}
          {!isSignup && (
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={formState.remember}
                onChange={handleChange('remember')}
                className="h-4 w-4 rounded border-gray-300"
              />
              Remember me
            </label>
          )}
          {formError && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">
              {formError}
            </div>
          )}
          <Button className="w-full rounded-full mt-2" variant="default" type="submit">
            {primaryLabel}
          </Button>
        </form>
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              const nextMode = isSignup ? 'login' : 'signup';
              onModeChange?.(nextMode);
              openModal(nextMode);
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {switchLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
