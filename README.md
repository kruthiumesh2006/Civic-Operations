# CIVICMIND – AI-Powered Smart City Operations Platform

An Agentic Civic Operations System connecting citizens, municipal authorities, and city administrators with real-time AI first-level screening, duplicate complaint detection, live camera & GPS geotagging, and an interactive Bengaluru GIS Red/Yellow/Green risk map.

## 🚀 Features

- **Continuous Scrollable Landing Page**: Hero section with live telemetry, animated 4-stage AI lifecycle visual, About & Mission, Platform Features, How It Works, Bengaluru 10-Zone Map Preview, 10 Municipal Departments Preview, Citizen Testimonials, and 24/7 Command Contact Form.
- **Role-Based Authentication & Portals**:
  - **Citizen / Public Portal**: Submit geotagged complaints with live browser camera, track 6-stage lifecycle (`Submitted → AI Screened → Verified → Assigned → In Progress → Resolved`), co-sign nearby complaints, and submit 5-star reviews.
  - **Municipality Officer Console**: Dominated by the live Bengaluru GIS map, 6 operational KPIs, department SLA analytics, and a full Complaint Management Console to verify AI triage, assign squads, update status, upload resolution proof, or reject invalid tickets.
  - **Admin Executive Command Centre**: City Health Index, interactive charts (Monthly Trends, Category Breakdown, 10-Zone Distribution), system activity logs, User Management, and Department Management.
- **Live Bengaluru GIS Map (10 Zones)**: Covers *Jayanagar, Indiranagar, Whitefield, Koramangala, Electronic City, Rajajinagar, Malleshwaram, Hebbal, Marathahalli, and Yelahanka* with Standard Dark GIS, Satellite View, and Heatmap modes.
- **10-Step Agentic AI Assistant**: Live 10-step reasoning simulator, human-in-the-loop approval controls, and interactive AI chat copilot.
- **Backend & Database**: Node.js REST API (`server/index.js`) backed by native SQLite3 (`server/civicmind.db`) and synchronized JSON persistence (`server/database.json`).

## 🛠️ Quick Start

```bash
# Install dependencies
npm install

# Build frontend & start full-stack server on http://localhost:5000
npm start
```
