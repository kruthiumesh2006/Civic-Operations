import React, { useState, useRef, useEffect } from 'react';
import { useCivic } from '../context/CivicContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  Zap, 
  CornerDownLeft, 
  CheckCircle2, 
  MapPin, 
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

export default function CivicMindAI() {
  const { 
    aiAssistantOpen, 
    setAiAssistantOpen, 
    complaints, 
    evaluatedZones, 
    departments,
    setActiveTab,
    setFileComplaintModalOpen,
    setTrackingId
  } = useCivic();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      time: 'Just now',
      text: 'Greetings citizen! I am CivicMind Agent, your AI-powered smart city co-pilot. I monitor real-time municipal telemetry, perform 1st-level grievance screening, and assist with municipal services. How can I help you today?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (aiAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, aiAssistantOpen]);

  if (!aiAssistantOpen) {
    return (
      <button
        onClick={() => setAiAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-2xl shadow-cyan-500/30 border border-cyan-400/40 flex items-center space-x-2.5 transition-all transform hover:scale-105 active:scale-95 group"
      >
        <div className="relative">
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950"></span>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold leading-none">CivicMind AI</p>
          <p className="text-[10px] text-cyan-200">Smart City Copilot</p>
        </div>
      </button>
    );
  }

  // Knowledge base and real-time response generation
  const generateAgentResponse = (userQuery) => {
    const q = userQuery.toLowerCase();

    // 1. Ticket status lookup (e.g., "CM-1081")
    const ticketMatch = q.match(/cm-\d{4}/i);
    if (ticketMatch) {
      const ticketId = ticketMatch[0].toUpperCase();
      const comp = complaints.find(c => c.id.toUpperCase() === ticketId);
      if (comp) {
        return {
          text: `Here is the real-time telemetry for **${comp.id}**:
• **Title:** ${comp.title}
• **Status:** ${comp.status.toUpperCase()}
• **Department:** ${comp.department}
• **Area:** ${comp.area}
• **Priority:** ${comp.priority}
• **AI Hazard Classification:** ${comp.aiScreening?.hazardLevel || 'Standard Routine'}
${comp.status === 'Resolved' ? '✅ This complaint has been rectified and approved.' : '⏳ Zonal squad is currently handling this issue.'}`,
          action: { label: `Track ${comp.id} Lifecycle`, onClick: () => { setTrackingId(comp.id); setActiveTab('track'); } }
        };
      } else {
        return {
          text: `I searched the civic operations ledger but could not locate ticket **${ticketId}**. You can view all active complaints on the Operations Dashboard.`
        };
      }
    }

    // 2. Duplicate complaints logic
    if (q.includes('duplicate') || q.includes('eliminate') || q.includes('screening')) {
      return {
        text: `**CivicMind Agentic AI 1st Level Screening:**
When a citizen lodges a grievance, our AI Agent performs an instant multi-vector check:
1. **Semantic Text Matching:** Compares keywords and problem descriptions against all open tickets within a 1km radius.
2. **Geospatial Proximity:** Triangulates GPS coordinates with active work orders.
3. **De-duplication Merging:** If similarity exceeds 70%, the new report is merged into the existing master ticket as a co-signer, preventing redundant crew dispatches and boosting municipal priority!
4. **Auto-Elimination:** Once field teams certify resolution, the issue is cleared from the live map automatically.`
      };
    }

    // 3. Red / Yellow / Green Map Zones
    if (q.includes('red') || q.includes('map') || q.includes('yellow') || q.includes('green') || q.includes('zone')) {
      const redCount = evaluatedZones.filter(z => z.zoneStatus === 'danger').length;
      return {
        text: `**Geographical Risk Map Analysis:**
• 🔴 **Red Zones (${redCount} currently):** High grievance density or critical public hazards (e.g. road craters, live wires).
• 🟡 **Yellow Zones:** Moderate civic activity with 1 complaint currently in progress.
• 🟢 **Green Zones:** Safe sectors where all reported issues are 100% resolved.
When officers mark a ticket as resolved, the map dynamically re-computes ward density in real time!`,
        action: { label: 'Open Live Hotspot Map', onClick: () => setActiveTab('map') }
      };
    }

    // 4. Filing complaint / Camera
    if (q.includes('file') || q.includes('camera') || q.includes('photo') || q.includes('report') || q.includes('pothole')) {
      return {
        text: `To file a complaint:
1. Click **"File Complaint"** on the top navigation bar.
2. Grant browser camera permission to snap a real-time geotagged photo.
3. Our GPS module automatically fetches your exact latitude, longitude, and municipal ward.
4. CivicAgent assesses urgency, assigns priority (Critical/High/Medium), and routes the ticket to the correct municipal department instantly!`,
        action: { label: 'Launch File Complaint Form', onClick: () => setFileComplaintModalOpen(true) }
      };
    }

    // 5. Emergency Hotlines
    if (q.includes('emergency') || q.includes('helpline') || q.includes('contact') || q.includes('phone')) {
      return {
        text: `**Municipal Emergency Hotlines:**
• 🚧 **Public Works & Roads (PWD):** +91 80 2266 1001
• 💧 **Water Supply & Sewage (BWSSB):** +91 80 2266 1002
• 🗑️ **Solid Waste Sanitation (SWM):** +91 80 2266 1003
• ⚡ **Electrical Emergency & Grid:** +91 80 2266 1004
• 🚦 **Traffic Police Control Room:** +91 80 2266 1005
• 🚑 **Urban Health & Ambulance:** 108 / 112`
      };
    }

    // Default intelligent overview
    return {
      text: `CivicMind OS is actively monitoring ${complaints.length} urban incidents across ${departments.length} departments.
You can ask me to:
• Look up any ticket status (e.g. *"What is the status of CM-1081?"*)
• Explain how duplicate complaints are eliminated
• Show safety zone analytics (Red/Yellow/Green wards)
• Guide you through live photo capture and GPS filing.`
    };
  };

  const handleSendMessage = (textToSend = inputMessage) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      time: 'Just now',
      text: textToSend.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const responseData = generateAgentResponse(textToSend);
      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        time: 'Just now',
        text: responseData.text,
        action: responseData.action
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[550px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      {/* Top Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>CivicMind Assistant</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                AI Copilot
              </span>
            </h4>
            <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              <span>Online • Autonomous Grievance Engine</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setAiAssistantOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
        {[
          'Status of CM-1081',
          'How duplicates are eliminated?',
          'Explain Red/Green zones',
          'Emergency hotlines'
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-cyan-950/50 text-slate-300 hover:text-cyan-300 border border-slate-800 whitespace-nowrap transition flex-shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-sm'
              }`}
            >
              <div className="whitespace-pre-line text-xs font-normal">
                {msg.text}
              </div>

              {/* Action Button inside message */}
              {msg.action && (
                <button
                  onClick={() => {
                    msg.action.onClick();
                    setAiAssistantOpen(false);
                  }}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-[11px] flex items-center justify-center space-x-1 transition"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{msg.action.label}</span>
                </button>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 w-24">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about complaints, wards, or departments..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
