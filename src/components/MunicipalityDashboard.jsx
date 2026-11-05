import React from 'react';
import { useCivic } from '../context/CivicContext';
import LiveCityMap from './LiveCityMap';
import ComplaintTable from './ComplaintTable';
import {
  ShieldAlert,
  Layers,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  Sparkles,
  ArrowRight,
  BarChart3,
  ClipboardList
} from 'lucide-react';

export default function MunicipalityDashboard() {
  const {
    currentUser,
    complaints,
    departments,
    activityLogs,
    navigate,
    setSelectedComplaintDetail
  } = useCivic();

  const totalReceived = complaints.length;
  const unassignedCount = complaints.filter(c => !c.aiScreening?.verifiedByOfficer && c.status !== 'Resolved').length;
  const pendingCount = complaints.filter(c => c.status === 'Pending' || c.status === 'Submitted' || c.status === 'AI Screened').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Verified').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const criticalCount = complaints.filter(c => c.priority === 'Critical' && c.status !== 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Officer Command Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Municipality Operations Control Centre • Zonal Officer Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Officer Command: {currentUser?.name || 'Eng. Anita Desai'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentUser?.department || 'Road and Infrastructure Department'} • Verify AI triage, dispatch field squads, and monitor live Bengaluru risk zones.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => navigate('manage-complaints')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Manage All Complaints</span>
          </button>
          <button
            onClick={() => navigate('live-map')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center space-x-1.5"
          >
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Full-Screen GIS Map</span>
          </button>
        </div>
      </div>

      {/* 6 Required Municipal KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          { label: 'Total Received', val: totalReceived, sub: 'All wards', color: 'text-white', bar: 'bg-blue-500' },
          { label: 'Unassigned / Unverified', val: unassignedCount, sub: 'Needs AI check', color: 'text-indigo-400', bar: 'bg-indigo-500' },
          { label: 'Pending Intake', val: pendingCount, sub: 'Queued for crew', color: 'text-amber-400', bar: 'bg-amber-500' },
          { label: 'In-Progress', val: inProgressCount, sub: 'Crews on-site', color: 'text-cyan-400', bar: 'bg-cyan-500' },
          { label: 'Resolved', val: resolvedCount, sub: 'Proof verified', color: 'text-emerald-400', bar: 'bg-emerald-500' },
          { label: 'Critical Hazards', val: criticalCount, sub: 'Immediate SLA', color: 'text-rose-400', bar: 'bg-rose-500' }
        ].map((kpi, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block truncate">
              {kpi.label}
            </span>
            <p className={`text-2xl font-black font-mono mt-1 ${kpi.color}`}>{kpi.val}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{kpi.sub}</p>
            <div className={`absolute bottom-0 inset-x-0 h-1 ${kpi.bar}`} />
          </div>
        ))}
      </div>

      {/* Visually Dominating Interactive City Map in Municipal Dashboard */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Live Bengaluru GIS Operations Map (Red / Yellow / Green Risk Zones)</span>
          </h2>
          <button
            onClick={() => navigate('live-map')}
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center space-x-1"
          >
            <span>Expand Full Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <LiveCityMap embedded={true} />
      </div>

      {/* Department Performance & Resolution-Time Analytics + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Performance & Resolution-Time Analytics */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Department Performance & Resolution-Time Analytics
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">Avg Resolution: 11.4 Hours</span>
          </div>

          <div className="space-y-3">
            {departments.slice(0, 6).map((dept) => {
              const deptTickets = complaints.filter(c => c.department === dept.name);
              return (
                <div key={dept.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{dept.name}</span>
                    <div className="flex items-center space-x-3 font-mono text-[11px]">
                      <span className="text-slate-400">{deptTickets.length} tickets</span>
                      <span className="text-cyan-400">SLA: {dept.slaHours}h</span>
                      <span className="text-emerald-400 font-bold">{dept.resolutionRate}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                      style={{ width: dept.resolutionRate }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Complaint Activity Feed */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Municipal Activity</h3>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {activityLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span className="text-cyan-400 font-bold">{log.category}</span>
                  <span>{log.time}</span>
                </div>
                <p className="text-slate-200 font-medium">{log.action}</p>
                <p className="text-[10px] text-slate-400">By: {log.actor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complaint Management Table */}
      <ComplaintTable />
    </div>
  );
}
