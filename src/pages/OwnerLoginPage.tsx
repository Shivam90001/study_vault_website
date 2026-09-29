import React, { useState } from 'react';
import { 
  Lock, 
  KeyRound, 
  User, 
  ArrowLeft, 
  AlertCircle, 
  Shield, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const OwnerLoginPage: React.FC = () => {
  const { loginOwner, navigateTo } = useVault();

  const [username, setUsername] = useState('');
  const [passwordPrimary, setPasswordPrimary] = useState('');
  const [passwordSecondary, setPasswordSecondary] = useState('');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !passwordPrimary || !passwordSecondary) {
      setError('Please provide all three security credentials.');
      return;
    }

    setIsSubmitting(true);
    const success = await loginOwner(username, passwordPrimary, passwordSecondary);
    if (!success) {
      setError('Authentication failed. Check the credentials and make sure the server is running.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 space-y-6">
      {/* Back button with single arrow */}
      <button
        onClick={() => navigateTo({ view: 'courses' })}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Website</span>
      </button>

      {/* Login Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Owner Verification</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dual-Password Secure Portal Access
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Username */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              1. Owner Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* 2. Password 1 */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              2. Security Password 1
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPass1 ? "text" : "password"}
                required
                value={passwordPrimary}
                onChange={(e) => setPasswordPrimary(e.target.value)}
                placeholder="Enter Primary Key"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPass1(!showPass1)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPass1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 3. Password 2 */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              3. Security Password 2
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPass2 ? "text" : "password"}
                required
                value={passwordSecondary}
                onChange={(e) => setPasswordSecondary(e.target.value)}
                placeholder="Enter Secondary Key"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPass2(!showPass2)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPass2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-indigo-600/30 transition-all active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Owner Control Center'}
          </button>
        </form>
      </div>
    </div>
  );
};
