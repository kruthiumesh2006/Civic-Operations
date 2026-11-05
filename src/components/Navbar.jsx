import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  PlusCircle, 
  Search, 
  Bot, 
  LogOut, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Star
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser, 
    logout, 
    setAuthModalOpen, 
    setAuthMode, 
    switchDemoUser,
    activeTab, 
    setActiveTab, 
    setFileComplaintModalOpen,
    setAiAssistantOpen,
    resetDemoData
  } = useCivic();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: Layers },
    { id: 'map', label: 'Live Hotspot Map', icon: MapPin },
    { id: 'track', label: 'Track Complaint', icon: Search },
    { id: 'departments', label: 'Municipal Departments', icon: Building2 },
    { id: 'reviews', label: 'Citizen Reviews', icon: Star },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800 text-slate-100 shadow-2xl">
      {/* Top Smart City Ticker & Demo Switcher Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Status badge */}
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-medium">CIVIC AGENT ACTIVE</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">Smart City Urban Grid • Bangalore Digital Twin Hub</span>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="text-slate-400 text-[11px] font-mono hidden md:inline">Quick Demo Switcher:</span>
            <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
              <button
                onClick={() => switchDemoUser('Public')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  currentUser?.role === 'Public' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Public Citizen (kusuma@gmail.com)"
              >
                👤 Public
              </button>
              <button
                onClick={() => switchDemoUser('Municipality')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  currentUser?.role === 'Municipality' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Municipal Officer (municipality@gmail.com)"
              >
                🏛️ Municipality
              </button>
              <button
                onClick={() => switchDemoUser('Admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  currentUser?.role === 'Admin' 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="City Administrator (admin@gmail.com)"
              >
                👑 Admin
              </button>
            </div>
            
            <button
              onClick={resetDemoData}
              title="Reset sample complaints and mock database"
              className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-400 hover:text-cyan-400 flex items-center space-x-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden lg:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Building2 className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  CIVIC<span className="text-cyan-400">MIND</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  AI-OPS
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                Smart City Operations Platform
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* File Complaint Primary Action */}
            <button
              onClick={() => setFileComplaintModalOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-600/25 border border-cyan-400/30 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>File Complaint</span>
            </button>

            {/* AI Assistant Trigger Button */}
            <button
              onClick={() => setAiAssistantOpen(prev => !prev)}
              className="p-2 rounded-lg text-cyan-400 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 shadow-sm relative transition"
              title="Ask CivicMind AI Assistant"
            >
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </button>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/40"
                  />
                  <div className="text-left leading-tight hidden lg:block">
                    <p className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        currentUser.role === 'Admin'
                          ? 'bg-purple-500/20 text-purple-300'
                          : currentUser.role === 'Municipality'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <span className="text-[11px] text-cyan-300 font-medium">{currentUser.badge}</span>
                      </div>
                    </div>
                    <div className="px-2 py-1">
                      <button
                        onClick={() => {
                          setActiveTab('dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-800 flex items-center space-x-2"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Operations Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setFileComplaintModalOpen(true)}
              className="p-2 rounded-lg bg-cyan-600 text-white"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-lg" />
                  <div>
                    <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                    <span className="text-[10px] text-cyan-400">{currentUser.role}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 text-xs text-rose-400 bg-rose-500/10 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2 w-full">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-medium text-slate-200 bg-slate-900 rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-medium text-white bg-cyan-600 rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
