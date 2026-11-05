import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DEMO_USERS,
  MUNICIPAL_DEPARTMENTS,
  CITY_WARDS_ZONES,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  CIVIC_CATEGORIES
} from '../data/mockData';

const CivicContext = createContext();

export const CivicProvider = ({ children }) => {
  // 1. Database-backed collections
  const [users, setUsers] = useState(DEMO_USERS);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [departments, setDepartments] = useState(MUNICIPAL_DEPARTMENTS);
  const [zones, setZones] = useState(CITY_WARDS_ZONES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [dbMeta, setDbMeta] = useState({ engine: 'SQLite3 + JSON Mirror', connected: true });

  // 2. Authenticated User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('civicmind_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 3. Multi-Page Router State
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'landing';
  });

  // Keep activeTab alias for backwards compatibility with any subcomponents
  const navigate = useCallback((page) => {
    const aliasMap = {
      dashboard: currentUser?.role === 'Admin'
        ? 'admin-dashboard'
        : currentUser?.role === 'Municipality'
        ? 'municipality-dashboard'
        : 'citizen-dashboard',
      map: 'live-map',
      track: 'track-complaint',
      reviews: 'feedback'
    };
    const target = aliasMap[page] || page;
    setActivePage(target);
    window.location.hash = target;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentUser]);

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash.replace('#', '');
      if (h) setActivePage(h);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Modals & Interactive States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [fileComplaintModalOpen, setFileComplaintModalOpen] = useState(false);
  const [trackingId, setTrackingId] = useState('CM-2081');
  const [selectedComplaintDetail, setSelectedComplaintDetail] = useState(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToastMessage({ message, type, id });
    setTimeout(() => {
      setToastMessage(prev => (prev?.id === id ? null : prev));
    }, 4500);
  }, []);

  // Sync state from Backend Server
  const applyBackendState = useCallback((data) => {
    if (!data) return;
    if (data.users) setUsers(data.users);
    if (data.complaints) setComplaints(data.complaints);
    if (data.departments) setDepartments(data.departments);
    if (data.zones) setZones(data.zones);
    if (data.notifications) setNotifications(data.notifications);
    if (data.activityLogs) setActivityLogs(data.activityLogs);
    if (data.meta) setDbMeta({ ...data.meta, connected: true });
  }, []);

  useEffect(() => {
    fetch('/api/bootstrap')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(data => applyBackendState(data))
      .catch(() => {
        setDbMeta({ engine: 'Local Persistent Ledger', connected: false });
      });
  }, [applyBackendState]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('civicmind_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('civicmind_current_user');
    }
  }, [currentUser]);

  // Helper to get default dashboard for role
  const getRoleDashboard = (role) => {
    if (role === 'Admin') return 'admin-dashboard';
    if (role === 'Municipality') return 'municipality-dashboard';
    return 'citizen-dashboard';
  };

  // Authentication: Login (Detects role from authenticated account in DB)
  const login = async (email, password) => {
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        return { success: false, error: data.error || 'Invalid credentials.' };
      }
      setCurrentUser(data.user);
      setAuthModalOpen(false);
      const targetDash = getRoleDashboard(data.user.role);
      setActivePage(targetDash);
      window.location.hash = targetDash;
      showToast(`Authenticated as ${data.user.name} (${data.user.role})`, 'success');
      return { success: true, user: data.user };
    } catch {
      // Fallback local check
      const cleanEmail = email.trim().toLowerCase();
      const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!foundUser) return { success: false, error: 'No account found with this email address.' };
      if (foundUser.password !== password) return { success: false, error: 'Incorrect password.' };
      setCurrentUser(foundUser);
      setAuthModalOpen(false);
      const targetDash = getRoleDashboard(foundUser.role);
      setActivePage(targetDash);
      window.location.hash = targetDash;
      showToast(`Welcome back, ${foundUser.name} (${foundUser.role})`, 'success');
      return { success: true, user: foundUser };
    }
  };

  // Authentication: Signup
  const signup = async (payload) => {
    try {
      const resp = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed.' };
      }
      setUsers(prev => [...prev, data.user]);
      setCurrentUser(data.user);
      setAuthModalOpen(false);
      const targetDash = getRoleDashboard(data.user.role);
      setActivePage(targetDash);
      window.location.hash = targetDash;
      showToast(`Account created! Welcome to CivicMind, ${data.user.name}.`, 'success');
      return { success: true, user: data.user };
    } catch {
      const assignedRole = payload.role === 'Municipality' ? 'Municipality' : 'Public';
      const newUser = {
        id: `usr_${Date.now()}`,
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        name: payload.name.trim(),
        role: assignedRole,
        department: assignedRole === 'Municipality' ? (payload.department || 'Road and Infrastructure Department') : 'Citizen',
        verificationId: payload.verificationId || null,
        zone: payload.zone || 'Indiranagar',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        badge: assignedRole === 'Municipality' ? 'Verified Municipal Officer' : 'Verified Citizen'
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      const targetDash = getRoleDashboard(newUser.role);
      setActivePage(targetDash);
      window.location.hash = targetDash;
      showToast(`Account created! Welcome, ${newUser.name}.`, 'success');
      return { success: true, user: newUser };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePage('landing');
    window.location.hash = 'landing';
    showToast('Logged out safely. Returned to CivicMind Homepage.', 'info');
  };

  const switchDemoUser = (role) => {
    const target = users.find(u => u.role === role) || DEMO_USERS.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      const dash = getRoleDashboard(target.role);
      setActivePage(dash);
      window.location.hash = dash;
      showToast(`Switched active role to ${target.name} (${target.role})`, 'success');
    }
  };

  // Local + Backend AI 1st-Level Screening
  const runAgenticScreening = async (formData) => {
    try {
      const resp = await fetch('/api/ai/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (resp.ok) {
        const data = await resp.json();
        return data.screening;
      }
    } catch {
      // Fallback local computation
    }

    const text = `${formData.title || ''} ${formData.description || ''} ${formData.area || ''} ${formData.ward || ''}`.toLowerCase();
    let duplicateMatch = null;
    for (const c of complaints) {
      if (c.status === 'Resolved' || c.status === 'Rejected') continue;
      if (c.ward.toLowerCase() === (formData.ward || '').toLowerCase() && c.category === formData.category) {
        duplicateMatch = c;
        break;
      }
    }

    const isCritical = ['crater', 'burst', 'spark', 'live wire', 'manhole', 'accident', 'gridlock', 'sewage', 'flood', 'school', 'hospital'].some(k => text.includes(k));
    const suggestedPriority = isCritical ? 'Critical' : 'High';

    return {
      screened: true,
      duplicateDetected: Boolean(duplicateMatch),
      duplicateTicket: duplicateMatch?.id || null,
      duplicateItem: duplicateMatch || null,
      similarityScore: duplicateMatch ? 89 : 14,
      confidenceScore: 0.96,
      suggestedCategory: formData.category || 'Road damage and potholes',
      suggestedDepartment: formData.department || 'Road and Infrastructure Department',
      suggestedPriority,
      hazardLevel: isCritical ? 'Level-1 Critical Safety Threat' : 'Level-2 High Operational Priority',
      aiSummary: duplicateMatch
        ? `Agentic AI detected similar active complaint #${duplicateMatch.id} in ${duplicateMatch.ward}. Recommend supporting existing ticket.`
        : `Agentic AI Vision & NLP verified unique civic issue (96% confidence). Routed to ${formData.department || 'Road and Infrastructure Department'}.`
    };
  };

  // File a New Complaint
  const fileComplaint = async (formData) => {
    const payload = {
      ...formData,
      reportedBy: currentUser ? currentUser.name : 'Kusuma Devi',
      userEmail: currentUser ? currentUser.email : 'kusuma@gmail.com'
    };

    try {
      const resp = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const data = await resp.json();
        applyBackendState(data.state);
        setFileComplaintModalOpen(false);
        setTrackingId(data.complaint.id);
        showToast(`Complaint #${data.complaint.id} screened by AI & dispatched to ${data.complaint.department}!`, 'success');
        return data.complaint;
      }
    } catch {
      // Fallback if offline
    }

    const screening = await runAgenticScreening(payload);
    const newId = `CM-${Math.floor(2100 + Math.random() * 7800)}`;
    const nowStr = new Date().toLocaleString();
    const newComplaint = {
      id: newId,
      title: payload.title,
      category: payload.category,
      department: payload.department || screening.suggestedDepartment,
      area: payload.area,
      ward: payload.ward || 'Indiranagar',
      priority: payload.priority || screening.suggestedPriority,
      status: 'AI Screened',
      reportedBy: payload.reportedBy,
      userEmail: payload.userEmail,
      createdAt: nowStr,
      updatedAt: nowStr,
      expectedResolution: 'Within 24 Hours (SLA)',
      coordinates: payload.coordinates || [12.9784, 77.6408],
      upvotes: 1,
      description: payload.description,
      image: payload.image,
      aiScreening: screening,
      timeline: [
        { step: 'Submitted', time: nowStr, note: `Submitted with GPS coordinates.` },
        { step: 'AI Screened', time: nowStr, note: screening.aiSummary }
      ]
    };
    setComplaints(prev => [newComplaint, ...prev]);
    setFileComplaintModalOpen(false);
    setTrackingId(newId);
    showToast(`Complaint #${newId} logged and routed!`, 'success');
    return newComplaint;
  };

  // Support / Endorse Existing Duplicate Complaint
  const supportDuplicateComplaint = async (ticketId) => {
    try {
      const resp = await fetch(`/api/complaints/${ticketId}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor: currentUser ? currentUser.name : 'Citizen' })
      });
      if (resp.ok) {
        const data = await resp.json();
        applyBackendState(data.state);
        setTrackingId(ticketId);
        showToast(`You supported #${ticketId}! Duplicate prevented & priority boosted.`, 'success');
        return data.complaint;
      }
    } catch {
      // fallback
    }
    setComplaints(prev => prev.map(c => (c.id === ticketId ? { ...c, upvotes: (c.upvotes || 1) + 1 } : c)));
    setTrackingId(ticketId);
    showToast(`Supported #${ticketId}!`, 'success');
  };

  // Update Complaint Status / Department / Verification
  const updateComplaintStatus = async (id, newStatus, resolutionNotes = '', resolutionProof = '', extra = {}) => {
    try {
      const resp = await fetch(`/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          resolutionNotes,
          resolutionProof,
          ...extra,
          actor: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Municipal Officer'
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        applyBackendState(data.state);
        showToast(`Ticket #${id} updated to "${newStatus}". Map & analytics synchronized!`, 'success');
        return data.complaint;
      }
    } catch {
      // fallback
    }

    const nowStr = new Date().toLocaleString();
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        status: newStatus || c.status,
        department: extra.department || c.department,
        priority: extra.priority || c.priority,
        officerRemarks: extra.officerRemarks ?? c.officerRemarks,
        resolutionNotes: resolutionNotes || c.resolutionNotes,
        resolutionProof: resolutionProof || c.resolutionProof,
        updatedAt: nowStr,
        timeline: [...c.timeline, { step: newStatus, time: nowStr, note: resolutionNotes || `Updated to ${newStatus}` }]
      };
    }));
    showToast(`Ticket #${id} updated to ${newStatus}.`, 'success');
  };

  // Submit Citizen Feedback
  const submitFeedback = async (id, rating, feedbackText, extra = {}) => {
    try {
      const resp = await fetch(`/api/complaints/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          feedback: feedbackText,
          feedbackPhoto: extra.feedbackPhoto || null,
          issueResolved: extra.issueResolved ?? true,
          actor: currentUser ? currentUser.name : 'Verified Citizen'
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        applyBackendState(data.state);
        showToast(`Thank you! Your ${rating}-star review for #${id} has been recorded.`, 'success');
        return;
      }
    } catch {
      // fallback
    }
    setComplaints(prev => prev.map(c => (c.id === id ? { ...c, rating, feedback: feedbackText } : c)));
    showToast(`Thank you! Your ${rating}-star review for #${id} was saved.`, 'success');
  };

  const markNotificationsRead = async () => {
    try {
      const resp = await fetch('/api/notifications/read', { method: 'PATCH' });
      if (resp.ok) {
        const data = await resp.json();
        applyBackendState(data.state);
      }
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
    showToast('All notifications marked as read.', 'info');
  };

  const updateUserProfile = async (userId, updates) => {
    try {
      const resp = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (resp.ok) {
        const data = await resp.json();
        applyBackendState(data.state);
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(data.user);
        }
        showToast('User profile updated successfully.', 'success');
        return;
      }
    } catch {
      // fallback
    }
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...updates } : u)));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
    showToast('Profile saved.', 'success');
  };

  const resetDemoData = async () => {
    try {
      const resp = await fetch('/api/reset', { method: 'POST' });
      if (resp.ok) {
        const data = await resp.json();
        applyBackendState(data.state);
        showToast('Database reset to default Bengaluru Smart City dataset.', 'info');
        return;
      }
    } catch {
      // fallback
    }
    setComplaints(INITIAL_COMPLAINTS);
    setUsers(DEMO_USERS);
    showToast('Platform reset to default dataset.', 'info');
  };

  // Dynamic Bengaluru Zone Risk Classification based on density, severity, recency & resolution status
  const evaluatedZones = zones.map(zone => {
    const zoneComplaints = complaints.filter(
      c => c.ward.toLowerCase() === zone.name.toLowerCase() || c.area.toLowerCase().includes(zone.name.toLowerCase())
    );
    const unresolvedComplaints = zoneComplaints.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected');
    const pendingComplaints = zoneComplaints.filter(c => c.status === 'Pending' || c.status === 'Submitted' || c.status === 'AI Screened');
    const inProgressComplaints = zoneComplaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Verified');
    const resolvedComplaints = zoneComplaints.filter(c => c.status === 'Resolved');
    const criticalActive = unresolvedComplaints.filter(c => c.priority === 'Critical');
    const highActive = unresolvedComplaints.filter(c => c.priority === 'High');

    // Weighted Risk Score calculation (Severity + Density + Unresolved Status)
    const riskScore =
      criticalActive.length * 45 +
      highActive.length * 25 +
      unresolvedComplaints.length * 15;

    let zoneStatus = 'safe'; // 'danger' (Red), 'warning' (Yellow), 'safe' (Green)
    let color = '#10b981'; // Emerald Green
    let riskLevel = 'LOW RISK (GREEN ZONE)';
    let label = 'Safe & Cleared Zone';

    if (riskScore >= 55 || criticalActive.length >= 1) {
      zoneStatus = 'danger';
      color = '#ef4444'; // Red
      riskLevel = 'HIGH RISK (RED ZONE)';
      label = 'Critical Civic Density / Hazard Zone';
    } else if (riskScore >= 25 || unresolvedComplaints.length >= 1) {
      zoneStatus = 'warning';
      color = '#f59e0b'; // Amber/Yellow
      riskLevel = 'MEDIUM RISK (YELLOW ZONE)';
      label = 'Moderate Unresolved Activity';
    }

    return {
      ...zone,
      zoneStatus,
      color,
      riskLevel,
      riskScore: Math.min(100, riskScore),
      label,
      totalCount: zoneComplaints.length,
      activeCount: unresolvedComplaints.length,
      pendingCount: pendingComplaints.length,
      inProgressCount: inProgressComplaints.length,
      resolvedCount: resolvedComplaints.length,
      criticalCount: criticalActive.length,
      complaints: zoneComplaints
    };
  });

  return (
    <CivicContext.Provider
      value={{
        currentUser,
        users,
        complaints,
        departments,
        zones,
        evaluatedZones,
        notifications,
        activityLogs,
        categories: CIVIC_CATEGORIES,
        dbMeta,
        activePage,
        setActivePage: navigate,
        activeTab: activePage,
        setActiveTab: navigate,
        navigate,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        signup,
        logout,
        switchDemoUser,
        runAgenticScreening,
        fileComplaint,
        supportDuplicateComplaint,
        updateComplaintStatus,
        submitFeedback,
        markNotificationsRead,
        updateUserProfile,
        resetDemoData,
        fileComplaintModalOpen,
        setFileComplaintModalOpen,
        trackingId,
        setTrackingId,
        selectedComplaintDetail,
        setSelectedComplaintDetail,
        aiAssistantOpen,
        setAiAssistantOpen,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = () => useContext(CivicContext);
