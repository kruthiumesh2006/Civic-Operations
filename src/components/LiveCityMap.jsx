import React, { useEffect, useRef, useState } from 'react';
import { useCivic } from '../context/CivicContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Layers,
  Filter,
  Search,
  Sparkles,
  Navigation,
  Globe,
  Flame,
  Eye,
  PlusCircle,
  CheckCircle2,
  Building2,
  ArrowRight
} from 'lucide-react';

export default function LiveCityMap({ embedded = false }) {
  const {
    evaluatedZones,
    complaints,
    categories,
    navigate,
    setTrackingId,
    setSelectedComplaintDetail
  } = useCivic();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseTileLayerRef = useRef(null);
  const layersGroupRef = useRef(null);

  const [mapMode, setMapMode] = useState('standard'); // 'standard' | 'satellite' | 'heatmap'
  const [searchArea, setSearchArea] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All'); // 'All' | 'Today' | 'This Week'
  const [showResolvedHistory, setShowResolvedHistory] = useState(false);
  const [selectedZone, setSelectedZone] = useState(evaluatedZones[0] || null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [12.9716, 77.6245],
      zoom: embedded ? 11 : 12,
      zoomControl: true,
      attributionControl: false
    });

    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    baseTileLayerRef.current = tileLayer;
    layersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [embedded]);

  // Switch Map Tile Layer (Standard Dark GIS vs Satellite View vs Heatmap)
  useEffect(() => {
    if (!mapInstanceRef.current || !baseTileLayerRef.current) return;
    const map = mapInstanceRef.current;
    map.removeLayer(baseTileLayerRef.current);

    if (mapMode === 'satellite') {
      baseTileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      ).addTo(map);
    } else {
      baseTileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);
    }
  }, [mapMode]);

  // Render Neighbourhood Boundaries, Heatmap Gradients & Complaint Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const layersGroup = layersGroupRef.current;
    layersGroup.clearLayers();

    const filteredZones = evaluatedZones.filter(z =>
      z.name.toLowerCase().includes(searchArea.toLowerCase()) ||
      z.fullName.toLowerCase().includes(searchArea.toLowerCase())
    );

    // 1. Draw 10 Bengaluru Neighbourhood Zone Boundaries
    filteredZones.forEach((zone) => {
      const isRed = zone.zoneStatus === 'danger';
      const isYellow = zone.zoneStatus === 'warning';

      // Outer thermal halo in heatmap mode
      if (mapMode === 'heatmap') {
        L.circle(zone.center, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: isRed ? 0.42 : isYellow ? 0.28 : 0.18,
          weight: 0,
          radius: zone.radius * 1.35
        }).addTo(layersGroup);
      }

      const circle = L.circle(zone.center, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: mapMode === 'heatmap' ? 0.35 : isRed ? 0.24 : isYellow ? 0.18 : 0.12,
        weight: isRed ? 2.5 : 1.8,
        dashArray: isRed ? '6, 4' : null,
        radius: zone.radius
      });

      const popupHtml = `
        <div style="width: 250px; background: #0f172a; color: #f8fafc; padding: 12px; border-radius: 12px; border: 1px solid #1e293b; font-family: system-ui;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="font-size:13px; color:#fff;">${zone.name}</strong>
            <span style="font-size:9px; font-weight:800; padding:2px 6px; border-radius:99px; background:${zone.color}33; color:${zone.color}; border:1px solid ${zone.color}66;">
              ${zone.riskLevel}
            </span>
          </div>
          <p style="font-size:10px; color:#94a3b8; margin:0 0 8px 0;">${zone.fullName}</p>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px; background:#020617; padding:6px; border-radius:8px; text-align:center; margin-bottom:8px;">
            <div><strong style="color:#fff; font-size:12px;">${zone.totalCount}</strong><br/><span style="font-size:9px; color:#64748b;">Total</span></div>
            <div><strong style="color:#fbbf24; font-size:12px;">${zone.activeCount}</strong><br/><span style="font-size:9px; color:#64748b;">Pending</span></div>
            <div><strong style="color:#34d399; font-size:12px;">${zone.resolvedCount}</strong><br/><span style="font-size:9px; color:#64748b;">Resolved</span></div>
          </div>
          <div style="font-size:10px; color:#cbd5e1; line-height:1.5;">
            <div><strong>Major Issue:</strong> ${zone.majorCategory}</div>
            <div><strong>Assigned Dept:</strong> <span style="color:#38bdf8;">${zone.primaryDepartment}</span></div>
          </div>
        </div>
      `;

      circle.bindPopup(popupHtml);
      circle.on('click', () => {
        setSelectedZone(zone);
      });
      circle.addTo(layersGroup);
    });

    // 2. Filter Complaint Markers (Resolved complaints automatically disappear from active layer unless toggled)
    const visibleComplaints = complaints.filter((c) => {
      if (!showResolvedHistory && c.status === 'Resolved') return false;
      if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
      if (searchArea && !c.ward.toLowerCase().includes(searchArea.toLowerCase()) && !c.area.toLowerCase().includes(searchArea.toLowerCase())) {
        return false;
      }
      if (dateFilter === 'Today' && !c.createdAt.includes('2026-11-05') && !c.createdAt.includes('Nov 5')) {
        return false;
      }
      return true;
    });

    // 3. Plot Markers
    visibleComplaints.forEach((comp) => {
      if (!comp.coordinates) return;
      const isCritical = comp.priority === 'Critical';
      const isResolved = comp.status === 'Resolved';
      const isInProgress = comp.status === 'In Progress' || comp.status === 'Assigned';

      const markerColor = isResolved
        ? '#10b981'
        : isCritical
        ? '#ef4444'
        : isInProgress
        ? '#06b6d4'
        : '#f59e0b';

      const customIcon = L.divIcon({
        className: 'custom-civic-marker',
        html: `
          <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
            ${!isResolved && isCritical ? `<div style="position:absolute; inset:-4px; border-radius:50%; background:${markerColor}; opacity:0.45; animation:ping 1.5s infinite;"></div>` : ''}
            <div style="width:28px; height:28px; border-radius:50%; background:#0f172a; border:2.5px solid ${markerColor}; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(0,0,0,0.7); font-size:12px;">
              ${comp.category.includes('Road') ? '🚧' : comp.category.includes('Water') ? '💧' : comp.category.includes('Garbage') ? '🗑️' : comp.category.includes('Streetlight') ? '💡' : comp.category.includes('Traffic') ? '🚦' : comp.category.includes('Drainage') ? '🌊' : '⚠️'}
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker(comp.coordinates, { icon: customIcon });
      marker.on('click', () => {
        const matchedZ = evaluatedZones.find(z => z.name.toLowerCase() === comp.ward.toLowerCase());
        if (matchedZ) setSelectedZone(matchedZ);
      });

      marker.bindPopup(`
        <div style="width:240px; background:#0f172a; color:#f8fafc; padding:10px; border-radius:12px; border:1px solid #1e293b; font-family:system-ui;">
          <div style="position:relative; height:95px; border-radius:8px; overflow:hidden; margin-bottom:8px;">
            <img src="${comp.image}" style="width:100%; height:100%; object-fit:cover;" />
            <span style="position:absolute; top:5px; right:5px; background:${markerColor}; color:#020617; font-size:9px; font-weight:800; padding:2px 6px; border-radius:99px;">
              ${comp.status}
            </span>
          </div>
          <div style="font-size:10px; color:#38bdf8; font-family:monospace; font-weight:700;">${comp.id} • ${comp.category}</div>
          <div style="font-size:11px; font-weight:700; color:#fff; margin:3px 0;">${comp.title}</div>
          <div style="font-size:10px; color:#94a3b8;">📍 ${comp.area}</div>
          <div style="font-size:10px; color:#cbd5e1; margin-top:4px; padding-top:4px; border-top:1px solid #1e293b;">
            Dept: <strong style="color:#38bdf8;">${comp.department}</strong>
          </div>
        </div>
      `);

      marker.addTo(layersGroup);
    });
  }, [evaluatedZones, complaints, mapMode, searchArea, categoryFilter, dateFilter, showResolvedHistory]);

  const locateMe = () => {
    if (!mapInstanceRef.current) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapInstanceRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 14, { duration: 1.2 });
        },
        () => {
          mapInstanceRef.current.flyTo([12.9784, 77.6408], 14, { duration: 1.2 });
        }
      );
    } else {
      mapInstanceRef.current.flyTo([12.9784, 77.6408], 14, { duration: 1.2 });
    }
  };

  const redZonesCount = evaluatedZones.filter(z => z.zoneStatus === 'danger').length;
  const yellowZonesCount = evaluatedZones.filter(z => z.zoneStatus === 'warning').length;
  const greenZonesCount = evaluatedZones.filter(z => z.zoneStatus === 'safe').length;

  return (
    <div className={`relative w-full ${embedded ? 'h-[540px] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl' : 'h-[calc(100vh-4rem)] min-h-[650px]'} bg-slate-950 flex flex-col md:flex-row overflow-hidden`}>
      {/* Left GIS Command & Bengaluru 10-Zone Control Sidebar */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-900/95 border-r border-slate-800 p-4 flex flex-col justify-between overflow-y-auto z-10">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Bengaluru Digital Twin GIS</span>
            </div>
            <h2 className="text-lg font-black text-white mt-0.5">
              Live Smart City Risk Map
            </h2>
            <p className="text-[11px] text-slate-400">
              10 Bengaluru Zones • Red/Yellow/Green Risk Classification
            </p>
          </div>

          {/* Map View Mode Switcher (Standard / Satellite / Heatmap) */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold">
            <button
              onClick={() => setMapMode('standard')}
              className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition ${
                mapMode === 'standard' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Standard</span>
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition ${
                mapMode === 'satellite' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Satellite</span>
            </button>
            <button
              onClick={() => setMapMode('heatmap')}
              className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition ${
                mapMode === 'heatmap' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Heatmap</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchArea}
                onChange={e => setSearchArea(e.target.value)}
                placeholder="Search Bengaluru area (e.g. Indiranagar, Whitefield)..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="All">Date: All Active</option>
                <option value="Today">Reported Today</option>
                <option value="This Week">Last 7 Days</option>
              </select>
            </div>

            <label className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 cursor-pointer">
              <span>Show Historical Resolved Markers</span>
              <input
                type="checkbox"
                checked={showResolvedHistory}
                onChange={e => setShowResolvedHistory(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500"
              />
            </label>
          </div>

          {/* Map Legend */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 text-[11px]">
            <p className="font-bold text-slate-300 uppercase tracking-wider">Area Risk Classification Legend</p>
            <div className="flex items-center justify-between text-rose-300">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Red Zone (High Density / Critical)</span>
              </span>
              <span className="font-mono font-bold">{redZonesCount} Zones</span>
            </div>
            <div className="flex items-center justify-between text-amber-300">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Yellow Zone (Moderate Risk)</span>
              </span>
              <span className="font-mono font-bold">{yellowZonesCount} Zones</span>
            </div>
            <div className="flex items-center justify-between text-emerald-300">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Green Zone (Safe / Resolved)</span>
              </span>
              <span className="font-mono font-bold">{greenZonesCount} Zones</span>
            </div>
          </div>

          {/* 10 Bengaluru Areas Interactive List */}
          <div>
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              10 Bengaluru Neighbourhoods ({evaluatedZones.length})
            </p>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {evaluatedZones.map((zone) => {
                const isRed = zone.zoneStatus === 'danger';
                const isYellow = zone.zoneStatus === 'warning';
                const isSelected = selectedZone?.id === zone.id;

                return (
                  <div
                    key={zone.id}
                    onClick={() => {
                      setSelectedZone(zone);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo(zone.center, 14, { duration: 1.1 });
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-400'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          isRed ? 'bg-rose-500' : isYellow ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                      />
                      <div className="truncate">
                        <p className="font-bold text-white truncate">{zone.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{zone.primaryDepartment}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex-shrink-0 ${
                        isRed
                          ? 'bg-rose-500/20 text-rose-300'
                          : isYellow
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {zone.activeCount} active
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Map Canvas + Floating Controls + Selected Bengaluru Area Analytics Panel */}
      <div className="flex-1 relative h-full">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Top-Right Floating Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-wrap gap-2">
          <button
            onClick={locateMe}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-300 flex items-center space-x-1.5 shadow-xl backdrop-blur-md"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>My GPS Location</span>
          </button>
          <button
            onClick={() => navigate('file-complaint')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 text-xs font-black flex items-center space-x-1.5 shadow-xl"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Pin Complaint</span>
          </button>
        </div>

        {/* Bottom Clicked Area Detailed Analytics Panel */}
        {selectedZone && (
          <div className="absolute bottom-4 left-4 right-4 z-20 p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{selectedZone.code}</span>
                  <h3 className="text-base font-black text-white">{selectedZone.fullName}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedZone.zoneStatus === 'danger'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : selectedZone.zoneStatus === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {selectedZone.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Major Category: <strong className="text-white">{selectedZone.majorCategory}</strong> • Assigned Municipal Department:{' '}
                  <strong className="text-cyan-400">{selectedZone.primaryDepartment}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-sm font-black text-white font-mono">{selectedZone.totalCount}</span>
                  <p className="text-[10px] text-slate-500">Total</p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-sm font-black text-amber-400 font-mono">{selectedZone.activeCount}</span>
                  <p className="text-[10px] text-slate-500">Pending</p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-sm font-black text-emerald-400 font-mono">{selectedZone.resolvedCount}</span>
                  <p className="text-[10px] text-slate-500">Resolved</p>
                </div>
                <button
                  onClick={() => setSelectedZone(null)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
