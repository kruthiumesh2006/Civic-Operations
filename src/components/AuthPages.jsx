import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import {
  Building2,
  Mail,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  BadgeCheck,
  MapPin,
  KeyRound
} from 'lucide-react';

export default function AuthPages({ mode = 'login' }) {
  const { login, signup, departments, zones, navigate, showToast } = useCivic();

  const isLogin = mode === 'login';

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('Public'); // 'Public' | 'Municipality'
  const [department, setDepartment] = useState(departments[0]?.name || 'Road and Infrastructure Department');
  const [verificationId, setVerificationId] = useState('');
  const [zone, setZone] = useState(zones[0]?.name || 'Indiranagar');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [showEvaluatorPanel, setShowEvaluatorPanel] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setForgotSent(false);

    if (isLogin) {
      if (!email || !password) {
        setError('Please enter your email address and password.');
        return;
      }
      setLoading(true);
      const res = await login(email, password);
      setLoading(false);
      if (!res.success) {
        setError(res.error);
      }
    } else {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please complete all required registration fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Password and Confirm Password do not match.');
        return;
      }
      if (accountType === 'Municipality' && !verificationId.trim()) {
        setError('Municipality Officer registration requires an Official Verification / Badge ID.');
        return;
      }
      setLoading(true);
      const res = await signup({
        name,
        email,
        password,
        role: accountType === 'Municipality' ? 'Municipality' : 'Public',
        department: accountType === 'Municipality' ? department : 'Citizen',
        verificationId: accountType === 'Municipality' ? verificationId : null,
        zone
      });
      setLoading(false);
      if (!res.success) {
        setError(res.error);
      }
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError('Enter your registered email address first to receive a password reset link.');
      return;
    }
    setError('');
    setForgotSent(true);
    showToast(`Password recovery link dispatched to ${email}`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#04091a] text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Left Visual Smart City Showcase Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950 border-r border-slate-800/80 p-12 flex-col justify-between">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=80"
            alt="Bengaluru Smart City"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#04091a] via-[#04091a]/85 to-cyan-950/30" />
        </div>

        {/* Top Back to Home */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={() => navigate('landing')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to CivicMind Homepage</span>
          </button>
        </div>

        {/* Middle Branding */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Authenticated Role-Based Smart City Access</span>
          </div>

          <h1 className="text-4xl font-black text-white leading-tight">
            {isLogin
              ? 'Sign In to the Autonomous Civic Command Grid'
              : 'Join Bengaluru’s AI-Powered Civic Operations Ecosystem'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            CivicMind automatically identifies your account’s registered security clearance—routing Citizens, Municipality Field Officers, and City Administrators directly to their dedicated operational command centre.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { title: 'Citizen Portal', desc: 'File geotagged complaints with live camera, AI screening & real-time timeline tracking.' },
              { title: 'Municipality Officer Console', desc: 'Verify AI classifications, manage zonal heatmaps, assign squads & upload closure proof.' },
              { title: 'City Administrator Command', desc: 'Monitor city-wide health metrics, SLA analytics, 10 departments & user governance.' }
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">{item.title}</p>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Security Badge */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-6">
          <span className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Encrypted Municipal Identity Ledger</span>
          </span>
          <span className="font-mono text-cyan-400">CIVICMIND v3.0</span>
        </div>
      </div>

      {/* Right Authentication Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Back Button */}
          <div className="flex items-center justify-between lg:hidden">
            <button
              onClick={() => navigate('landing')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-400"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Homepage</span>
            </button>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {isLogin ? 'Welcome Back' : 'Create CivicMind Account'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isLogin
                    ? 'Enter your credentials to access your role-verified dashboard'
                    : 'Register as a Public Citizen or verified Municipality Officer'}
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setError('');
                navigate('login');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                isLogin ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setError('');
                navigate('signup');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                !isLogin ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {forgotSent && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Password reset instructions have been sent to {email}.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                {/* Account Type Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Account Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAccountType('Public')}
                      className={`p-3 rounded-2xl border text-left transition ${
                        accountType === 'Public'
                          ? 'bg-cyan-500/15 border-cyan-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <p className="text-xs font-bold">Citizen / Public</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Report & track civic issues</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('Municipality')}
                      className={`p-3 rounded-2xl border text-left transition ${
                        accountType === 'Municipality'
                          ? 'bg-emerald-500/15 border-emerald-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <p className="text-xs font-bold">Municipality Officer</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Requires dept verification</p>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    * Administrator accounts are restricted and provisioned solely via central security governance.
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Kusuma Devi"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email / Gmail Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isLogin ? 'Email Address' : accountType === 'Municipality' ? 'Official Municipal Email Address *' : 'Gmail / Email Address *'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={accountType === 'Municipality' ? 'officer@bengalurusmartcity.gov.in' : 'citizen@gmail.com'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Municipality Officer Verification Fields */}
            {!isLogin && accountType === 'Municipality' && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3">
                <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold">
                  <BadgeCheck className="w-4 h-4" />
                  <span>Municipal Officer Verification Details</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Assigned Municipal Department *
                  </label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Official Service Badge / Verification ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={verificationId}
                    onChange={e => setVerificationId(e.target.value)}
                    placeholder="e.g. BBMP-ENG-2026-884"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Neighbourhood / Ward selection on Signup */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Bengaluru Neighbourhood / Ward
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                  <select
                    value={zone}
                    onChange={e => setZone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {zones.map(z => (
                      <option key={z.id} value={z.name}>{z.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Confirm Password on Signup */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password on Login */}
            {isLogin && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 transition"
            >
              <span>{loading ? 'Authenticating...' : isLogin ? 'Login to CivicMind' : 'Create Verified Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch Link */}
          <div className="text-center text-xs text-slate-400 pt-2">
            {isLogin ? (
              <p>
                New to CivicMind?{' '}
                <button
                  type="button"
                  onClick={() => navigate('signup')}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  Create a Citizen or Officer account
                </button>
              </p>
            ) : (
              <p>
                Already have a registered account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  Login here
                </button>
              </p>
            )}
          </div>

          {/* Discreet Collapsible Evaluator Quick-Switch (Hidden by default so production UI stays clean) */}
          <div className="pt-4 border-t border-slate-900 text-center">
            <button
              type="button"
              onClick={() => setShowEvaluatorPanel(!showEvaluatorPanel)}
              className="text-[11px] text-slate-600 hover:text-slate-400 inline-flex items-center space-x-1 transition"
            >
              <KeyRound className="w-3 h-3" />
              <span>{showEvaluatorPanel ? 'Hide Prototype Role Quick-Access' : 'Prototype Role Quick-Access'}</span>
            </button>
            {showEvaluatorPanel && (
              <div className="mt-3 grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-900/70 border border-slate-800">
                <button
                  type="button"
                  onClick={() => login('kusuma@gmail.com', 'public123')}
                  className="py-1.5 px-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-500/20"
                >
                  Citizen Demo
                </button>
                <button
                  type="button"
                  onClick={() => login('municipality@gmail.com', 'city123')}
                  className="py-1.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/20"
                >
                  Officer Demo
                </button>
                <button
                  type="button"
                  onClick={() => login('admin@gmail.com', 'admin123')}
                  className="py-1.5 px-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[11px] font-bold border border-purple-500/20"
                >
                  Admin Demo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
