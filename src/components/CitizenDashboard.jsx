import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import {
  PlusCircle,
  Search,
  MapPin,
  Bot,
  Bell,
  Star,
  Clock,
  CheckCircle2,
  Activity,
  Layers,
  Calendar,
  Building2,
  ArrowRight,
  Sparkles,
  ThumbsUp,
  Eye
} from 'lucide-react';

export default function CitizenDashboard() {
  const {
    currentUser,
    complaints,
    notifications,
    evaluatedZones,
    navigate,
    setTrackingId,
    setSelectedComplaintDetail,
    supportDuplicateComplaint
  } = useCivic();

  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'mine'

  const citizenName = currentUser?.name || 'Kusuma Devi';
  const myComplaints = complaints.filter(
    c => c.reportedBy.toLowerCase() === citizenName.toLowerCase() || c.userEmail === currentUser?.email
  );

  const displayedComplaints = filterMode === 'mine' && myComplaints.length > 0 ? myComplaints : complaints;

  const totalSubmitted = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending' || c.status === 'Submitted' || c.status === 'AI Screened').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Verified').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -right-12 -top-12 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Citizen Civic Operations Portal • Verified Resident</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {citizenName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Report neighbourhood civic issues with live camera geotagging, track real-time municipal repair progress, co-sign nearby complaints, and verify completed work.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('file-complaint')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-xl shadow-cyan-500/25 flex items-center space-x-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>File a Complaint</span>
            </button>
            <button
              onClick={() => navigate('track-complaint')}
              className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs flex items-center space-x-2 transition"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Track My Complaints</span>
            </button>
            <button
              onClick={() => navigate('ai-assistant')}
              className="px-4 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center space-x-2 transition"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI CivicMind Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">Total Submitted</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{totalSubmitted}</p>
          <p className="text-[11px] text-slate-500 mt-1">{myComplaints.length} filed by you</p>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-500" />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">Pending / Screened</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 font-mono">{pendingCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">AI screened & queued</p>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-500" />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">In-Progress</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-400 font-mono">{inProgressCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Municipal squads deployed</p>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-cyan-500" />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono">{resolvedCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Certified & citizen-rated</p>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-500" />
        </div>
      </div>

      {/* Main Grid: Left 2 Cols = Complaint Cards | Right Col = Nearby Civic Issues, Notifications & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint Cards Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Submitted & Active Civic Complaints</h2>
              <p className="text-xs text-slate-400">Click any card to track full 6-stage lifecycle or co-sign</p>
            </div>
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filterMode === 'all' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                All City Issues ({complaints.length})
              </button>
              <button
                onClick={() => setFilterMode('mine')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filterMode === 'mine' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                My Reports ({myComplaints.length})
              </button>
            </div>
          </div>

          {/* Complaint Cards displaying ID, Category, Location, Submission date, Current status, Assigned department, Expected resolution date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedComplaints.map((comp) => {
              const isResolved = comp.status === 'Resolved';
              const isInProgress = comp.status === 'In Progress' || comp.status === 'Assigned';
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComplaintDetail(comp)}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 shadow-xl transition cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top row: Complaint ID & Current Status */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-xs font-bold">
                        {comp.id}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isResolved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isInProgress
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {comp.status}
                      </span>
                    </div>

                    {/* Image & Title */}
                    <div className="flex items-start space-x-3">
                      <img
                        src={comp.image}
                        alt={comp.title}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                          {comp.category}
                        </span>
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-2 mt-0.5">
                          {comp.title}
                        </h3>
                      </div>
                    </div>

                    {/* Metadata Details */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>Location:</span>
                        </span>
                        <span className="text-slate-200 font-medium truncate max-w-[160px]">{comp.area}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center space-x-1">
                          <Building2 className="w-3 h-3 text-cyan-400" />
                          <span>Department:</span>
                        </span>
                        <span className="text-cyan-400 font-medium truncate max-w-[160px]">{comp.department}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Submitted:</span>
                        </span>
                        <span className="text-slate-300 font-mono text-[11px]">{comp.createdAt}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Expected Resolution:</span>
                        </span>
                        <span className="text-amber-300 font-mono text-[11px]">
                          {comp.expectedResolution || 'Within 24h SLA'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => supportDuplicateComplaint(comp.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center space-x-1.5 transition"
                      title="Support / Upvote this civic issue"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Support ({comp.upvotes || 1})</span>
                    </button>

                    <button
                      onClick={() => {
                        setTrackingId(comp.id);
                        navigate('track-complaint');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center space-x-1 transition"
                    >
                      <span>Track Timeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Nearby Civic Issues, Notifications, AI Assistant & Citizen Feedback */}
        <div className="space-y-6">
          {/* Nearby Civic Issues / Bengaluru Ward Risk */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Nearby Bengaluru Zones</h3>
              </div>
              <button onClick={() => navigate('live-map')} className="text-xs text-cyan-400 hover:underline font-semibold">
                Full Map →
              </button>
            </div>
            <div className="space-y-2">
              {evaluatedZones.slice(0, 5).map(z => (
                <div
                  key={z.id}
                  onClick={() => navigate('live-map')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs cursor-pointer transition"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        z.zoneStatus === 'danger' ? 'bg-rose-500' : z.zoneStatus === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    />
                    <div>
                      <p className="font-bold text-white">{z.name}</p>
                      <p className="text-[10px] text-slate-400">{z.majorCategory}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-slate-300">{z.activeCount} unresolved</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications Feed */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Notifications</h3>
              </div>
              <button onClick={() => navigate('notifications')} className="text-xs text-cyan-400 hover:underline font-semibold">
                View All
              </button>
            </div>
            <div className="space-y-2.5">
              {notifications.slice(0, 3).map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.ticketId) {
                      setTrackingId(n.ticketId);
                      navigate('track-complaint');
                    }
                  }}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/30 cursor-pointer space-y-1 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{n.title}</span>
                    <span className="text-[10px] text-slate-500">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Feedback Quick Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <h3 className="text-sm font-bold text-white">Rate Resolved Complaints</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your 5-star citizen verification directly impacts municipal department SLA scores on the Admin Command Centre.
            </p>
            <button
              onClick={() => navigate('feedback')}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
            >
              Open Feedback & Reviews Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
