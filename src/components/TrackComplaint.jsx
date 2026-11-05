import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Sparkles,
  Star,
  ShieldCheck,
  Camera,
  MessageSquare,
  FileText,
  Bell
} from 'lucide-react';

export default function TrackComplaint() {
  const {
    complaints,
    trackingId,
    setTrackingId,
    currentUser,
    updateComplaintStatus,
    submitFeedback
  } = useCivic();

  const [searchInput, setSearchInput] = useState(trackingId || 'CM-2081');
  const [officerNotes, setOfficerNotes] = useState('');
  const [resolutionProofUrl, setResolutionProofUrl] = useState('');
  const [citizenRating, setCitizenRating] = useState(5);
  const [citizenReviewText, setCitizenReviewText] = useState('');

  const currentComplaint =
    complaints.find(c => c.id.toLowerCase() === (trackingId || '').toLowerCase()) || complaints[0];

  const isOfficerOrAdmin = currentUser?.role === 'Municipality' || currentUser?.role === 'Admin';

  // Exact 6-Stage Pipeline Required: Submitted → AI Screened → Verified → Assigned → In Progress → Resolved
  const lifecycleStages = [
    { key: 'Submitted', label: 'Submitted' },
    { key: 'AI Screened', label: 'AI Screened' },
    { key: 'Verified', label: 'Verified' },
    { key: 'Assigned', label: 'Assigned' },
    { key: 'In Progress', label: 'In Progress' },
    { key: 'Resolved', label: 'Resolved' }
  ];

  const stageOrder = ['Submitted', 'AI Screened', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
  const currentStageIdx = Math.max(
    1,
    stageOrder.findIndex(s => s.toLowerCase() === (currentComplaint?.status || '').toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const found = complaints.find(
      c =>
        c.id.toLowerCase() === searchInput.trim().toLowerCase() ||
        c.title.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
        c.ward.toLowerCase().includes(searchInput.trim().toLowerCase())
    );
    if (found) {
      setTrackingId(found.id);
      setSearchInput(found.id);
    }
  };

  if (!currentComplaint) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            <span>Real-Time Lifecycle Audit & Tracking</span>
          </div>
          <h1 className="text-2xl font-black text-white">Track Complaint Progress</h1>
          <p className="text-xs text-slate-400">
            Submitted → AI Screened → Verified → Assigned → In Progress → Resolved
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full md:w-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter Complaint ID (e.g. CM-2081)"
            className="w-full md:w-64 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition"
          >
            Track
          </button>
        </form>
      </div>

      {/* Quick Ticket Switcher Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-mono flex-shrink-0">Select Active Ticket:</span>
        {complaints.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setTrackingId(c.id);
              setSearchInput(c.id);
            }}
            className={`px-3 py-1.5 rounded-xl border font-mono transition flex items-center space-x-1.5 flex-shrink-0 ${
              currentComplaint.id === c.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{c.id}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                c.status === 'Resolved' ? 'bg-emerald-400' : c.status === 'In Progress' ? 'bg-cyan-400' : 'bg-amber-400'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Visual 6-Stage Progress Stepper Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {lifecycleStages.map((stage, idx) => {
            const isCompleted =
              currentComplaint.status === 'Resolved' ||
              idx <= currentStageIdx ||
              currentComplaint.timeline.some(t => t.step.toLowerCase() === stage.key.toLowerCase());
            const isCurrent = currentComplaint.status.toLowerCase() === stage.key.toLowerCase();

            return (
              <div
                key={stage.key}
                className={`p-3.5 rounded-2xl border text-center transition ${
                  isCurrent
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="w-7 h-7 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-black bg-slate-900 border border-current">
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <p className="text-xs font-bold">{stage.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Complaint Metadata, Evidence, Geographical Location & Officer Action */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-xs font-bold">
                {currentComplaint.id}
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                {currentComplaint.status}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white leading-snug">{currentComplaint.title}</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{currentComplaint.description}</p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-video relative bg-slate-950">
              <img src={currentComplaint.image} alt="" className="w-full h-full object-cover" />
              <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/85 text-[10px] text-cyan-300 font-semibold flex items-center space-x-1">
                <Camera className="w-3 h-3" />
                <span>Submitted Citizen Evidence</span>
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Department:</span>
                <span className="text-cyan-400 font-bold text-right">{currentComplaint.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Geographical Location:</span>
                <span className="text-white font-semibold text-right">{currentComplaint.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GPS Coordinates:</span>
                <span className="text-slate-300 font-mono">
                  {currentComplaint.coordinates?.join(', ') || '12.9784, 77.6408'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Resolution:</span>
                <span className="text-amber-300 font-mono">
                  {currentComplaint.expectedResolution || 'Within 24h SLA'}
                </span>
              </div>
              {currentComplaint.officerRemarks && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mt-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                    Latest Officer Remarks:
                  </span>
                  <p className="text-xs text-slate-200 mt-0.5">{currentComplaint.officerRemarks}</p>
                </div>
              )}
            </div>
          </div>

          {/* Officer Status Mutation Box */}
          {isOfficerOrAdmin && (
            <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Officer Lifecycle Controls</span>
              </div>
              <textarea
                rows="2"
                value={officerNotes}
                onChange={e => setOfficerNotes(e.target.value)}
                placeholder="Add official officer remarks or closure certification..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={resolutionProofUrl}
                onChange={e => setResolutionProofUrl(e.target.value)}
                placeholder="Resolution photograph URL (optional)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => updateComplaintStatus(currentComplaint.id, 'Verified', officerNotes || 'AI Screening verified by officer.')}
                  className="py-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                >
                  Mark Verified
                </button>
                <button
                  onClick={() => updateComplaintStatus(currentComplaint.id, 'Assigned', officerNotes || 'Assigned to Zonal Engineering Squad.')}
                  className="py-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30"
                >
                  Mark Assigned
                </button>
                <button
                  onClick={() => updateComplaintStatus(currentComplaint.id, 'In Progress', officerNotes || 'Field repair in progress.')}
                  className="py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                >
                  Set In Progress
                </button>
                <button
                  onClick={() => updateComplaintStatus(currentComplaint.id, 'Resolved', officerNotes || 'Repair completed and verified.', resolutionProofUrl)}
                  className="py-2 rounded-xl bg-emerald-500 text-slate-950 font-black"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Detailed Audit Timeline, Resolution Photographs & Citizen Feedback */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Chronological Activity & Notification Log</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                <Bell className="w-3.5 h-3.5" />
                <span>SMS / Push Alerts Active</span>
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {currentComplaint.timeline.map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400 uppercase">{item.step}</span>
                      <span className="text-[11px] font-mono text-slate-500">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resolution Photographs if Resolved */}
            {currentComplaint.status === 'Resolved' && currentComplaint.resolutionProof && (
              <div className="p-5 rounded-2xl bg-emerald-950/25 border border-emerald-500/40 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Official Resolution Photograph & Certification</span>
                </div>
                <img
                  src={currentComplaint.resolutionProof}
                  alt="Resolution Proof"
                  className="w-full max-h-64 object-cover rounded-xl border border-emerald-500/30"
                />
                {currentComplaint.resolutionNotes && (
                  <p className="text-xs text-emerald-200">
                    <strong>Closure Remarks:</strong> {currentComplaint.resolutionNotes}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
