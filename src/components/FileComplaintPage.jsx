import React, { useState, useRef, useEffect } from 'react';
import { useCivic } from '../context/CivicContext';
import { SAMPLE_COMPLAINT_PHOTOS } from '../data/mockData';
import {
  Camera,
  MapPin,
  UploadCloud,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Send,
  Cpu,
  ThumbsUp,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  RefreshCw,
  Eye
} from 'lucide-react';

export default function FileComplaintPage({ initialStep = 1 }) {
  const {
    categories,
    departments,
    zones,
    complaints,
    runAgenticScreening,
    fileComplaint,
    supportDuplicateComplaint,
    navigate,
    setTrackingId
  } = useCivic();

  const [step, setStep] = useState(initialStep); // 1: Details, 2: Camera & GPS, 3: AI Screening & Submit

  // Form fields
  const [title, setTitle] = useState('Deep pothole crater causing bike skids near metro pillar');
  const [category, setCategory] = useState(categories[2] || 'Road damage and potholes');
  const [description, setDescription] = useState(
    'Severe 1.5ft asphalt depression filled with rainwater on the main commuter lane. Two-wheelers are swerving dangerously during peak traffic.'
  );
  const [ward, setWard] = useState('Indiranagar');
  const [area, setArea] = useState('Indiranagar 100 Feet Road, near Metro Pillar 42, Bengaluru');
  const [department, setDepartment] = useState('Road and Infrastructure Department');
  const [priority, setPriority] = useState('Critical');
  const [image, setImage] = useState(SAMPLE_COMPLAINT_PHOTOS[0].url);
  const [coordinates, setCoordinates] = useState([12.9784, 77.6408]);
  const [captureTimestamp, setCaptureTimestamp] = useState(() => new Date().toLocaleString());
  const [requestHumanReview, setRequestHumanReview] = useState(false);

  // Camera & GPS States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);

  // AI Screening States
  const [isScreening, setIsScreening] = useState(false);
  const [screeningResult, setScreeningResult] = useState(null);

  useEffect(() => {
    setStep(initialStep);
    if (initialStep === 3) {
      triggerAIScreening();
    }
    return () => stopCamera();
  }, [initialStep]);

  // Auto-suggest department when category changes
  useEffect(() => {
    const map = {
      'Garbage and waste management': 'Solid Waste Management Department',
      'Water supply': 'Water Supply Department',
      'Road damage and potholes': 'Road and Infrastructure Department',
      'Drainage and sewage': 'Drainage and Sewerage Department',
      'Public sanitation': 'Public Health and Sanitation Department',
      'Streetlights': 'Street Lighting and Electrical Department',
      'Electricity-related civic issues': 'Street Lighting and Electrical Department',
      'Traffic and road safety': 'Traffic and Transportation Department',
      'Public infrastructure': 'Parks and Public Spaces Department',
      'Other civic issues': 'Building and Urban Planning Department'
    };
    if (map[category]) setDepartment(map[category]);
  }, [category]);

  const startCamera = async () => {
    setCameraError('');
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError('Browser camera permission was declined or no webcam detected. You can upload an image or pick a preset below.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureLivePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL('image/jpeg', 0.85));
    setCaptureTimestamp(new Date().toLocaleString());
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setCaptureTimestamp(new Date().toLocaleString());
      };
      reader.readAsDataURL(file);
    }
  };

  const detectBrowserGPS = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lng = Number(pos.coords.longitude.toFixed(4));
        setCoordinates([lat, lng]);
        setCaptureTimestamp(new Date().toLocaleString());
        setArea(`${ward} Main Arterial Road (GPS Verified: ${lat}°N, ${lng}°E), Bengaluru`);
        setIsLocating(false);
      },
      () => {
        const targetZone = zones.find(z => z.name === ward) || zones[0];
        setCoordinates(targetZone.center);
        setCaptureTimestamp(new Date().toLocaleString());
        setArea(`${targetZone.fullName} (Triangulated: ${targetZone.center[0]}°N, ${targetZone.center[1]}°E)`);
        setIsLocating(false);
      },
      { timeout: 6000 }
    );
  };

  const triggerAIScreening = async () => {
    setStep(3);
    setIsScreening(true);
    const res = await runAgenticScreening({
      title,
      description,
      category,
      area,
      ward,
      department,
      coordinates
    });
    setTimeout(() => {
      setScreeningResult(res);
      if (res.suggestedDepartment) setDepartment(res.suggestedDepartment);
      if (res.suggestedPriority) setPriority(res.suggestedPriority);
      setIsScreening(false);
    }, 550);
  };

  const handleFinalSubmit = async () => {
    const created = await fileComplaint({
      title,
      category,
      description,
      area,
      ward,
      department,
      priority,
      image,
      coordinates,
      captureTimestamp,
      requestHumanReview
    });
    if (created?.id) {
      setTrackingId(created.id);
      navigate('track-complaint');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-Step Smart Grievance Registration & AI First-Level Screening</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Register Civic Issue & Run AI Screening
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live camera capture, GPS coordinate locking, automated duplicate detection, and municipal department routing.
          </p>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center space-x-2 text-xs font-bold">
          {[
            { num: 1, label: '1. Issue Details' },
            { num: 2, label: '2. Camera & GPS' },
            { num: 3, label: '3. AI Screening' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => (s.num === 3 ? triggerAIScreening() : setStep(s.num))}
              className={`px-3 py-2 rounded-xl border transition ${
                step === s.num
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : step > s.num
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== STEP 1: ISSUE DETAILS ==================== */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            Step 1: Civic Issue Description & Category
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Complaint Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Deep pothole crater causing bike skids on Indiranagar 100ft Road"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Civic Issue Category (10 Categories) *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bengaluru Neighbourhood / Ward *
                </label>
                <select
                  value={ward}
                  onChange={e => {
                    const selected = e.target.value;
                    setWard(selected);
                    const z = zones.find(item => item.name === selected);
                    if (z) {
                      setCoordinates(z.center);
                      setArea(`${z.fullName}, Bengaluru`);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.name}>{z.fullName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Responsible Municipal Department (AI Auto-Suggested)
                </label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Initial Priority Level
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Critical">🔴 Critical (Immediate Public Safety Threat)</option>
                  <option value="High">🟠 High (Urgent 12h SLA)</option>
                  <option value="Medium">🟡 Medium (Standard 24h SLA)</option>
                  <option value="Low">🟢 Low (Routine Upkeep)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Issue Description *
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe severity, exact landmarks, and risk to citizens..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg"
            >
              <span>Continue to Live Camera & Geolocation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== STEP 2: LIVE CAMERA & GEOLOCATION ==================== */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            Step 2: Live Camera Evidence & Browser Geolocation
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* A. Live Camera Integration */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">A. Live Camera & Photo Evidence</h3>
                </div>
                {!isCameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Capture Live Photo</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold"
                  >
                    Close Camera
                  </button>
                )}
              </div>

              {isCameraActive ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500 aspect-video bg-black">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={captureLivePhoto}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-cyan-500 text-slate-950 font-black text-xs shadow-lg"
                  >
                    Snap Evidence Photo
                  </button>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-slate-900">
                  <img src={image} alt="Evidence Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-semibold">✓ Evidence Attached</span>
                    <span className="text-slate-400 font-mono">{captureTimestamp}</span>
                  </div>
                </div>
              )}

              {cameraError && <p className="text-xs text-amber-400">{cameraError}</p>}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 cursor-pointer">
                    <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Upload Existing Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <span className="text-[11px] text-slate-500">Or select sample preset:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_COMPLAINT_PHOTOS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImage(s.url);
                        setCategory(s.category);
                        setCaptureTimestamp(new Date().toLocaleString());
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* B. Geolocation Detection */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">B. Geolocation & Address Lock</h3>
                  </div>
                  <button
                    type="button"
                    onClick={detectBrowserGPS}
                    disabled={isLocating}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{isLocating ? 'Detecting GPS...' : 'Detect Browser GPS'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Detected / Confirmed Street Address & Landmark *
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Latitude (°N)</span>
                    <input
                      type="number"
                      step="0.0001"
                      value={coordinates[0]}
                      onChange={e => setCoordinates([ parseFloat(e.target.value) || 12.9784, coordinates[1] ])}
                      className="w-full bg-transparent text-sm font-mono font-bold text-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Longitude (°E)</span>
                    <input
                      type="number"
                      step="0.0001"
                      value={coordinates[1]}
                      onChange={e => setCoordinates([ coordinates[0], parseFloat(e.target.value) || 77.6408 ])}
                      className="w-full bg-transparent text-sm font-mono font-bold text-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Capture Timestamp:</span>
                    <span className="text-slate-200 font-mono">{captureTimestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bengaluru Ward:</span>
                    <span className="text-cyan-400 font-bold">{ward}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200">
                Coordinates and timestamp are cryptographically attached to the complaint record for GIS heatmap plotting.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 1</span>
            </button>
            <button
              onClick={triggerAIScreening}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-xl shadow-cyan-500/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run AI First-Level Screening</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================== STEP 3: AI FIRST-LEVEL SCREENING ==================== */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Step 3: CivicMind Agentic AI First-Level Screening Result
                </h2>
                <p className="text-xs text-slate-400">
                  Automated vision & NLP analysis, department routing, priority scoring, and duplicate check
                </p>
              </div>
            </div>
            <button
              onClick={triggerAIScreening}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-cyan-400 flex items-center space-x-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScreening ? 'animate-spin' : ''}`} />
              <span>Re-Screen</span>
            </button>
          </div>

          {isScreening || !screeningResult ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto animate-pulse">
                <Sparkles className="w-7 h-7 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-white">
                Agentic AI Analyzing Description, Image Evidence & Geolocation...
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Comparing against {complaints.length} active Bengaluru ward records for duplicate clusters and computing hazard priority...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI Screening Summary Card */}
              <div
                className={`p-6 rounded-2xl border ${
                  screeningResult.duplicateDetected
                    ? 'bg-amber-950/30 border-amber-500/40'
                    : 'bg-emerald-950/25 border-emerald-500/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-2xl ${
                        screeningResult.duplicateDetected
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {screeningResult.duplicateDetected ? (
                        <AlertTriangle className="w-6 h-6" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                        AI Screening Verdict
                      </span>
                      <h3 className="text-lg font-black text-white">
                        {screeningResult.duplicateDetected
                          ? `Similar / Duplicate Active Complaint Found (#${screeningResult.duplicateTicket})`
                          : 'Unique Civic Issue Verified — Ready for Municipal Dispatch'}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-lg font-black text-cyan-400 font-mono">
                        {Math.round((screeningResult.confidenceScore || 0.96) * 100)}%
                      </span>
                      <p className="text-[10px] text-slate-400">AI Confidence</p>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-lg font-black text-amber-400 font-mono">
                        {screeningResult.suggestedPriority}
                      </span>
                      <p className="text-[10px] text-slate-400">Recommended Priority</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-200 mt-4 leading-relaxed">
                  {screeningResult.aiSummary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Identified Issue Category</span>
                    <span className="text-xs font-bold text-white">{screeningResult.suggestedCategory}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Suggested Department</span>
                    <span className="text-xs font-bold text-cyan-400">{screeningResult.suggestedDepartment}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Hazard Classification</span>
                    <span className="text-xs font-bold text-rose-300">{screeningResult.hazardLevel}</span>
                  </div>
                </div>

                {/* Duplicate Match Card with Option to Support/Track Existing Complaint */}
                {screeningResult.duplicateDetected && screeningResult.duplicateItem && (
                  <div className="mt-5 p-4 rounded-2xl bg-slate-950 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                        Matched Active Ticket #{screeningResult.duplicateItem.id} ({screeningResult.similarityScore}% Similarity)
                      </span>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {screeningResult.duplicateItem.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        📍 {screeningResult.duplicateItem.area} • Status: {screeningResult.duplicateItem.status}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={async () => {
                          await supportDuplicateComplaint(screeningResult.duplicateItem.id);
                          navigate('track-complaint');
                        }}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg transition"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Support & Track #{screeningResult.duplicateItem.id}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Human Review Option for Uncertain Classifications */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requestHumanReview}
                    onChange={e => setRequestHumanReview(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Request Human Officer Review for Classification</p>
                    <p className="text-[11px] text-slate-400">
                      Flags this ticket for manual verification by a Zonal Municipal Officer before squad dispatch.
                    </p>
                  </div>
                </label>
                <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              </div>

              {/* Final Submission Bar */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Edit Evidence / GPS</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-xl shadow-cyan-500/25 flex items-center space-x-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm & Submit to Municipal Grid</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
