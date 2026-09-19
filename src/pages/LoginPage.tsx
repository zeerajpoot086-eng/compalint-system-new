import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Wrench, Mail, Lock, Loader2, ArrowRight, User, Shield, Briefcase, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  setCurrentView: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setCurrentView }) => {
  const { login, quickDemoLogin } = useAuth();
  const { showToast } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      showToast('Welcome back to FixMate!', 'success');
      // Redirect based on role check in Auth context
      setCurrentView('user-dashboard');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemo = async (role: UserRole) => {
    setIsSubmitting(true);
    try {
      await quickDemoLogin(role);
      showToast(`Signed in with Demo ${role.toUpperCase()} profile!`, 'success');
      if (role === 'admin') setCurrentView('admin-dashboard');
      else if (role === 'technician') setCurrentView('technician-dashboard');
      else setCurrentView('user-dashboard');
    } catch (err: any) {
      showToast('Demo login error: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-slate-50/50 dark:bg-slate-950/40">
      <div className="w-full max-w-md space-y-6">
        
        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-colors">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Wrench className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to FixMate</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access your service requests, tech assignments, or dispatch console.
            </p>
          </div>

          {/* Quick 1-Click Demo Profiles */}
          <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3.5 dark:border-indigo-950 dark:bg-indigo-950/30">
            <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>One-Click Instant Demo Login:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('user')}
                className="flex flex-col items-center justify-center rounded-xl bg-white p-2 text-center shadow-xs border border-slate-200 hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-indigo-600 transition-all cursor-pointer"
              >
                <User className="h-4 w-4 text-emerald-500 mb-1" />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Customer</span>
                <span className="text-[9px] text-slate-400">Sarah M.</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('admin')}
                className="flex flex-col items-center justify-center rounded-xl bg-white p-2 text-center shadow-xs border border-slate-200 hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-indigo-600 transition-all cursor-pointer"
              >
                <Shield className="h-4 w-4 text-indigo-500 mb-1" />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Admin</span>
                <span className="text-[9px] text-slate-400">Elena R.</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('technician')}
                className="flex flex-col items-center justify-center rounded-xl bg-white p-2 text-center shadow-xs border border-slate-200 hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-indigo-600 transition-all cursor-pointer"
              >
                <Briefcase className="h-4 w-4 text-amber-500 mb-1" />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Technician</span>
                <span className="text-[9px] text-slate-400">Alex R.</span>
              </button>
            </div>
          </div>

          <div className="relative mb-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative inline-block bg-white px-3 text-[11px] font-semibold text-slate-400 dark:bg-slate-900">
              Or sign in with email
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to FixMate
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <button
              onClick={() => setCurrentView('register')}
              className="font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Create Account
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
