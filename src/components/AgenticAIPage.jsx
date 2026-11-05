import React, { useState, useEffect } from 'react';
import { useCivic } from '../context/CivicContext';
import {
  Bot,
  Sparkles,
  Cpu,
  CheckCircle2,
  Send,
  ShieldCheck,
  Play,
  Activity,
  MapPin,
  Layers
} from 'lucide-react';

export default function AgenticAIPage() {
  const {
    complaints,
    evaluatedZones,
    departments,
    updateComplaintStatus,
    navigate,
    setTrackingId,
    showToast
  } = useCivic();

  const [selectedTicketId, setSelectedTicketId] = useState(complaints[0]?.id || 'CM-2081');
  const [activeAgentStep, setActiveAgentStep] = useState(6);
  const [simulating, setSimulating] = useState(false);

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Greetings! I am CIVICMIND AI ASSISTANT, your autonomous civic operations agent. Ask me about any ticket ID (e.g., CM-2081), Bengaluru Red/Yellow/Green ward risk zones, duplicate complaint screening, or municipal SLA procedures.'
    }
  ]);

  const currentTicket = complaints.find(c => c.id === selectedTicketId) || complaints[0];

  // Exact 10-Step Agentic Workflow Required by Prompt
  const tenSteps = [
    { step: 1, title: 'STEP 1: Receive citizen complaint', detail: `Ingested payload for #${currentTicket?.id} from ${currentTicket?.reportedBy}.` },
    { step: 2, title: 'STEP 2: Analyse description and image', detail: `Computer Vision & NLP parsed "${currentTicket?.title}" (Confidence: ${Math.round((currentTicket?.aiScreening?.confidenceScore || 0.97) * 100)}%).` },
    { step: 3, title: 'STEP 3: Verify geographical location', detail: `Verified Bengaluru ward: ${currentTicket?.ward} (${currentTicket?.coordinates?.join(', ')}).` },
    { step: 4, title: 'STEP 4: Detect similar or duplicate complaints', detail: currentTicket?.aiScreening?.duplicateDetected ? `Merged duplicate cluster (#${currentTicket.aiScreening.duplicateTicket}).` : '0 unresolved duplicates within 500m radius.' },
    { step: 5, title: 'STEP 5: Determine issue category and severity', detail: `Classified as "${currentTicket?.category}" • Severity: ${currentTicket?.priority}.` },
    { step: 6, title: 'STEP 6: Identify responsible municipal department', detail: `Matched statutory jurisdiction: ${currentTicket?.department}.` },
    { step: 7, title: 'STEP 7: Recommend or initiate department assignment', detail: `Auto-generated work order for ${currentTicket?.department} Zonal Squad.` },
    { step: 8, title: 'STEP 8: Monitor complaint progress', detail: `Tracking SLA clock (${currentTicket?.expectedResolution || '24h SLA'}) • Current Status: ${currentTicket?.status}.` },
    { step: 9, title: 'STEP 9: Verify resolution evidence', detail: currentTicket?.resolutionProof ? 'Before/After field repair photo verified by Vision AI.' : 'Awaiting field engineer closure photo upload.' },
    { step: 10, title: 'STEP 10: Request citizen feedback and update city analytics', detail: currentTicket?.rating ? `Citizen rated ${currentTicket.rating}/5 ★; ward risk recalculated.` : 'Will trigger citizen 5-star review prompt upon resolution.' }
  ];

  const runLiveSimulation = () => {
    setSimulating(true);
    setActiveAgentStep(1);
    let current = 1;
    const timer = setInterval(() => {
      current += 1;
      if (current > 10) {
        clearInterval(timer);
        setSimulating(false);
        showToast(`10-Step Agentic Workflow simulation completed for #${currentTicket?.id}!`, 'success');
      } else {
        setActiveAgentStep(current);
      }
    }, 650);
  };

  const handleChatSend = (queryText = chatInput) => {
    if (!queryText.trim()) return;
    const q = queryText.trim();
    const userMsg = { id: `u_${Date.now()}`, sender: 'user', text: q };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const lower = q.toLowerCase();
      let reply = '';
      const idMatch = lower.match(/cm-\d{4}/i);
      if (idMatch) {
        const found = complaints.find(c => c.id.toLowerCase() === idMatch[0].toLowerCase());
        reply = found
          ? `Ticket #${found.id} ("${found.title}") in ${found.ward} is currently **${found.status}** under **${found.department}** with **${found.priority}** priority. AI Confidence: ${Math.round((found.aiScreening?.confidenceScore || 0.96) * 100)}%.`
          : `No active record found for ${idMatch[0].toUpperCase()}.`;
      } else if (lower.includes('duplicate')) {
        reply = 'When a citizen submits a complaint, STEP 4 of our Agentic Workflow compares GPS coordinates (500m radius) and semantic keywords against all unresolved tickets. If a match is found, citizens can co-sign the existing ticket (+1 upvote) instead of creating duplicate clutter.';
      } else if (lower.includes('zone') || lower.includes('red') || lower.includes('map')) {
        const reds = evaluatedZones.filter(z => z.zoneStatus === 'danger').map(z => z.name).join(', ');
        reply = `Bengaluru Risk Radar currently flags **${reds || 'Indiranagar, Koramangala'}** as Red Zones due to critical unresolved issues. Once field officers mark complaints Resolved, they automatically clear from the active hazard layer!`;
      } else {
        reply = `CIVICMIND AI is actively orchestrating ${complaints.length} complaints across 10 Bengaluru zones and 10 municipal departments. You can ask me about any ticket ID (like CM-2081), how to file a geotagged photo, or department SLA timelines.`;
      }
      setChatMessages(prev => [...prev, { id: `a_${Date.now()}`, sender: 'ai', text: reply }]);
    }, 350);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/50 to-indigo-950/60 border border-cyan-500/30 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>CIVICMIND AI ASSISTANT • Autonomous 10-Step Operations Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Agentic AI – CivicMind Intelligence Console
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Real-time multi-agent reasoning pipeline with confidence scoring, duplicate clustering, human-in-the-loop approval controls, and interactive citizen copilot.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedTicketId}
            onChange={(e) => setSelectedTicketId(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-mono font-bold"
          >
            {complaints.map(c => (
              <option key={c.id} value={c.id}>{c.id} — {c.ward} ({c.priority})</option>
            ))}
          </select>

          <button
            onClick={runLiveSimulation}
            disabled={simulating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg"
          >
            <Play className="w-4 h-4" />
            <span>{simulating ? 'Simulating 10 Steps...' : 'Simulate 10-Step Agent'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left 7 Cols = 10-Step Agentic Workflow & Human Approval Controls | Right 5 Cols = Interactive AI Chat Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 10-Step Agentic Workflow */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">10-Step Agentic Reasoning Pipeline (#{currentTicket?.id})</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
              Confidence: {Math.round((currentTicket?.aiScreening?.confidenceScore || 0.97) * 100)}%
            </span>
          </div>

          <div className="space-y-2.5">
            {tenSteps.map((item) => {
              const isCurrent = activeAgentStep === item.step;
              const isDone = activeAgentStep > item.step;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveAgentStep(item.step)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-md'
                      : isDone
                      ? 'bg-slate-950/90 border-emerald-500/30'
                      : 'bg-slate-950/50 border-slate-800 opacity-75'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-mono font-black flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-cyan-400 text-slate-950'
                          : isDone
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : item.step}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 whitespace-nowrap">
                    {isCurrent ? 'ACTIVE' : isDone ? 'VERIFIED' : 'QUEUED'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Human Approval Controls for Important Decisions */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Human-in-the-Loop Approval Controls</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Ticket #{currentTicket?.id}</span>
            </div>
            <p className="text-xs text-slate-300">
              Suggested Action: Confirm AI assignment to <strong>{currentTicket?.department}</strong> with <strong>{currentTicket?.priority}</strong> SLA priority.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  updateComplaintStatus(
                    currentTicket.id,
                    'Assigned',
                    'Human supervisor approved CivicMind AI department assignment.',
                    '',
                    { verifiedByOfficer: true }
                  )
                }
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs"
              >
                Approve AI Dispatch
              </button>
              <button
                onClick={() => {
                  setTrackingId(currentTicket.id);
                  navigate('track-complaint');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Inspect Full Ticket Audit
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Interactive CivicMind AI Chat Assistant */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-[680px] overflow-hidden">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">CIVICMIND AI ASSISTANT</h3>
                <p className="text-[10px] text-emerald-400">Online • Connected to Bengaluru Civic Database</p>
              </div>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap gap-1.5 text-[11px]">
            {[
              'Status of CM-2081',
              'How are duplicate complaints detected?',
              'Which Bengaluru zones are Red Zones?',
              'Status of CM-2082'
            ].map((chip, i) => (
              <button
                key={i}
                onClick={() => handleChatSend(chip)}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 transition"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-semibold'
                      : 'bg-slate-950 border border-slate-800 text-slate-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleChatSend();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask CivicMind AI about civic services or ticket IDs..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
