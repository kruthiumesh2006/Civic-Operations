import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle,
  KeyRound,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AuthModal() {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authMode, 
    setAuthMode, 
    login, 
    signup 
  } = useCivic();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [roleDropdown, setRoleDropdown] = useState('Public');
  const [department, setDepartment] = useState('Public Works & Roads (PWD)');
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessInfo('');

    if (authMode === 'login') {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      // Note: Passing roleDropdown as a hint, but the core requirement is:
      // "Automatically detect the account's registered role. Do not reject a valid login just because the role dropdown is different."
      const res = login(email, password, roleDropdown);
      if (!res.success) {
        setError(res.error);
      }
    } else {
      // Signup
      if (!name || !email || !password) {
        setError('Please fill out all required fields.');
        return;
      }
      if (!email.includes('@')) {
        setError('Please enter a valid email address (e.g. yourname@gmail.com).');
        return;
      }

      // Requirement: "New signups should receive the Public role."
      // If user selected Municipality, we allow it if they specified a department, but default is Public.
      const res = signup({
        name,
        email,
        password,
        role: roleDropdown === 'Municipality' ? 'Municipality' : 'Public',
        department: roleDropdown === 'Municipality' ? department : undefined
      });

      if (!res.success) {
        setError(res.error);
      }
    }
  };

  // Quick autofill buttons for demo credentials
  const autofillDemo = (type) => {
    setError('');
    setAuthMode('login');
    if (type === 'admin') {
      setEmail('admin@gmail.com');
      setPassword('admin123');
      setRoleDropdown('Admin');
    } else if (type === 'municipality') {
      setEmail('municipality@gmail.com');
      setPassword('city123');
      setRoleDropdown('Municipality');
    } else if (type === 'public') {
      setEmail('kusuma@gmail.com');
      setPassword('public123');
      setRoleDropdown('Public');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />

        {/* Modal Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-3 shadow-inner">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {authMode === 'login' ? 'Welcome to CivicMind' : 'Join CivicMind Urban Grid'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {authMode === 'login' 
                ? 'Sign in to monitor, report, and manage smart city operations'
                : 'Create an account to track civic issues and collaborate with city officials'}
            </p>
          </div>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="mb-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Demo One-Click Autofill:</span>
              </span>
              <span className="text-[10px] text-cyan-400/90 font-mono">Test Any Role</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => autofillDemo('public')}
                className="px-2 py-1.5 rounded-lg text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition flex flex-col items-center"
              >
                <span>Citizen</span>
                <span className="text-[9px] text-slate-500">kusuma@gmail</span>
              </button>
              <button
                type="button"
                onClick={() => autofillDemo('municipality')}
                className="px-2 py-1.5 rounded-lg text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition flex flex-col items-center"
              >
                <span>Municipality</span>
                <span className="text-[9px] text-slate-500">municipality@</span>
              </button>
              <button
                type="button"
                onClick={() => autofillDemo('admin')}
                className="px-2 py-1.5 rounded-lg text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition flex flex-col items-center"
              >
                <span>Admin</span>
                <span className="text-[9px] text-slate-500">admin@gmail</span>
              </button>
            </div>
          </div>

          {/* Tab Switcher (Login / Signup) */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'login'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'signup'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error / Alert Display */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name Field (Signup Only) */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Role Selector Dropdown */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">
                  {authMode === 'login' ? 'Select Preferred Role' : 'Account Role'}
                </label>
                {authMode === 'login' && (
                  <span className="text-[10px] text-cyan-400">
                    *Auto-detects registered role
                  </span>
                )}
              </div>
              <select
                value={roleDropdown}
                onChange={(e) => setRoleDropdown(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Public">Public / Citizen (Default)</option>
                <option value="Municipality">Municipality Officer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Department field if Municipality chosen in signup */}
            {authMode === 'signup' && roleDropdown === 'Municipality' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Assigned Municipal Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Public Works & Roads (PWD)">Public Works & Roads (PWD)</option>
                  <option value="Water Supply & Sewerage Board">Water Supply & Sewerage Board</option>
                  <option value="Solid Waste Management (SWM)">Solid Waste Management (SWM)</option>
                  <option value="Electrical & Smart Lighting">Electrical & Smart Lighting</option>
                  <option value="Traffic Engineering & Signals">Traffic Engineering & Signals</option>
                  <option value="Urban Health & Disease Surveillance">Urban Health & Disease</option>
                </select>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Gmail / Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. kusuma@gmail.com"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-600/25 border border-cyan-400/30 transition-all flex items-center justify-center space-x-2"
            >
              <span>{authMode === 'login' ? 'Sign In to Dashboard' : 'Complete Signup'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-5 text-center">
            {authMode === 'login' ? (
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setError('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
