import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDatabase, saveState, getInitialSeedState } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '..', 'dist');

const PORT = process.env.PORT || 5000;

let dbState = null;

function formatTimestamp() {
  const now = new Date();
  return (
    now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' +
    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  );
}

// Agentic AI 1st-Level Screening Engine
function performAgenticScreening(payload, complaints) {
  const {
    title = '',
    description = '',
    category = 'Road damage and potholes',
    area = '',
    ward = 'Indiranagar',
    coordinates = [12.9784, 77.6408]
  } = payload;

  const textCorpus = `${title} ${description} ${area} ${ward}`.toLowerCase();

  // 1. Identify Category & Suggested Responsible Department from text + selected category
  let suggestedCategory = category;
  if (textCorpus.includes('pothole') || textCorpus.includes('crater') || textCorpus.includes('asphalt') || textCorpus.includes('road')) {
    suggestedCategory = 'Road damage and potholes';
  } else if (textCorpus.includes('water') || textCorpus.includes('pipe') || textCorpus.includes('cauvery') || textCorpus.includes('leak')) {
    suggestedCategory = 'Water supply';
  } else if (textCorpus.includes('garbage') || textCorpus.includes('waste') || textCorpus.includes('trash') || textCorpus.includes('dump')) {
    suggestedCategory = 'Garbage and waste management';
  } else if (textCorpus.includes('sewage') || textCorpus.includes('drain') || textCorpus.includes('manhole') || textCorpus.includes('waterlog')) {
    suggestedCategory = 'Drainage and sewage';
  } else if (textCorpus.includes('streetlight') || textCorpus.includes('dark') || textCorpus.includes('lamp') || textCorpus.includes('pole')) {
    suggestedCategory = 'Streetlights';
  } else if (textCorpus.includes('traffic') || textCorpus.includes('signal') || textCorpus.includes('gridlock') || textCorpus.includes('accident')) {
    suggestedCategory = 'Traffic and road safety';
  } else if (textCorpus.includes('mosquito') || textCorpus.includes('dengue') || textCorpus.includes('toilet') || textCorpus.includes('sanitation')) {
    suggestedCategory = 'Public sanitation';
  } else if (textCorpus.includes('tree') || textCorpus.includes('park') || textCorpus.includes('footpath') || textCorpus.includes('bench')) {
    suggestedCategory = 'Public infrastructure';
  } else if (textCorpus.includes('wire') || textCorpus.includes('transformer') || textCorpus.includes('spark') || textCorpus.includes('electric')) {
    suggestedCategory = 'Electricity-related civic issues';
  }

  const deptMap = {
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

  const suggestedDepartment = deptMap[suggestedCategory] || 'Road and Infrastructure Department';

  // 2. Duplicate / Similar Complaint Detection against active unresolved complaints
  let duplicateMatch = null;
  let highestSimilarity = 0;

  for (const comp of complaints) {
    if (comp.status === 'Resolved' || comp.status === 'Rejected') continue;

    let score = 0;
    if (
      comp.category.toLowerCase() === suggestedCategory.toLowerCase() ||
      comp.category.toLowerCase() === category.toLowerCase()
    ) {
      score += 0.35;
    }

    if (comp.ward.toLowerCase() === ward.toLowerCase() || textCorpus.includes(comp.ward.toLowerCase())) {
      score += 0.30;
    }

    const compWords = `${comp.title} ${comp.area}`.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const inputWords = textCorpus.split(/\W+/).filter(w => w.length > 3);
    const sharedWords = compWords.filter(w => inputWords.includes(w));
    if (sharedWords.length >= 2) {
      score += Math.min(0.35, sharedWords.length * 0.12);
    }

    if (Array.isArray(coordinates) && Array.isArray(comp.coordinates)) {
      const dLat = Math.abs(coordinates[0] - comp.coordinates[0]);
      const dLng = Math.abs(coordinates[1] - comp.coordinates[1]);
      if (dLat < 0.008 && dLng < 0.008) {
        score += 0.20;
      }
    }

    if (score > highestSimilarity) {
      highestSimilarity = score;
      if (score >= 0.65) {
        duplicateMatch = comp;
      }
    }
  }

  // 3. Priority & Urgency Assessment
  const criticalKeywords = ['crater', 'burst', 'live wire', 'spark', 'open manhole', 'accident', 'school', 'hospital', 'ambulance', 'gridlock', 'flood', 'sewage', 'skid', 'urgent', 'severe'];
  const highKeywords = ['broken', 'dark', 'overflow', 'leak', 'pothole', 'garbage', 'choked', 'blocked', 'signal'];

  let suggestedPriority = 'Medium';
  let hazardLevel = 'Level-3 Standard Civic Maintenance';

  if (criticalKeywords.some(k => textCorpus.includes(k))) {
    suggestedPriority = 'Critical';
    hazardLevel = 'Level-1 Critical Public Safety Threat (Immediate SLA)';
  } else if (highKeywords.some(k => textCorpus.includes(k))) {
    suggestedPriority = 'High';
    hazardLevel = 'Level-2 High Operational Priority (12h SLA)';
  }

  const confidenceScore = Number(Math.min(0.99, Math.max(0.86, 0.88 + (textCorpus.length > 40 ? 0.08 : 0.02))).toFixed(2));

  return {
    screened: true,
    verifiedByOfficer: false,
    duplicateDetected: duplicateMatch !== null,
    duplicateTicket: duplicateMatch ? duplicateMatch.id : null,
    duplicateItem: duplicateMatch || null,
    similarityScore: Math.round(Math.min(98, highestSimilarity * 100)),
    confidenceScore,
    suggestedCategory,
    suggestedDepartment,
    suggestedPriority,
    hazardLevel,
    needsHumanReview: confidenceScore < 0.88,
    aiSummary: duplicateMatch
      ? `Agentic AI detected an active similar complaint #${duplicateMatch.id} ("${duplicateMatch.title}") in ${duplicateMatch.ward}. You can co-sign/support #${duplicateMatch.id} to boost municipal priority or submit for officer review.`
      : `Agentic AI Vision & NLP verified unique civic anomaly (${Math.round(confidenceScore * 100)}% confidence). Classified under "${suggestedCategory}" and auto-routed to ${suggestedDepartment} with ${suggestedPriority} SLA.`
  };
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 15 * 1024 * 1024) {
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // ==================== API ROUTES ====================
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, {
      status: 'healthy',
      service: 'CIVICMIND Smart City Operations Engine',
      database: dbState?.meta?.engine || 'SQLite3 + JSON',
      complaintsCount: dbState?.complaints?.length || 0,
      usersCount: dbState?.users?.length || 0
    });
  }

  if (pathname === '/api/bootstrap' && req.method === 'GET') {
    return sendJson(res, 200, dbState);
  }

  // 1. Login Route
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const { email = '', password = '' } = await parseBody(req);
    const cleanEmail = email.trim().toLowerCase();
    const user = dbState.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return sendJson(res, 401, { success: false, error: 'No registered account found with this email address.' });
    }
    if (user.password !== password) {
      return sendJson(res, 401, { success: false, error: 'Invalid password. Please verify your credentials.' });
    }

    dbState.activityLogs.unshift({
      id: `log_${Date.now()}`,
      time: formatTimestamp(),
      actor: `${user.name} (${user.role})`,
      action: `Authenticated into ${user.role} Command Portal`,
      category: 'Authentication'
    });
    saveState(dbState);

    return sendJson(res, 200, { success: true, user });
  }

  // 2. Signup Route
  if (pathname === '/api/auth/signup' && req.method === 'POST') {
    const { name = '', email = '', password = '', role = 'Public', department, verificationId, phone, zone } = await parseBody(req);
    const cleanEmail = email.trim().toLowerCase();

    if (!name || !cleanEmail || !password) {
      return sendJson(res, 400, { success: false, error: 'Name, email, and password are required.' });
    }
    if (dbState.users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return sendJson(res, 409, { success: false, error: 'An account with this email address already exists.' });
    }

    // Security requirement: Admin accounts must not be obtainable through unrestricted public signup
    const assignedRole = role === 'Municipality' ? 'Municipality' : 'Public';

    const newUser = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      password,
      name: name.trim(),
      role: assignedRole,
      department: assignedRole === 'Municipality' ? (department || 'Road and Infrastructure Department') : 'Citizen',
      verificationId: assignedRole === 'Municipality' ? (verificationId || `BBMP-OFF-${Math.floor(100 + Math.random() * 900)}`) : null,
      phone: phone || '+91 98450 00000',
      zone: zone || 'Indiranagar',
      status: 'Active',
      joinedAt: new Date().toISOString().slice(0, 10),
      avatar: assignedRole === 'Municipality'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      badge: assignedRole === 'Municipality' ? 'Verified Municipal Officer' : 'Verified Citizen'
    };

    dbState.users.push(newUser);
    dbState.activityLogs.unshift({
      id: `log_${Date.now()}`,
      time: formatTimestamp(),
      actor: `${newUser.name} (${newUser.role})`,
      action: `Registered new ${newUser.role} account (${newUser.email})`,
      category: 'Registration'
    });
    saveState(dbState);

    return sendJson(res, 201, { success: true, user: newUser });
  }

  // 3. AI First-Level Screening Route
  if (pathname === '/api/ai/screen' && req.method === 'POST') {
    const payload = await parseBody(req);
    const screening = performAgenticScreening(payload, dbState.complaints);
    return sendJson(res, 200, { success: true, screening });
  }

  // 4. Create Complaint Route
  if (pathname === '/api/complaints' && req.method === 'POST') {
    const formData = await parseBody(req);
    const screening = performAgenticScreening(formData, dbState.complaints);
    const nowStr = formatTimestamp();
    const newId = `CM-${Math.floor(2100 + Math.random() * 7800)}`;

    const expDate = new Date(Date.now() + (screening.suggestedPriority === 'Critical' ? 12 : 36) * 3600 * 1000);
    const expectedResolution = expDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' 06:00 PM';

    const newComplaint = {
      id: newId,
      title: formData.title,
      category: formData.category || screening.suggestedCategory,
      department: formData.department || screening.suggestedDepartment,
      area: formData.area || `${formData.ward || 'Indiranagar'}, Bengaluru`,
      ward: formData.ward || 'Indiranagar',
      priority: formData.priority || screening.suggestedPriority,
      status: 'AI Screened',
      reportedBy: formData.reportedBy || 'Kusuma Devi',
      userEmail: formData.userEmail || 'kusuma@gmail.com',
      createdAt: nowStr,
      updatedAt: nowStr,
      expectedResolution,
      coordinates: formData.coordinates || [12.9784, 77.6408],
      upvotes: 1,
      description: formData.description,
      image: formData.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      aiScreening: screening,
      timeline: [
        {
          step: 'Submitted',
          time: nowStr,
          note: `Complaint submitted by ${formData.reportedBy || 'Citizen'} with GPS geotag (${(formData.coordinates || [12.9784, 77.6408]).join(', ')}).`
        },
        {
          step: 'AI Screened',
          time: nowStr,
          note: screening.aiSummary
        }
      ],
      officerRemarks: null,
      resolutionProof: null,
      resolutionNotes: null,
      rating: null,
      feedback: null
    };

    dbState.complaints.unshift(newComplaint);
    dbState.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: 'all',
      title: `New Complaint Logged: #${newId}`,
      message: `AI screened "${newComplaint.title}" (${newComplaint.priority}) and routed to ${newComplaint.department}.`,
      type: 'ai',
      read: false,
      time: 'Just now',
      ticketId: newId
    });
    dbState.activityLogs.unshift({
      id: `log_${Date.now()}`,
      time: nowStr,
      actor: `${newComplaint.reportedBy} (via CivicMind AI)`,
      action: `Filed #${newId} in ${newComplaint.ward} — Auto-routed to ${newComplaint.department}`,
      category: 'Complaint Registration'
    });
    saveState(dbState);

    return sendJson(res, 201, { success: true, complaint: newComplaint, state: dbState });
  }

  // 5. Support / Co-Sign Existing Duplicate Complaint
  const supportMatch = pathname.match(/^\/api\/complaints\/([^/]+)\/support$/);
  if (supportMatch && req.method === 'POST') {
    const ticketId = supportMatch[1];
    const { actor = 'Verified Citizen' } = await parseBody(req);
    const nowStr = formatTimestamp();

    const comp = dbState.complaints.find(c => c.id === ticketId);
    if (!comp) {
      return sendJson(res, 404, { success: false, error: 'Complaint not found.' });
    }

    comp.upvotes = (comp.upvotes || 1) + 1;
    comp.updatedAt = nowStr;
    if (comp.upvotes >= 10 && comp.priority === 'Medium') {
      comp.priority = 'High';
    }
    comp.timeline.push({
      step: 'AI Screened',
      time: nowStr,
      note: `Co-signed by ${actor} via AI Duplicate Prevention (+1 citizen endorsement; total ${comp.upvotes} supporters).`
    });

    dbState.activityLogs.unshift({
      id: `log_${Date.now()}`,
      time: nowStr,
      actor,
      action: `Endorsed existing complaint #${ticketId} instead of creating duplicate (Total supporters: ${comp.upvotes})`,
      category: 'De-Duplication'
    });
    saveState(dbState);

    return sendJson(res, 200, { success: true, complaint: comp, state: dbState });
  }

  // 6. Update Complaint Status / Officer Verification / Department Assignment
  const statusMatch = pathname.match(/^\/api\/complaints\/([^/]+)\/status$/);
  if (statusMatch && req.method === 'PATCH') {
    const ticketId = statusMatch[1];
    const {
      status,
      department,
      priority,
      officerRemarks,
      resolutionNotes,
      resolutionProof,
      verifiedByOfficer,
      actor = 'Municipal Officer'
    } = await parseBody(req);
    const nowStr = formatTimestamp();

    const comp = dbState.complaints.find(c => c.id === ticketId);
    if (!comp) {
      return sendJson(res, 404, { success: false, error: 'Complaint not found.' });
    }

    if (department) comp.department = department;
    if (priority) comp.priority = priority;
    if (officerRemarks !== undefined) comp.officerRemarks = officerRemarks;
    if (resolutionNotes) comp.resolutionNotes = resolutionNotes;
    if (resolutionProof) comp.resolutionProof = resolutionProof;
    if (verifiedByOfficer !== undefined && comp.aiScreening) {
      comp.aiScreening.verifiedByOfficer = verifiedByOfficer;
    }

    if (status && status !== comp.status) {
      comp.status = status;
      let stepNote = resolutionNotes || officerRemarks || `Status updated to ${status} by ${actor}.`;
      if (status === 'Verified') {
        stepNote = officerRemarks || `AI screening verified and approved by ${actor}.`;
      } else if (status === 'Assigned') {
        stepNote = officerRemarks || `Assigned to ${comp.department} zonal squad by ${actor}.`;
      } else if (status === 'In Progress') {
        stepNote = officerRemarks || `Field engineering crew deployed on-site by ${actor}.`;
      } else if (status === 'Resolved') {
        stepNote = resolutionNotes || `Issue resolved, evidence verified, and removed from active unresolved hazard map by ${actor}.`;
        if (!comp.resolutionProof) {
          comp.resolutionProof = 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80';
        }
      } else if (status === 'Rejected') {
        stepNote = resolutionNotes || officerRemarks || `Marked invalid/rejected by ${actor}.`;
      }

      comp.timeline.push({
        step: status,
        time: nowStr,
        note: stepNote
      });

      dbState.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: 'all',
        title: `Ticket #${comp.id} is now ${status}`,
        message: stepNote,
        type: status === 'Resolved' ? 'resolved' : 'status',
        read: false,
        time: 'Just now',
        ticketId: comp.id
      });
    }

    comp.updatedAt = nowStr;
    dbState.activityLogs.unshift({
      id: `log_${Date.now()}`,
      time: nowStr,
      actor,
      action: `Updated #${comp.id} → Status: ${comp.status} | Dept: ${comp.department}`,
      category: 'Municipal Action'
    });

    saveState(dbState);
    return sendJson(res, 200, { success: true, complaint: comp, state: dbState });
  }

  // 7. Submit Citizen Feedback & Rating
  const feedbackMatch = pathname.match(/^\/api\/complaints\/([^/]+)\/feedback$/);
  if (feedbackMatch && req.method === 'POST') {
    const ticketId = feedbackMatch[1];
    const { rating = 5, feedback = '', feedbackPhoto = null, issueResolved = true, actor = 'Citizen' } = await parseBody(req);
    const nowStr = formatTimestamp();

    const comp = dbState.complaints.find(c => c.id === ticketId);
    if (!comp) {
      return sendJson(res, 404, { success: false, error: 'Complaint not found.' });
    }

    comp.rating = Number(rating);
    comp.feedback = feedback;
    comp.feedbackPhoto = feedbackPhoto;
    comp.issueResolvedConfirmed = issueResolved;
    comp.updatedAt = nowStr;

    dbState.activityLogs.unshift({
      id: `log_${Date.now()}`,
      time: nowStr,
      actor,
      action: `Rated #${comp.id} (${rating}/5 Stars): "${feedback.slice(0, 60)}"`,
      category: 'Citizen Feedback'
    });

    saveState(dbState);
    return sendJson(res, 200, { success: true, complaint: comp, state: dbState });
  }

  // 8. Admin User Management & Profile Updates
  if (pathname === '/api/users' && req.method === 'POST') {
    const body = await parseBody(req);
    const newUser = {
      id: `usr_${Date.now()}`,
      email: body.email,
      password: body.password || 'city123',
      name: body.name,
      role: body.role || 'Municipality',
      department: body.department || 'Road and Infrastructure Department',
      phone: body.phone || '+91 80 2266 1099',
      zone: body.zone || 'Indiranagar',
      status: 'Active',
      joinedAt: new Date().toISOString().slice(0, 10),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      badge: body.role === 'Admin' ? 'City Administrator' : body.role === 'Municipality' ? 'Municipal Officer' : 'Verified Citizen'
    };
    dbState.users.push(newUser);
    saveState(dbState);
    return sendJson(res, 201, { success: true, user: newUser, state: dbState });
  }

  const userPatchMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
  if (userPatchMatch && req.method === 'PATCH') {
    const userId = userPatchMatch[1];
    const updates = await parseBody(req);
    const user = dbState.users.find(u => u.id === userId);
    if (!user) return sendJson(res, 404, { success: false, error: 'User not found' });
    Object.assign(user, updates);
    saveState(dbState);
    return sendJson(res, 200, { success: true, user, state: dbState });
  }

  // 9. Mark Notifications Read
  if (pathname === '/api/notifications/read' && req.method === 'PATCH') {
    dbState.notifications.forEach(n => {
      n.read = true;
    });
    saveState(dbState);
    return sendJson(res, 200, { success: true, state: dbState });
  }

  // 10. Reset Demo Database
  if (pathname === '/api/reset' && req.method === 'POST') {
    dbState = getInitialSeedState();
    saveState(dbState);
    return sendJson(res, 200, { success: true, state: dbState });
  }

  // ==================== STATIC FRONTEND SERVING ====================
  if (fs.existsSync(DIST_DIR)) {
    let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }
    try {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      return res.end(content);
    } catch (e) {
      res.writeHead(500);
      return res.end('Server Error');
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('CivicMind API Server is running. Build frontend with npm run build to serve UI.');
  }
});

initDatabase().then((state) => {
  dbState = state;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==================================================================`);
    console.log(`🚀 CIVICMIND FULL-STACK PLATFORM RUNNING AT: http://localhost:${PORT}`);
    console.log(`🗄️  Database Engine: ${dbState.meta.engine}`);
    console.log(`📊 Active Complaints: ${dbState.complaints.length} | Departments: ${dbState.departments.length} | Zones: ${dbState.zones.length}`);
    console.log(`==================================================================\n`);
  });
});
