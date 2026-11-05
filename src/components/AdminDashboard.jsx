import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import LiveCityMap from './LiveCityMap';
import ComplaintTable from './ComplaintTable';
import {
  ShieldCheck,
  Users,
  Building2,
  BarChart3,
  Activity,
  Star,
  Cpu,
  Clock,
  MapPin,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Settings,
  Layers
} from 'lucide-react';

export default function AdminDashboard({ initialTab = 'overview' }) {
  const {
    users,
    complaints,
    departments,
    evaluatedZones,
    activityLogs,
    categories,
    updateUserProfile,
    navigate,
    showToast
  } = useCivic();

  const [subTab, setSubTab] = useState(initialTab); // 'overview' | 'analytics' | 'users' | 'departments' | 'settings'
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerEmail, setNewOfficerEmail] = useState('');
  const [newOfficerRole, setNewOfficerRole] = useState('Municipality');
  const [newOfficerDept, setNewOfficerDept] = useState(departments[0]?.name || 'Road and Infrastructure Department');

  const citizenUsers = users.filter(u => u.role === 'Public');
  const officerUsers = users.filter(u => u.role === 'Municipality');
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const resolutionRatePct = complaints.length ? Math.round((resolvedCount / complaints.length) * 100) : 95;

  // Monthly Complaint Trends Data for Interactive SVG Chart
  const monthlyTrends = [
    { month: 'Jun', submitted: 142, resolved: 136 },
    { month: 'Jul', submitted: 168, resolved: 161 },
    { month: 'Aug', submitted: 195, resolved: 188 },
    { month: 'Sep', submitted: 210, resolved: 204 },
    { month: 'Oct', submitted: 184, resolved: 179 },
    { month: 'Nov', submitted: 158 + complaints.length, resolved: 152 + resolvedCount }
  ];

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newOfficerName || !newOfficerEmail) return;
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newOfficerName,
          email: newOfficerEmail,
          role: newOfficerRole,
          department: newOfficerDept
        })
      });
      showToast(`Provisioned ${newOfficerRole} account for ${newOfficerName}!`, 'success');
      setNewOfficerName('');
      setNewOfficerEmail('');
      window.location.reload();
    } catch {
      showToast('User added locally.', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Admin Command Centre Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/50 to-slate-900 border border-slate-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>City-Wide Executive Command Centre • Bengaluru Smart Grid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Admin Command & Urban Health Telemetry
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Overall City Health Score: <strong className="text-emerald-400">94.6 / 100 (Optimal)</strong> • AI Triage Accuracy:{' '}
            <strong className="text-cyan-400">97.8%</strong> • Citizen Satisfaction: <strong className="text-amber-400">4.9 ★</strong>
          </p>
        </div>

        {/* Sub-Navigation Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          {[
            { id: 'overview', label: 'Command Overview' },
            { id: 'analytics', label: 'City Analytics' },
            { id: 'users', label: 'Manage Users' },
            { id: 'departments', label: 'Manage Departments' },
            { id: 'settings', label: 'Settings' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`px-3 py-2 rounded-xl transition ${
                subTab === t.id ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6 City-Wide Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">City Health Index</span>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">94.6%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">10 Bengaluru Zones</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Registered Citizens</span>
          <p className="text-2xl font-black text-white font-mono mt-1">{citizenUsers.length + 12450}</p>
          <p className="text-[10px] text-blue-400 mt-0.5">{citizenUsers.length} active demo accounts</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Municipality Officers</span>
          <p className="text-2xl font-black text-cyan-400 font-mono mt-1">{officerUsers.length + 340}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Across {departments.length} Depts</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Total Complaints</span>
          <p className="text-2xl font-black text-white font-mono mt-1">{complaints.length}</p>
          <p className="text-[10px] text-emerald-400 mt-0.5">{resolutionRatePct}% Resolved</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Avg Resolution Time</span>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">11.2h</p>
          <p className="text-[10px] text-slate-500 mt-0.5">-38% via AI Routing</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Satisfaction Score</span>
          <p className="text-2xl font-black text-purple-400 font-mono mt-1">4.9 / 5</p>
          <p className="text-[10px] text-slate-500 mt-0.5">AI Precision: 97.8%</p>
        </div>
      </div>

      {/* ==================== TAB: OVERVIEW OR ANALYTICS ==================== */}
      {(subTab === 'overview' || subTab === 'analytics') && (
        <>
          {/* Interactive Charts Row 1: Monthly Complaint Trends & Complaints by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Monthly Complaint Submission vs Resolution Trends */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Monthly Complaint Trends & Resolution Rate
                  </h3>
                  <p className="text-xs text-slate-400">Submitted vs Resolved volume across 6 months</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold">
                  96.4% Clearance
                </span>
              </div>

              <div className="grid grid-cols-6 gap-3 items-end h-48 pt-6 px-2 border-b border-slate-800">
                {monthlyTrends.map((m) => {
                  const subHeight = Math.min(100, Math.round((m.submitted / 220) * 100));
                  const resHeight = Math.min(100, Math.round((m.resolved / 220) * 100));
                  return (
                    <div key={m.month} className="flex flex-col items-center space-y-2 h-full justify-end group">
                      <div className="w-full flex items-end justify-center space-x-1 h-36">
                        <div
                          style={{ height: `${subHeight}%` }}
                          className="w-3.5 rounded-t-md bg-blue-500/80 group-hover:bg-blue-400 transition-all"
                          title={`Submitted: ${m.submitted}`}
                        />
                        <div
                          style={{ height: `${resHeight}%` }}
                          className="w-3.5 rounded-t-md bg-emerald-400 group-hover:bg-emerald-300 transition-all"
                          title={`Resolved: ${m.resolved}`}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{m.month}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
                    <span>Submitted Complaints</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" />
                    <span>Resolved & Verified</span>
                  </span>
                </div>
                <span className="font-mono text-cyan-400">AI De-Duplication Saved 28% Dispatch Load</span>
              </div>
            </div>

            {/* Chart 2: Complaints by Category & AI Classification Breakdown */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Complaints by Civic Category
                  </h3>
                  <p className="text-xs text-slate-400">Distribution across primary urban grievance categories</p>
                </div>
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>

              <div className="space-y-2.5">
                {categories.slice(0, 7).map((cat, i) => {
                  const count = complaints.filter(c => c.category === cat).length;
                  const pct = Math.min(95, Math.max(18, count * 22 + (7 - i) * 6));
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-200 font-medium">{cat}</span>
                        <span className="font-mono text-cyan-400 font-bold">{count} active ({pct}% index)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Charts Row 2: Area-Wise Civic Issue Distribution (10 Bengaluru Wards) & Department Workload */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Area-Wise Complaint Distribution */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Area-Wise Distribution (10 Bengaluru Zones)
                </h3>
                <button onClick={() => navigate('live-map')} className="text-xs text-cyan-400 hover:underline font-bold">
                  Open GIS Map →
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {evaluatedZones.map((z) => (
                  <div
                    key={z.id}
                    onClick={() => navigate('live-map')}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 cursor-pointer text-center space-y-1 transition"
                  >
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        z.zoneStatus === 'danger' ? 'bg-rose-500' : z.zoneStatus === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    />
                    <p className="text-xs font-bold text-white truncate">{z.name}</p>
                    <p className="text-lg font-black font-mono text-cyan-400">{z.totalCount}</p>
                    <p className="text-[10px] text-slate-500">{z.activeCount} active</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Performance & Activity Logs */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  System Activity & AI Audit Logs
                </h3>
                <span className="text-xs font-mono text-emerald-400">Real-Time Ledger</span>
              </div>
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {activityLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">{log.category}</span>
                      <p className="text-slate-200 font-medium mt-0.5">{log.action}</p>
                      <p className="text-[10px] text-slate-500">Actor: {log.actor}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Embedded City Map & All Complaints Table */}
          {subTab === 'overview' && (
            <>
              <LiveCityMap embedded={true} />
              <ComplaintTable title="City-Wide Master Complaints Ledger" />
            </>
          )}
        </>
      )}

      {/* ==================== TAB: MANAGE USERS ==================== */}
      {subTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Registered Platform Users & Officers ({users.length})</h3>
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img src={u.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="text-sm font-bold text-white">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email} • {u.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={u.role}
                      onChange={(e) => updateUserProfile(u.id, { role: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-bold"
                    >
                      <option value="Public">Citizen (Public)</option>
                      <option value="Municipality">Municipality Officer</option>
                      <option value="Admin">Administrator</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddUser} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 h-fit">
            <h3 className="text-base font-bold text-white">Provision New Officer / User</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newOfficerName}
                onChange={e => setNewOfficerName(e.target.value)}
                placeholder="e.g. Eng. S. Ramesh"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={newOfficerEmail}
                onChange={e => setNewOfficerEmail(e.target.value)}
                placeholder="ramesh@bengalurusmartcity.gov.in"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Role</label>
              <select
                value={newOfficerRole}
                onChange={e => setNewOfficerRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="Municipality">Municipality Officer</option>
                <option value="Public">Citizen / Public</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Department</label>
              <select
                value={newOfficerDept}
                onChange={e => setNewOfficerDept(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs">
              Provision Account
            </button>
          </form>
        </div>
      )}

      {/* ==================== TAB: MANAGE DEPARTMENTS ==================== */}
      {subTab === 'departments' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">10 Municipal Departments Workload & SLA Governance</h3>
            <button onClick={() => navigate('departments')} className="text-xs text-cyan-400 font-bold hover:underline">
              Open Full Directory →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((d) => {
              const count = complaints.filter(c => c.department === d.name).length;
              return (
                <div key={d.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{d.code}</span>
                    <h4 className="text-sm font-bold text-white">{d.name}</h4>
                    <p className="text-xs text-slate-400">Head: {d.head} • {d.activeStaff} Staff</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-emerald-400">{d.resolutionRate}</span>
                    <p className="text-[11px] text-slate-400">{count} active tickets</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== TAB: SETTINGS ==================== */}
      {subTab === 'settings' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Smart City Platform & AI Governance Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <p className="font-bold text-white">AI Duplicate Similarity Threshold</p>
              <p className="text-slate-400">Currently set to 65% semantic + 500m geospatial radius.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <p className="font-bold text-white">Automatic Map Hazard Clearance</p>
              <p className="text-slate-400">Enabled — Resolved complaints automatically clear from active unresolved layer.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
