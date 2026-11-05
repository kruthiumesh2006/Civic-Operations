import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Upload,
  Wrench,
  Building2,
  AlertTriangle
} from 'lucide-react';

export default function ComplaintTable({ title = 'Municipal Complaint Management Console' }) {
  const {
    complaints,
    departments,
    categories,
    currentUser,
    updateComplaintStatus,
    setSelectedComplaintDetail,
    setTrackingId,
    navigate
  } = useCivic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Officer Action Modal State
  const [managingTicket, setManagingTicket] = useState(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [assignedDept, setAssignedDept] = useState('');
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [resolutionProof, setResolutionProof] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const openManageModal = (comp) => {
    setManagingTicket(comp);
    setNewStatus(comp.status);
    setAssignedDept(comp.department);
    setOfficerRemarks(comp.officerRemarks || '');
    setResolutionProof(comp.resolutionProof || '');
    setRejectReason('');
  };

  const handleSaveOfficerAction = async (e) => {
    e.preventDefault();
    if (!managingTicket) return;
    const notes =
      newStatus === 'Rejected'
        ? `Rejected: ${rejectReason || 'Invalid / unverifiable complaint'}`
        : officerRemarks || `Status updated to ${newStatus}`;

    await updateComplaintStatus(managingTicket.id, newStatus, notes, resolutionProof, {
      department: assignedDept,
      officerRemarks: notes,
      verifiedByOfficer: true
    });
    setManagingTicket(null);
  };

  const handleProofFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setResolutionProof(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || c.priority === selectedPriority;

    return matchesSearch && matchesCat && matchesStatus && matchesPriority;
  });

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-5 border-b border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>{title}</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {filtered.length} Complaints
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verify AI screening, assign municipal departments, dispatch squads, or reject invalid tickets with audit notes.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, ward, issue, department..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center space-x-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filter:</span>
          </span>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
          >
            <option value="All">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="AI Screened">AI Screened</option>
            <option value="Verified">Verified</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
          >
            <option value="All">Priority: All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
          >
            <option value="All">Category: All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Required Columns: Complaint ID | Issue | Location | Priority | AI Classification | Department | Status | Action */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/90 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
            <tr>
              <th className="px-4 py-3.5">Complaint ID</th>
              <th className="px-4 py-3.5">Issue</th>
              <th className="px-4 py-3.5">Location</th>
              <th className="px-4 py-3.5">Priority</th>
              <th className="px-4 py-3.5">AI Classification</th>
              <th className="px-4 py-3.5">Department</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {filtered.map((comp) => {
              const isCritical = comp.priority === 'Critical';
              const isResolved = comp.status === 'Resolved';
              const isRejected = comp.status === 'Rejected';
              const aiVerified = comp.aiScreening?.verifiedByOfficer;

              return (
                <tr
                  key={comp.id}
                  onClick={() => setSelectedComplaintDetail(comp)}
                  className="hover:bg-slate-800/40 transition cursor-pointer"
                >
                  {/* Complaint ID */}
                  <td className="px-4 py-3.5 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {comp.id}
                    <span className="block text-[10px] text-slate-500 font-normal">{comp.createdAt.split(' ')[0]}</span>
                  </td>

                  {/* Issue */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-2.5 max-w-xs">
                      <img
                        src={comp.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate" title={comp.title}>
                          {comp.title}
                        </p>
                        <span className="text-[10px] text-slate-400">{comp.category}</span>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-white">{comp.ward}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px]" title={comp.area}>
                      {comp.area}
                    </p>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : comp.priority === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {comp.priority}
                    </span>
                  </td>

                  {/* AI Classification */}
                  <td className="px-4 py-3.5">
                    <div className="space-y-1">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>{Math.round((comp.aiScreening?.confidenceScore || 0.95) * 100)}% Match</span>
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {aiVerified ? '✓ Officer Verified' : 'Awaiting Officer Check'}
                      </span>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3.5">
                    <span className="text-cyan-300 font-medium block max-w-[160px] truncate" title={comp.department}>
                      {comp.department}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                        isResolved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isRejected
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : comp.status === 'In Progress' || comp.status === 'Assigned'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          setTrackingId(comp.id);
                          navigate('track-complaint');
                        }}
                        className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400"
                        title="Track Audit Timeline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {!aiVerified && (
                        <button
                          onClick={() =>
                            updateComplaintStatus(
                              comp.id,
                              'Verified',
                              'AI Screening verified by Municipal Officer.',
                              '',
                              { verifiedByOfficer: true }
                            )
                          }
                          className="px-2 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold"
                          title="Verify AI Screening"
                        >
                          Verify AI
                        </button>
                      )}

                      <button
                        onClick={() => openManageModal(comp)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold flex items-center space-x-1"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Manage</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Officer Manage / Verify / Assign / Resolve / Reject Modal */}
      {managingTicket && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setManagingTicket(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400">{managingTicket.id}</span>
                <h3 className="text-base font-bold text-white">Municipal Officer Action Console</h3>
              </div>
              <button onClick={() => setManagingTicket(null)} className="text-xs text-slate-400 hover:text-white">
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSaveOfficerAction} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Assign / Re-Assign Department</label>
                <select
                  value={assignedDept}
                  onChange={(e) => setAssignedDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Update Lifecycle Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-bold"
                >
                  <option value="Verified">✓ Verified (Approve AI Screening)</option>
                  <option value="Assigned">📋 Assigned to Department Squad</option>
                  <option value="In Progress">🚧 In Progress (Crew On-Site)</option>
                  <option value="Resolved">✅ Resolved (Close & Upload Proof)</option>
                  <option value="Rejected">❌ Rejected (Invalid / Duplicate)</option>
                </select>
              </div>

              {newStatus === 'Rejected' ? (
                <div>
                  <label className="block font-semibold text-rose-300 mb-1">Rejection Reason *</label>
                  <input
                    type="text"
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Unverifiable photo or outside municipal jurisdiction"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-500/40 text-white"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Officer Remarks / Resolution Notes</label>
                  <textarea
                    rows="2"
                    value={officerRemarks}
                    onChange={(e) => setOfficerRemarks(e.target.value)}
                    placeholder="Enter field inspection notes or closure certification details..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              )}

              {newStatus === 'Resolved' && (
                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                  <label className="block font-semibold text-emerald-400">
                    Upload Resolution Evidence Photograph
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={resolutionProof}
                      onChange={(e) => setResolutionProof(e.target.value)}
                      placeholder="Paste image URL or upload local file..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                    <label className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-pointer font-bold">
                      Upload
                      <input type="file" accept="image/*" onChange={handleProofFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setManagingTicket(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black"
                >
                  Apply Officer Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
