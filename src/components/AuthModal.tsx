import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle, CheckCircle, X, LogIn, UserPlus } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isSupabaseConfigured) {
      setErrorMsg('Please configure your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName.trim() || email.split('@')[0],
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          setSuccessMsg('Account created and signed in successfully!');
          setTimeout(() => onClose(), 1000);
        } else {
          setSuccessMsg('Sign-up successful! If email verification is enabled, please check your inbox.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setSuccessMsg('Signed in successfully!');
        setTimeout(() => onClose(), 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl border border-light-300 dark:border-dark-400 bg-light-50 dark:bg-dark-100 p-6 shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-light-300 dark:border-dark-400 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
              T
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-dark-1000">
              {mode === 'signin' ? 'Sign In to ToDo' : 'Create an Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-light-800 hover:text-neutral-900 dark:hover:text-dark-1000"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 p-1 mb-4">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
              mode === 'signin'
                ? 'bg-light-50 dark:bg-dark-300 text-neutral-900 dark:text-dark-1000 shadow-xs'
                : 'text-light-800 dark:text-dark-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
              mode === 'signup'
                ? 'bg-light-50 dark:bg-dark-300 text-neutral-900 dark:text-dark-1000 shadow-xs'
                : 'text-light-800 dark:text-dark-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-2.5 text-xs text-red-600 dark:text-red-400 mb-3">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-600 dark:text-emerald-400 mb-3">
            <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-semibold text-neutral-800 dark:text-dark-950 block mb-1">
                Your Name
              </label>
              <div className="flex items-center rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-1.5">
                <User className="h-3.5 w-3.5 text-light-800 dark:text-dark-800 mr-2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-transparent text-xs text-neutral-900 dark:text-dark-1000 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-neutral-800 dark:text-dark-950 block mb-1">
              Email Address
            </label>
            <div className="flex items-center rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-1.5">
              <Mail className="h-3.5 w-3.5 text-light-800 dark:text-dark-800 mr-2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-transparent text-xs text-neutral-900 dark:text-dark-1000 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-800 dark:text-dark-950 block mb-1">
              Password
            </label>
            <div className="flex items-center rounded-lg border border-light-300 dark:border-dark-400 bg-light-100 dark:bg-dark-200 px-3 py-1.5">
              <Lock className="h-3.5 w-3.5 text-light-800 dark:text-dark-800 mr-2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-transparent text-xs text-neutral-900 dark:text-dark-1000 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-2xs"
          >
            {mode === 'signin' ? (
              <>
                <LogIn className="h-3.5 w-3.5" />
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              </>
            ) : (
              <>
                <UserPlus className="h-3.5 w-3.5" />
                <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
