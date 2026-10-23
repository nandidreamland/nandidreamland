'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else if (data.user.role === 'agent') {
        router.push('/agent/dashboard');
      } else {
        window.location.reload();
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#070A11] via-[#0D1322] to-[#161F33] text-white selection:bg-[#1F6B4C] selection:text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 -mt-24 w-96 h-96 bg-gradient-to-br from-[#1F6B4C]/20 via-[#1F6B4C]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">256-Bit SSL Encrypted Access</span>
        </div>
      </div>

      {/* Main Login Card Section */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-md w-full">
          {/* Card Container */}
          <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Top red accent highlight bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1F6B4C] to-transparent" />

            {/* Brand Header */}
            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-inner mb-2">
                <Image
                  src="/dreamlandlogo.jpeg"
                  alt="Dreamland Logo"
                  width={110}
                  height={38}
                  className="rounded-lg object-contain"
                  priority
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1F6B4C]/15 border border-[#1F6B4C]/30 text-[#6EE7A1] text-[11px] font-bold tracking-wide uppercase mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>Executive &amp; Client Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Sign in to access your sales CRM, properties, and portfolio intelligence.
                </p>
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-rose-300 text-xs flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <span className="font-semibold text-rose-200">Authentication Error: </span>
                  {error}
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1F6B4C] focus:border-transparent transition-all shadow-inner"
                    placeholder="advisor@dreamland.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1F6B4C] focus:border-transparent transition-all shadow-inner"
                    placeholder="Enter your security password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#1F6B4C] to-[#18593F] hover:from-[#1F6B4C] hover:to-[#0E3B29] text-white text-sm font-bold shadow-lg shadow-[#1F6B4C]/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating Session...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Portal Role Badges */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider mb-3">
                Authorized Roles &amp; Portals
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-slate-300">
                <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/60">
                  <span className="block font-bold text-white">Administrator</span>
                  <span className="text-[10px] text-slate-400">Full Control</span>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/60">
                  <span className="block font-bold text-white">Sales Advisor</span>
                  <span className="text-[10px] text-slate-400">CRM &amp; Leads</span>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700/60">
                  <span className="block font-bold text-white">Client / User</span>
                  <span className="text-[10px] text-slate-400">Searches &amp; Saved</span>
                </div>
              </div>
            </div>

            {/* Register / Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account yet?{' '}
                <Link
                  href="/register"
                  className="font-bold text-[#6EE7A1] hover:text-white transition-colors underline underline-offset-4"
                >
                  Create new account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Dreamland Tech Pvt Ltd. All rights reserved. Enterprise Real Estate Intelligence.
      </div>
    </div>
  );
}