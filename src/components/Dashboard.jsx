import React from 'react';
import { useCivic } from '../context/CivicContext';
import ComplaintTable from './ComplaintTable';
import { 
  Building2, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  Bot, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  ArrowRight, 
  Activity, 
  Zap, 
  TrendingUp,
  Search,
  CheckCircle
} from 'lucide-react';

export default function Dashboard() {
  const { 
    complaints, 
    evaluatedZones, 
    currentUser, 
    setActiveTab, 
    setFileComplaintModalOpen,
    setAiAssistantOpen,
    setSelectedComplaintDetail,
    setTrackingId 
  } = useCivic();

  // Metric Computations
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const criticalCount = complaints.filter(c => c.priority === 'Critical' && c.status !== 'Resolved').length;

  // Red zones count
  const redZones = evaluatedZones.filter(z => z.zoneStatus === 'danger');

  // Recent 5 activity complaints
  const recentComplaints = [...complaints].slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top Welcome & Smart City Operational Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/60 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Civic Operating System</span>
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                currentUser?.role === 'Admin' 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : currentUser?.role === 'Municipality' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                Role: {currentUser ? currentUser.role : 'Public Visitor'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome, {currentUser ? currentUser.name : 'Citizen'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              CivicMind orchestrates municipal dispatch, crowdsourced grievance reporting, automated AI de-duplication, and real-time geographical risk mapping across the urban grid.
            </p>
          </div>

          {/* Quick Action Shortcuts as required */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setFileComplaintModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-cyan-600/30 border border-cyan-400/40 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>File Complaint</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Hotspot Map</span>
            </button>

            <button
              onClick={() => setAiAssistantOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical SLA Warning Banner if critical issues pending */}
      {criticalCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 flex-shrink-0 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Emergency Alert: {criticalCount} Critical Public Safety Hazards Active
              </p>
              <p className="text-[11px] text-rose-300">
                Wards reporting hazardous conditions (e.g., deep road craters, live electrical sparking). Zonal teams dispatched.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs whitespace-nowrap transition"
          >
            Inspect Red Zones
          </button>
        </div>
      )}

      {/* 4 Core Metric KPI Cards as Required */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 1. Total Complaints */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Total Complaints
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-mono">{totalCount}</span>
            <span className="text-xs text-blue-400 font-medium">+3 today</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">All registered citizen grievances</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>

        {/* 2. Pending Complaints */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Pending Complaints
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 animate-pulse">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-400 font-mono">{pendingCount}</span>
            <span className="text-xs text-amber-500 font-medium">Awaiting Crew</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">AI prioritized for zonal intake</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
        </div>

        {/* 3. In-Progress Complaints */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              In-Progress
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-cyan-400 font-mono">{inProgressCount}</span>
            <span className="text-xs text-cyan-400 font-medium">Field Crews Active</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Work orders dispatched on-site</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
        </div>

        {/* 4. Resolved Complaints */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Resolved & Verified
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">{resolvedCount}</span>
            <span className="text-xs text-emerald-400 font-medium">96.4% SLA</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Remediated & verified by citizens</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
        </div>
      </div>

      {/* Middle Section: Recent Activity Timeline & Live Operational Zone Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Complaint Activity Feed as Required */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Recent Complaint Activity Feed
              </h3>
            </div>
            <span className="text-[11px] text-cyan-400 font-mono flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Live Real-Time Stream</span>
            </span>
          </div>

          <div className="space-y-3">
            {recentComplaints.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedComplaintDetail(item)}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700 transition cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={item.image}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">{item.id}</span>
                      <span className="text-[10px] text-slate-500">• {item.createdAt}</span>
                    </div>
                    <p className="text-xs font-semibold text-white truncate max-w-sm">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      📍 {item.area}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : item.status === 'In Progress'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {item.status}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Smart City Hotspot Zone Status Widget */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Geographic Risk Zones
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live ward status based on real-time complaint density.
            </p>
          </div>

          <div className="space-y-2.5">
            {evaluatedZones.map((z) => {
              const isRed = z.zoneStatus === 'danger';
              const isYellow = z.zoneStatus === 'warning';

              return (
                <div
                  key={z.id}
                  onClick={() => setActiveTab('map')}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    isRed 
                      ? 'bg-rose-950/20 border-rose-500/30 hover:bg-rose-950/40' 
                      : isYellow 
                      ? 'bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/40' 
                      : 'bg-emerald-950/20 border-emerald-500/30 hover:bg-emerald-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white truncate max-w-[160px]">{z.code}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isRed ? 'bg-rose-500/20 text-rose-300' : isYellow ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {isRed ? '🔴 RED' : isYellow ? '🟡 YELLOW' : '🟢 GREEN'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[140px]">{z.name.split('-')[1]}</span>
                    <span>{z.activeCount} active</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('map')}
            className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
          >
            <span>Explore Full Interactive Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Complaint Overview Table as Required */}
      <ComplaintTable />
    </div>
  );
}
