import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import {
  Building2,
  LayoutDashboard,
  PlusCircle,
  Search,
  MapPin,
  Bot,
  Bell,
  User,
  LogOut,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
  Sparkles,
  Star,
  Menu,
  X,
  RotateCcw,
  Home,
  Cpu,
  ShieldCheck,
  Database
} from 'lucide-react';

export default function AppShell({ children }) {
  const {
    currentUser,
    activePage,
    navigate,
    logout,
    switchDemoUser,
    notifications,
    resetDemoData,
    dbMeta
  } = useCivic();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const role = currentUser?.role || 'Public';
  const unreadCount = notifications.filter(n => !n.read).length;

  // Role-based sidebar menus matching exact prompt specification
  const citizenLinks = [
    { id: 'citizen-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'file-complaint', label: 'File Complaint', icon: PlusCircle },
    { id: 'ai-screening', label: 'AI Screening', icon: Cpu },
    { id: 'track-complaint', label: 'Track Complaint', icon: Search },
    { id: 'live-map', label: 'Live Map', icon: MapPin },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
    { id: 'feedback', label: 'Feedback & Reviews', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const municipalityLinks = [
    { id: 'municipality-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'manage-complaints', label: 'Manage Complaints', icon: ClipboardList },
    { id: 'ai-screening', label: 'AI Screening Lab', icon: Cpu },
    { id: 'live-map', label: 'Live Map', icon: MapPin },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'city-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const adminLinks = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'city-analytics', label: 'City Analytics', icon: BarChart3 },
    { id: 'manage-users', label: 'Manage Users', icon: Users },
    { id: 'manage-departments', label: 'Manage Departments', icon: Building2 },
    { id: 'manage-complaints', label: 'All Complaints', icon: ClipboardList },
    { id: 'live-map', label: 'Live Map', icon: MapPin },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
    { id: 'feedback', label: 'Citizen Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const activeMenu =
    role === 'Admin' ? adminLinks : role === 'Municipality' ? municipalityLinks : citizenLinks;

  return (
    <div className="min-h-screen bg-[#04091a] text-slate-100 flex font-sans">
      {/* ==================== DESKTOP & MOBILE SIDEBAR ==================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo & Portal Badge */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
            <div
              onClick={() => navigate('landing')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-base font-black text-white tracking-tight">
                    CIVIC<span className="text-cyan-400">MIND</span>
                  </span>
                </div>
                <p className="text-[10px] font-mono text-cyan-400 uppercase">
                  {role === 'Admin' ? 'Admin Command' : role === 'Municipality' ? 'Officer Console' : 'Citizen Portal'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
            {activeMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Card & Logout */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950">
          <div
            onClick={() => navigate('profile')}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center space-x-2.5 cursor-pointer hover:border-slate-700 transition"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
              alt=""
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-cyan-500/40"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {currentUser ? currentUser.name : 'Kusuma Devi'}
              </p>
              <p className="text-[10px] text-cyan-400 truncate">
                {currentUser ? currentUser.badge || currentUser.role : 'Citizen Mode'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => navigate('landing')}
              className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-slate-800 transition"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span>Home</span>
            </button>
            <button
              onClick={logout}
              className="py-2 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-rose-500/20 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Command Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#04091a]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                <Database className="w-3.5 h-3.5" />
                <span>{dbMeta.engine}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono text-[11px]">Bengaluru Smart Grid</span>
            </div>
          </div>

          {/* Right Controls: Role Switcher, Quick File Complaint, Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Role Switcher for Hackathon / Demo Navigation */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
              <button
                onClick={() => switchDemoUser('Public')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  role === 'Public' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                👤 Citizen
              </button>
              <button
                onClick={() => switchDemoUser('Municipality')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  role === 'Municipality' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🏛️ Officer
              </button>
              <button
                onClick={() => switchDemoUser('Admin')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  role === 'Admin' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                👑 Admin
              </button>
            </div>

            <button
              onClick={() => navigate('file-complaint')}
              className="hidden md:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>File Complaint</span>
            </button>

            <button
              onClick={() => navigate('notifications')}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-cyan-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={resetDemoData}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
              title="Reset Database to Clean Seed State"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page View Container */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
