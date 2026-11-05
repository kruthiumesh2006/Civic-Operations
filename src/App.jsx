import React from 'react';
import { CivicProvider, useCivic } from './context/CivicContext';
import LandingPage from './components/LandingPage';
import AuthPages from './components/AuthPages';
import AppShell from './components/AppShell';
import CitizenDashboard from './components/CitizenDashboard';
import MunicipalityDashboard from './components/MunicipalityDashboard';
import AdminDashboard from './components/AdminDashboard';
import FileComplaintPage from './components/FileComplaintPage';
import TrackComplaint from './components/TrackComplaint';
import LiveCityMap from './components/LiveCityMap';
import ComplaintTable from './components/ComplaintTable';
import DepartmentsView from './components/DepartmentsView';
import AgenticAIPage from './components/AgenticAIPage';
import CitizenReviews from './components/CitizenReviews';
import ProfileNotificationsPage from './components/ProfileNotificationsPage';
import AuthModal from './components/AuthModal';
import FileComplaintModal from './components/FileComplaintModal';
import ComplaintDetailModal from './components/ComplaintDetailModal';
import CivicMindAI from './components/CivicMindAI';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

function MainRouter() {
  const { activePage, toastMessage } = useCivic();

  const renderApplicationScreen = () => {
    switch (activePage) {
      case 'citizen-dashboard':
        return <CitizenDashboard />;
      case 'municipality-dashboard':
        return <MunicipalityDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard key="overview" initialTab="overview" />;
      case 'city-analytics':
        return <AdminDashboard key="analytics" initialTab="analytics" />;
      case 'manage-users':
        return <AdminDashboard key="users" initialTab="users" />;
      case 'manage-departments':
        return <AdminDashboard key="departments" initialTab="departments" />;
      case 'settings':
        return <AdminDashboard key="settings" initialTab="settings" />;
      case 'file-complaint':
        return <FileComplaintPage key="file" initialStep={1} />;
      case 'ai-screening':
        return <FileComplaintPage key="screen" initialStep={3} />;
      case 'track-complaint':
        return <TrackComplaint />;
      case 'live-map':
        return <LiveCityMap embedded={false} />;
      case 'manage-complaints':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ComplaintTable title="Municipal Complaint Management & Verification Console" />
          </div>
        );
      case 'departments':
        return <DepartmentsView />;
      case 'ai-assistant':
        return <AgenticAIPage />;
      case 'feedback':
        return <CitizenReviews />;
      case 'profile':
      case 'notifications':
        return <ProfileNotificationsPage initialView={activePage} />;
      default:
        return <CitizenDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#04091a] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[60] max-w-sm rounded-2xl p-4 bg-slate-900 border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 flex items-start space-x-3 animate-in slide-in-from-top-3 fade-in duration-300">
          <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 flex-shrink-0 mt-0.5">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : toastMessage.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400" />
            )}
          </div>
          <div className="text-xs text-slate-200 leading-relaxed">
            {toastMessage.message}
          </div>
        </div>
      )}

      {/* Full-Page Views vs AppShell Sidebar Views */}
      {activePage === 'landing' ? (
        <LandingPage />
      ) : activePage === 'login' ? (
        <AuthPages mode="login" />
      ) : activePage === 'signup' ? (
        <AuthPages mode="signup" />
      ) : (
        <AppShell>{renderApplicationScreen()}</AppShell>
      )}

      {/* Global Modals & Floating AI Copilot */}
      <AuthModal />
      <FileComplaintModal />
      <ComplaintDetailModal />
      <CivicMindAI />
    </div>
  );
}

export default function App() {
  return (
    <CivicProvider>
      <MainRouter />
    </CivicProvider>
  );
}
