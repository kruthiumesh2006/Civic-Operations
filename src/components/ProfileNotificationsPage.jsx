import React, { useState } from 'react';
import { useCivic } from '../context/CivicContext';
import {
  User,
  Bell,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Sparkles,
  Save
} from 'lucide-react';

export default function ProfileNotificationsPage({ initialView = 'profile' }) {
  const {
    currentUser,
    notifications,
    markNotificationsRead,
    updateUserProfile,
    zones,
    navigate,
    setTrackingId
  } = useCivic();

  const user = currentUser || {
    id: 'usr_public',
    name: 'Kusuma Devi',
    email: 'kusuma@gmail.com',
    role: 'Public',
    department: 'Citizen',
    phone: '+91 98450 77210',
    zone: 'Indiranagar',
    badge: 'Verified Civic Champion',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  };

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '+91 98450 77210');
  const [zone, setZone] = useState(user.zone || 'Indiranagar');

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile(user.id, { name, phone, zone });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: User Profile & Security Clearance */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 h-fit">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/40"
            />
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                {user.role} Account
              </span>
              <h2 className="text-xl font-black text-white mt-1">{user.name}</h2>
              <p className="text-xs text-slate-400">{user.badge || 'Verified Civic Identity'}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3.5 text-xs pt-2 border-t border-slate-800">
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Registered Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Mobile / SMS Alert Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Primary Bengaluru Ward</label>
              <select
                value={zone}
                onChange={e => setZone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.name}>{z.fullName}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-black flex items-center justify-center space-x-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Preferences</span>
            </button>
          </form>
        </div>

        {/* Right 7 Cols: Live Notifications Center */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Real-Time Civic Notifications & Status Alerts</h2>
            </div>
            <button
              onClick={markNotificationsRead}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-cyan-400 font-bold"
            >
              Mark All as Read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.ticketId) {
                    setTrackingId(n.ticketId);
                    navigate('track-complaint');
                  }
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  !n.read
                    ? 'bg-cyan-950/20 border-cyan-500/40'
                    : 'bg-slate-950 border-slate-800 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                    <span className="text-sm font-bold text-white">{n.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                {n.ticketId && (
                  <span className="inline-block mt-2 text-[11px] font-mono text-cyan-400 font-bold">
                    Inspect Ticket #{n.ticketId} →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
