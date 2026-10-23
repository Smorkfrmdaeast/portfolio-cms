import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { adminLoginSchema } from '../../lib/validation';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminLoginProps {
  onSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const { loginWithEmail, loginWithGoogle, loading, isUsingFirebase } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setAuthError(null);

    const validation = adminLoginSchema.safeParse({ email, password });
    if (!validation.success) {
      setValidationError(validation.error.issues[0]?.message || 'Invalid input');
      return;
    }

    try {
      await loginWithEmail(email, password);
      onSuccess?.();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setValidationError(null);
    setAuthError(null);
    try {
      await loginWithGoogle();
      onSuccess?.();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  };

  const fillDemoAdmin = () => {
    setEmail('ifeanyinuels42@gmail.com');
    setPassword('admin123456');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-6 py-12">
      <div className="w-full max-w-md border border-[#D9D4C7] dark:border-[#22262F] bg-white dark:bg-[#15181F] p-8 rounded-[3px] shadow-sm">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to public site
          </Link>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#D9532B]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
              CMS Access
            </span>
          </div>
          <h1 className="font-serif text-3xl text-[#16181D] dark:text-[#ECE8DF] mt-1">
            Admin Authentication
          </h1>
          <p className="text-xs text-[#6B6F78] dark:text-[#8E93A0] mt-2">
            {isUsingFirebase
              ? 'Authorized administrator login via live Firebase Auth.'
              : 'Running in Local Cache mode. Allowlisted admin email verification active.'}
          </p>
        </div>

        {/* Demo / Sandbox Helper Banner */}
        {!isUsingFirebase && (
          <div className="mb-6 p-3 bg-[#F4F1EA] dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono font-medium text-[#16181D] dark:text-[#ECE8DF]">
                Quick Test Credentials
              </span>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="text-[#D9532B] hover:underline font-mono text-[11px] cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            <p className="text-[#6B6F78] dark:text-[#8E93A0] font-mono text-[11px]">
              Email: ifeanyinuels42@gmail.com
              <br />
              Password: admin123456
            </p>
          </div>
        )}

        {(validationError || authError) && (
          <div
            role="alert"
            className="mb-6 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-[2px] text-xs text-red-700 dark:text-red-300 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{validationError || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1.5"
            >
              Administrator Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ifeanyinuels42@gmail.com"
              className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF] focus:border-[#D9532B] focus:ring-1 focus:ring-[#D9532B]"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1.5"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF] focus:border-[#D9532B] focus:ring-1 focus:ring-[#D9532B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] font-mono text-xs uppercase tracking-wider rounded-[2px] hover:bg-[#D9532B] dark:hover:bg-[#D9532B] dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#D9D4C7]/60 dark:border-[#22262F]/60">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2 px-4 border border-[#D9D4C7] dark:border-[#22262F] font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] hover:border-[#D9532B] hover:text-[#D9532B] rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="fab fa-google text-xs" />
            <span>Sign In with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
