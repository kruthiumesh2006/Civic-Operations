import React, { useState, useEffect } from 'react';
import { useCivic } from '../context/CivicContext';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  MapPin,
  Bot,
  ArrowRight,
  CheckCircle2,
  Camera,
  Cpu,
  Send,
  Star,
  Activity,
  Clock,
  Layers,
  Phone,
  Mail,
  Globe,
  ChevronRight,
  Zap,
  Users,
  AlertTriangle,
  Eye,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const {
    complaints,
    departments,
    evaluatedZones,
    currentUser,
    navigate,
    setTrackingId,
    showToast
  } = useCivic();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [selectedPreviewZone, setSelectedPreviewZone] = useState(evaluatedZones[0]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  // Animate the 4-stage AI Complaint Flow visual automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePipelineStep(prev => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const totalCount = complaints.length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const activeCount = complaints.filter(c => c.status !== 'Resolved').length;

  const flowSteps = [
    {
      step: '01',
      title: 'Citizen Geo-Report & Live Snap',
      subtitle: 'Camera + GPS Triangulation',
      desc: 'Citizen captures a live photo of a pothole, garbage dump, or water leak. Browser GPS locks exact Bengaluru ward coordinates and timestamp.',
      icon: Camera,
      badge: 'Input Captured'
    },
    {
      step: '02',
      title: 'Agentic AI 1st-Level Screening',
      subtitle: 'Vision Triage & De-Duplication',
      desc: 'CivicMind AI analyzes image severity, detects duplicate complaints within 500m, scores hazard urgency, and classifies the issue with 98% accuracy.',
      icon: Bot,
      badge: 'AI Screened (98%)'
    },
    {
      step: '03',
      title: 'Automated Municipal Dispatch',
      subtitle: 'Smart SLA Routing to 10 Depts',
      desc: 'Verified work orders are auto-routed to the responsible Bengaluru municipal department and field engineer with live GIS red/yellow/green heatmap updates.',
      icon: Cpu,
      badge: 'Crew Dispatched'
    },
    {
      step: '04',
      title: 'Verified Resolution & Citizen Rating',
      subtitle: 'Proof Upload & Map Auto-Clear',
      desc: 'Field officer uploads repair evidence photo. Resolved issues vanish from the active hazard map and citizens rate the resolution quality.',
      icon: CheckCircle2,
      badge: 'Certified & Rated'
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    showToast(`Thank you, ${contactForm.name}! Your inquiry has been sent to the CivicMind Command Centre.`, 'success');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#04091a] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* ==================== STICKY NAVIGATION BAR ==================== */}
      <header className="sticky top-0 z-50 bg-[#04091a]/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40 group-hover:scale-105 transition">
              <Building2 className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#04091a] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white">
                  CIVIC<span className="text-cyan-400">MIND</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  AI-OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                Smart City Operations Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links: Home | About | Features | Departments | How It Works | Contact | Login | Get Started */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold text-slate-300">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'About', id: 'about' },
              { label: 'Features', id: 'features' },
              { label: 'Departments', id: 'departments-section' },
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'Bengaluru Map', id: 'map-preview' },
              { label: 'Contact', id: 'contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-3 py-2 rounded-xl hover:text-cyan-400 hover:bg-slate-900/70 transition"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Auth / CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <button
                onClick={() => navigate('dashboard')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center space-x-2 transition"
              >
                <span>Open {currentUser.role} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('login')}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('signup')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/30 flex items-center space-x-1.5 transition"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-2">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'About & Mission', id: 'about' },
              { label: 'Platform Features', id: 'features' },
              { label: 'Municipal Departments', id: 'departments-section' },
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'Bengaluru Map Preview', id: 'map-preview' },
              { label: 'Contact', id: 'contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-900 hover:text-cyan-400"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => navigate('login')}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white"
              >
                Login
              </button>
              <button
                onClick={() => navigate('signup')}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ==================== 1. HERO SECTION ==================== */}
      <section id="hero" className="relative pt-12 pb-24 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Futuristic Ambient Grid & Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Next-Gen Agentic Civic Operations System • Bengaluru Digital Twin</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Building Smarter Cities.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  Resolving Problems Faster.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                An intelligent civic operations ecosystem connecting citizens, municipal authorities and AI to create cleaner, safer and smarter cities.
              </p>

              {/* Primary CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('signup')}
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 font-black text-sm shadow-2xl shadow-cyan-500/30 flex items-center space-x-2 transform hover:-translate-y-0.5 transition"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('live-map')}
                  className="px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 font-bold text-sm flex items-center space-x-2 transition"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Explore Platform</span>
                </button>

                <button
                  onClick={() => navigate('file-complaint')}
                  className="px-5 py-4 rounded-2xl bg-slate-950/90 hover:bg-slate-900 text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center space-x-2 transition"
                >
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>File Smart Complaint</span>
                </button>
              </div>

              {/* Live City Telemetry Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md">
                  <span className="text-2xl font-black text-white font-mono">{totalCount + 1480}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Complaints Screened</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md">
                  <span className="text-2xl font-black text-emerald-400 font-mono">94.8%</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">SLA Resolution Rate</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md">
                  <span className="text-2xl font-black text-cyan-400 font-mono">{departments.length} Depts</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Unified Civic Grid</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-md">
                  <span className="text-2xl font-black text-amber-400 font-mono">4.2 hrs</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Avg Triage Speed</p>
                </div>
              </div>
            </div>

            {/* Hero Right: Animated Visual Showing How a Complaint Travels Through AI Screening → Assignment → Resolution → Feedback */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                      Live Agentic Lifecycle Pipeline
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Auto-Simulating</span>
                </div>

                <div className="space-y-3">
                  {flowSteps.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = activePipelineStep === idx;
                    const isCompleted = activePipelineStep > idx;

                    return (
                      <div
                        key={item.step}
                        onClick={() => setActivePipelineStep(idx)}
                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/60 border-cyan-400/60 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                            : isCompleted
                            ? 'bg-slate-950/80 border-emerald-500/30 opacity-90'
                            : 'bg-slate-950/50 border-slate-800/80 opacity-65 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start space-x-3.5">
                          <div
                            className={`p-2.5 rounded-xl flex-shrink-0 ${
                              isActive
                                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                                : isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-900 text-slate-400 border border-slate-800'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                                STEP {item.step} • {item.subtitle}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isActive
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                    : isCompleted
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {item.badge}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-white mt-0.5">{item.title}</h3>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Portal Launchers inside Hero Card */}
                <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => navigate('citizen-dashboard')}
                    className="py-2 px-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[11px] font-bold text-center transition"
                  >
                    👤 Citizen View
                  </button>
                  <button
                    onClick={() => navigate('municipality-dashboard')}
                    className="py-2 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold text-center transition"
                  >
                    🏛️ Officer View
                  </button>
                  <button
                    onClick={() => navigate('admin-dashboard')}
                    className="py-2 px-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] font-bold text-center transition"
                  >
                    👑 Admin View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. ABOUT CIVICMIND & OUR MISSION ==================== */}
      <section id="about" className="py-20 bg-slate-950/80 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                About CivicMind & Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Transforming Urban Governance from Reactive Paperwork to Autonomous Action
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Traditional municipal grievance portals suffer from thousands of duplicate tickets, manual misrouting across departments, zero spatial risk visibility, and unverified closures.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                <strong className="text-white">Our Mission:</strong> Empower every resident, field engineer, and city administrator with an Agentic AI Command System that screens evidence in milliseconds, prevents duplicate work orders, maps urban risk zones dynamically in Red, Yellow, and Green, and guarantees citizen-verified resolution.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs font-bold text-cyan-400 uppercase">Zero Duplicate Clutter</p>
                  <p className="text-xs text-slate-400 mt-1">
                    AI clusters similar reports within 500m into one high-priority work order.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs font-bold text-emerald-400 uppercase">100% Proof-Backed</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Every closure requires field photo proof and unlocks citizen 5-star ratings.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                alt="Smart City Command Center"
                className="w-full h-80 object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04091a] via-[#04091a]/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-slate-950/90 border border-slate-800 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono text-cyan-400 font-bold">BENGALURU DIGITAL TWIN GRID</p>
                    <p className="text-sm font-bold text-white mt-0.5">
                      10 Major Wards • 10 Municipal Departments • Real-Time GIS Telemetry
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('ai-assistant')}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center space-x-1"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Explore AI Agent</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. PLATFORM FEATURES & AI OPERATIONS ==================== */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              AI-Powered Civic Operations Architecture
            </h2>
            <p className="text-sm text-slate-400">
              Built for national-scale urban resilience with multi-agent screening, live camera geotagging, and dynamic GIS risk zoning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'AI First-Level Screening & Vision',
                desc: 'Automatically inspects uploaded evidence photos and text descriptions to classify categories, assess severity, and route to the right department.',
                icon: Bot,
                action: () => navigate('ai-screening'),
                cta: 'Open AI Screening Lab'
              },
              {
                title: 'Smart Duplicate Prevention',
                desc: 'Detects similar unresolved issues in the same neighbourhood and lets citizens co-sign existing tickets instead of creating duplicates.',
                icon: Layers,
                action: () => navigate('file-complaint'),
                cta: 'Test Duplicate Check'
              },
              {
                title: 'Red / Yellow / Green GIS Risk Zones',
                desc: 'Interactive Bengaluru map colors wards by active complaint density, severity, and recency. Resolved tickets automatically clear from active hazard layers.',
                icon: MapPin,
                action: () => navigate('live-map'),
                cta: 'Launch Bengaluru GIS Map'
              },
              {
                title: 'Live Camera & GPS Geotagging',
                desc: 'Captures live photos directly from the citizen browser camera and attaches verified latitude, longitude, and capture timestamps.',
                icon: Camera,
                action: () => navigate('file-complaint'),
                cta: 'Open Camera Filing'
              },
              {
                title: 'Role-Based Command Centres',
                desc: 'Dedicated tailored workspaces for Citizens, Municipality Field Officers, and City Administrators with full lifecycle audit trails.',
                icon: ShieldCheck,
                action: () => navigate('municipality-dashboard'),
                cta: 'Inspect Officer Console'
              },
              {
                title: '10-Step Agentic AI Copilot',
                desc: 'Interactive CivicMind AI Assistant guides citizens, monitors SLA breaches, verifies resolution evidence, and updates city health analytics.',
                icon: Zap,
                action: () => navigate('ai-assistant'),
                cta: 'Launch AI Copilot'
              }
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  onClick={feat.action}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 shadow-xl transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400">
                    <span>{feat.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 4. HOW CIVICMIND WORKS ==================== */}
      <section id="how-it-works" className="py-20 bg-slate-950/90 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                Automated Complaint Lifecycle
              </span>
              <h2 className="text-3xl font-black text-white mt-2">
                How CivicMind Works: 6-Stage Verified Audit Trail
              </h2>
            </div>
            <button
              onClick={() => navigate('track-complaint')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold flex items-center space-x-2"
            >
              <span>Track Live Ticket (#CM-2081)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { stage: '1. Submitted', desc: 'Photo + GPS coordinates captured by citizen.' },
              { stage: '2. AI Screened', desc: 'De-duplicated, categorized & priority scored.' },
              { stage: '3. Verified', desc: 'Municipality officer validates AI triage.' },
              { stage: '4. Assigned', desc: 'Routed to specific zonal department squad.' },
              { stage: '5. In Progress', desc: 'Field crew on-site executing repair.' },
              { stage: '6. Resolved', desc: 'Proof uploaded, map updated & citizen rated.' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 relative">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  STAGE 0{idx + 1}
                </span>
                <h4 className="text-sm font-bold text-white mt-2">{item.stage}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. BENGALURU SMART-CITY MAP PREVIEW ==================== */}
      <section id="map-preview" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
                Live Bengaluru GIS Intelligence
              </span>
              <h2 className="text-3xl font-black text-white mt-2">
                Bengaluru Smart-City Neighbourhood Risk Radar
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Click any of the 10 Bengaluru zones below to inspect real-time risk classification or launch the full-screen interactive GIS map.
              </p>
            </div>
            <button
              onClick={() => navigate('live-map')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/25"
            >
              <MapPin className="w-4 h-4" />
              <span>Open Full-Screen Bengaluru GIS Map</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 10 Bengaluru Zones Selector Grid */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {evaluatedZones.map((zone) => {
                const isRed = zone.zoneStatus === 'danger';
                const isYellow = zone.zoneStatus === 'warning';
                const isSelected = selectedPreviewZone?.id === zone.id;

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedPreviewZone(zone)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected ? 'ring-2 ring-cyan-400 scale-[1.02]' : ''
                    } ${
                      isRed
                        ? 'bg-rose-950/25 border-rose-500/40 hover:bg-rose-950/40'
                        : isYellow
                        ? 'bg-amber-950/25 border-amber-500/40 hover:bg-amber-950/40'
                        : 'bg-emerald-950/25 border-emerald-500/40 hover:bg-emerald-950/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isRed ? 'bg-rose-500 animate-ping' : isYellow ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                        />
                        <span className="text-[10px] font-mono text-slate-400">{zone.code}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-2">{zone.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{zone.majorCategory}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-bold">
                      <span className={isRed ? 'text-rose-400' : isYellow ? 'text-amber-400' : 'text-emerald-400'}>
                        {isRed ? 'RED ZONE' : isYellow ? 'YELLOW' : 'GREEN SAFE'}
                      </span>
                      <span className="text-white font-mono">{zone.activeCount} active</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Zone Analytics Card */}
            {selectedPreviewZone && (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{selectedPreviewZone.code}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedPreviewZone.zoneStatus === 'danger'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : selectedPreviewZone.zoneStatus === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {selectedPreviewZone.riskLevel}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">{selectedPreviewZone.fullName}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{selectedPreviewZone.description}</p>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-lg font-black text-white font-mono">{selectedPreviewZone.totalCount}</span>
                      <p className="text-[10px] text-slate-500">Total</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-lg font-black text-amber-400 font-mono">{selectedPreviewZone.activeCount}</span>
                      <p className="text-[10px] text-slate-500">Unresolved</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-lg font-black text-emerald-400 font-mono">{selectedPreviewZone.resolvedCount}</span>
                      <p className="text-[10px] text-slate-500">Resolved</p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 pt-2 border-t border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Major Issue:</span>
                      <span className="text-white font-semibold">{selectedPreviewZone.majorCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned Dept:</span>
                      <span className="text-cyan-400 font-semibold truncate max-w-[180px]">{selectedPreviewZone.primaryDepartment}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('live-map')}
                  className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <span>Inspect {selectedPreviewZone.name} on GIS Map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== 6. MUNICIPAL DEPARTMENTS PREVIEW (10 DEPARTMENTS) ==================== */}
      <section id="departments-section" className="py-20 bg-slate-950/80 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                Unified Civic Grid
              </span>
              <h2 className="text-3xl font-black text-white mt-2">
                10 Specialized Municipal Departments
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Every complaint is automatically routed to one of our 10 specialized civic engineering departments.
              </p>
            </div>
            <button
              onClick={() => navigate('departments')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold flex items-center space-x-2"
            >
              <span>Open Full Department Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => navigate('departments')}
                className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 overflow-hidden shadow-lg cursor-pointer group flex flex-col justify-between transition"
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={dept.coverImage}
                    alt={dept.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-cyan-400 font-mono text-[10px] font-bold">
                    {dept.code}
                  </span>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 font-mono text-[10px] font-bold">
                    {dept.resolutionRate}
                  </span>
                </div>
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                      {dept.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{dept.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{dept.activeStaff} Staff</span>
                    <span className="text-cyan-400 font-semibold">SLA: {dept.slaHours}h →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 7. CITIZEN TESTIMONIALS & REVIEWS ==================== */}
      <section className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                Verified Citizen Feedback (Demo Content)
              </span>
              <h2 className="text-3xl font-black text-white mt-2">
                Trusted by Residents Across Bengaluru
              </h2>
            </div>
            <button
              onClick={() => navigate('feedback')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold flex items-center space-x-2"
            >
              <Star className="w-4 h-4 fill-amber-400" />
              <span>Submit Feedback & View All Reviews</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Kusuma Devi',
                ward: 'Jayanagar 4th Block',
                ticket: 'CM-2075',
                rating: 5,
                quote: 'I snapped a photo of a fallen tree branch blocking Madhavan Park walkway at 7:30 AM. CivicMind AI screened it immediately and the horticulture squad cleared it before our evening walk!'
              },
              {
                name: 'Venkatesh Murthy',
                ward: 'Rajajinagar 3rd Block',
                ticket: 'CM-2072',
                rating: 5,
                quote: 'Instead of filing duplicate complaints about muddy tap water, CivicMind linked our neighbourhood reports into one priority work order and uploaded the lab TDS certificate upon closure.'
              },
              {
                name: 'Meenakshi Sundaram',
                ward: 'Yelahanka New Town',
                ticket: 'CM-2070',
                rating: 5,
                quote: 'The live tracking timeline and before/after proof photos make municipal accountability transparent for the first time. Truly feels like a futuristic smart city system.'
              }
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(t.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      Verified #{t.ticket} • Demo Testimonial
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.ward}, Bengaluru</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 8. CONTACT SECTION & FOOTER ==================== */}
      <section id="contact" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-5">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                24/7 Command & Helpline
              </span>
              <h2 className="text-3xl font-black text-white">
                Connect with the CivicMind Smart City Command Centre
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Have questions about municipal SLAs, ward integration, or emergency civic response? Reach out directly to our central operations desk.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-slate-400">24/7 Unified Civic Helpline</p>
                    <p className="text-white font-bold">1533 / +91 80 2266 0000 (Emergency: 112)</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-slate-400">Command Centre Dispatch Desk</p>
                    <p className="text-white font-bold">command@civicmind-bengaluru.gov.in</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-slate-400">Smart City Integrated Control Centre</p>
                    <p className="text-white font-bold">NR Square, Hudson Circle, Bengaluru – 560002</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Send Direct Inquiry to Command Desk</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Your Full Name"
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="Email Address"
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                placeholder="Ward / Subject (e.g., Indiranagar Storm Drain Inquiry)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <textarea
                rows="3"
                required
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Write your message or municipal partnership query..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg transition"
              >
                Transmit Message to CivicMind Command
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020510] border-t border-slate-900 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">CIVICMIND – AI-Powered Smart City Operations Platform</p>
              <p className="text-[11px] text-slate-500">
                Connected Frontend + Node/SQLite Backend • Bengaluru Smart City Digital Twin
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px]">
            <button onClick={() => navigate('login')} className="hover:text-cyan-400">Login</button>
            <button onClick={() => navigate('signup')} className="hover:text-cyan-400">Sign Up</button>
            <button onClick={() => navigate('citizen-dashboard')} className="hover:text-cyan-400">Citizen Portal</button>
            <button onClick={() => navigate('municipality-dashboard')} className="hover:text-cyan-400">Municipality Portal</button>
            <button onClick={() => navigate('admin-dashboard')} className="hover:text-cyan-400">Admin Command</button>
            <button onClick={() => navigate('live-map')} className="hover:text-cyan-400">Bengaluru Map</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
