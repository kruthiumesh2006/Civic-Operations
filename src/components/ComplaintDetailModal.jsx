import React from 'react';
import { useCivic } from '../context/CivicContext';
import { 
  X, 
  MapPin, 
  Building2, 
  Calendar, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Camera
} from 'lucide-react';

export default function ComplaintDetailModal() {
  const { 
    selectedComplaintDetail, 
    setSelectedComplaintDetail, 
    currentUser, 
    updateComplaintStatus, 
    setActiveTab, 
    setTrackingId 
  } = useCivic();

  if (!selectedComplaintDetail) return null;

  const c = selectedComplaintDetail;
  const isOfficerOrAdmin = currentUser?.role === 'Municipality' || currentUser?.role === 'Admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              {c.id}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              c.status === 'Resolved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : c.status === 'In Progress'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {c.status}
            </span>
          </div>

          <button
            onClick={() => setSelectedComplaintDetail(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Title & Description */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2 leading-snug">
              {c.title}
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              {c.description}
            </p>
          </div>

          {/* Evidence Image */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video relative">
            <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
            <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-[10px] text-white flex items-center space-x-1.5">
              <Camera className="w-3 h-3 text-cyan-400" />
              <span>Evidence Photo Attached</span>
            </span>
          </div>

          {/* AI Screening Breakdown */}
          {c.aiScreening && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Agentic AI 1st Level Screening Analysis</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {c.aiScreening.aiSummary}
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  Confidence: {(c.aiScreening.confidenceScore * 100).toFixed(0)}%
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                  Hazard Level: {c.aiScreening.hazardLevel}
                </span>
                {c.aiScreening.duplicateDetected && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Merged Duplicate: #{c.aiScreening.duplicateTicket || 'CM-Cluster'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px]">Category</span>
              <span className="font-semibold text-white">{c.category}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Department</span>
              <span className="font-semibold text-cyan-400">{c.department}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Location & Ward</span>
              <span className="font-semibold text-white truncate block">{c.area}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Priority</span>
              <span className={`font-semibold ${c.priority === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                {c.priority}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Reported By</span>
              <span className="text-slate-200">{c.reportedBy}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Logged At</span>
              <span className="text-slate-200 font-mono">{c.createdAt}</span>
            </div>
          </div>

          {/* Resolution Details if any */}
          {c.status === 'Resolved' && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Resolved & Certified</span>
              </div>
              {c.resolutionNotes && (
                <p className="text-emerald-200 text-xs">
                  <strong>Notes:</strong> {c.resolutionNotes}
                </p>
              )}
              {c.resolutionProof && (
                <div className="mt-2 rounded-lg overflow-hidden border border-emerald-500/30 aspect-video">
                  <img src={c.resolutionProof} alt="Proof" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setTrackingId(c.id);
                setSelectedComplaintDetail(null);
                setActiveTab('track');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md transition"
            >
              <span>Track Full Timeline</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {isOfficerOrAdmin && c.status !== 'Resolved' && (
              <button
                onClick={() => {
                  updateComplaintStatus(c.id, 'Resolved', 'Resolved via Operations Console quick certification.');
                  setSelectedComplaintDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Quick Resolve</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
