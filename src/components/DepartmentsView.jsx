import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import {
  Building2,
  Phone,
  Mail,
  Users,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Construction,
  Droplets,
  Trash2,
  Zap,
  Compass,
  Activity,
  Sparkles,
  Trees,
  Leaf,
  Waves
} from 'lucide-react';

export default function DepartmentsView() {
  const { departments, complaints, navigate, setTrackingId } = useCivic();
  const [expandedDeptId, setExpandedDeptId] = useState(departments[0]?.id || null);

  const getIcon = (name) => {
    switch (name) {
      case 'Construction': return Construction;
      case 'Droplets': return Droplets;
      case 'Trash2': return Trash2;
      case 'Zap': return Zap;
      case 'Compass': return Compass;
      case 'Activity': return Activity;
      case 'Trees': return Trees;
      case 'Leaf': return Leaf;
      case 'Waves': return Waves;
      default: return Building2;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>10 Specialized Municipal Departments • Bengaluru Smart City</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Municipal Department Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Click any department card to expand its full operational responsibilities, assigned complaints, pending tasks, resolved history, and SLA performance score.
          </p>
        </div>
      </div>

      {/* 10 Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => {
          const IconComponent = getIcon(dept.iconName);
          const deptComplaints = complaints.filter(
            c => c.department.toLowerCase() === dept.name.toLowerCase() || c.department.includes(dept.code)
          );
          const pendingTasks = deptComplaints.filter(c => c.status !== 'Resolved').length;
          const resolvedCount = deptComplaints.filter(c => c.status === 'Resolved').length;
          const isExpanded = expandedDeptId === dept.id;

          return (
            <div
              key={dept.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 overflow-hidden shadow-xl transition-all flex flex-col justify-between group"
            >
              {/* Cinematic Cover Image */}
              <div
                onClick={() => setExpandedDeptId(isExpanded ? null : dept.id)}
                className="relative h-48 overflow-hidden bg-slate-950 cursor-pointer"
              >
                <img
                  src={dept.coverImage}
                  alt={dept.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/45 to-transparent" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-cyan-400 font-mono text-xs font-bold border border-cyan-500/30">
                  {dept.code}
                </span>

                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-950/85 backdrop-blur-md text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{dept.resolutionRate} Performance</span>
                </span>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 shadow-lg">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white leading-tight">{dept.name}</h3>
                      <p className="text-[11px] text-cyan-300">Head: {dept.head}</p>
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-950/80 text-slate-300">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">{dept.description}</p>

                {/* Metrics Row: Assigned Complaints | Pending Tasks | Resolved Complaints | Performance */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-base font-black text-white font-mono">{deptComplaints.length + 18}</span>
                    <p className="text-[10px] text-slate-500">Assigned</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-base font-black text-amber-400 font-mono">{pendingTasks}</span>
                    <p className="text-[10px] text-slate-500">Pending</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-base font-black text-emerald-400 font-mono">{resolvedCount + 18}</span>
                    <p className="text-[10px] text-slate-500">Resolved</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-base font-black text-cyan-400 font-mono">{dept.resolutionRate}</span>
                    <p className="text-[10px] text-slate-500">SLA Score</p>
                  </div>
                </div>

                {/* Expandable Responsibilities & Active Tickets Panel */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800 space-y-3 animate-in fade-in">
                    <div>
                      <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
                        Key Statutory Responsibilities:
                      </p>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {(dept.responsibilities || []).map((r, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {deptComplaints.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Recent Department Tickets:
                        </p>
                        {deptComplaints.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setTrackingId(c.id);
                              navigate('track-complaint');
                            }}
                            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between text-xs cursor-pointer"
                          >
                            <span className="truncate max-w-xs text-slate-200">
                              <strong className="text-cyan-400 font-mono">{c.id}:</strong> {c.title}
                            </span>
                            <span className="text-[10px] font-bold text-amber-300">{c.status} →</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setExpandedDeptId(isExpanded ? null : dept.id)}
                    className="text-xs font-bold text-cyan-400 hover:underline"
                  >
                    {isExpanded ? 'Collapse Details' : 'Expand Responsibilities & Tickets'}
                  </button>
                  <button
                    onClick={() => navigate('file-complaint')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center space-x-1.5 transition"
                  >
                    <span>Report Issue to {dept.code}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
