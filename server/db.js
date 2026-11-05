import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEMO_USERS,
  MUNICIPAL_DEPARTMENTS,
  CITY_WARDS_ZONES,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS
} from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQLITE_PATH = path.join(__dirname, 'civicmind.db');
const JSON_DB_PATH = path.join(__dirname, 'database.json');

let sqliteDb = null;

// Initialize native Node.js SQLite database + JSON snapshot mirror
export async function initDatabase() {
  try {
    const sqliteModule = await import('node:sqlite');
    const { DatabaseSync } = sqliteModule;
    sqliteDb = new DatabaseSync(SQLITE_PATH);

    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS kv_store (
        collection TEXT PRIMARY KEY,
        payload TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS complaints_sql (
        id TEXT PRIMARY KEY,
        title TEXT,
        category TEXT,
        department TEXT,
        ward TEXT,
        priority TEXT,
        status TEXT,
        reported_by TEXT,
        created_at TEXT,
        json_data TEXT
      );
      CREATE TABLE IF NOT EXISTS users_sql (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        role TEXT,
        department TEXT,
        json_data TEXT
      );
    `);
  } catch (err) {
    console.warn('SQLite fallback to JSON persistence:', err.message);
  }

  let state = loadState();
  if (!state) {
    state = getInitialSeedState();
    saveState(state);
  }
  return state;
}

export function getInitialSeedState() {
  return {
    users: structuredClone(DEMO_USERS),
    departments: structuredClone(MUNICIPAL_DEPARTMENTS),
    zones: structuredClone(CITY_WARDS_ZONES),
    complaints: structuredClone(INITIAL_COMPLAINTS),
    notifications: structuredClone(INITIAL_NOTIFICATIONS),
    activityLogs: structuredClone(INITIAL_ACTIVITY_LOGS),
    meta: {
      version: '3.0.0-ENTERPRISE',
      engine: sqliteDb ? 'SQLite3 (node:sqlite) + JSON Mirror' : 'JSON Persistent Store',
      lastUpdated: new Date().toISOString()
    }
  };
}

export function loadState() {
  try {
    if (sqliteDb) {
      const row = sqliteDb.prepare('SELECT payload FROM kv_store WHERE collection = ?').get('civicmind_state');
      if (row && row.payload) {
        return JSON.parse(row.payload);
      }
    }
    if (fs.existsSync(JSON_DB_PATH)) {
      const raw = fs.readFileSync(JSON_DB_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading DB state:', e);
  }
  return null;
}

export function saveState(state) {
  state.meta = {
    version: '3.0.0-ENTERPRISE',
    engine: sqliteDb ? 'SQLite3 (node:sqlite) + JSON Mirror' : 'JSON Persistent Store',
    lastUpdated: new Date().toISOString()
  };

  const serialized = JSON.stringify(state, null, 2);

  // 1. Write readable JSON database file
  try {
    fs.writeFileSync(JSON_DB_PATH, serialized, 'utf-8');
  } catch (e) {
    console.error('Failed writing JSON DB:', e);
  }

  // 2. Sync to relational SQLite tables
  if (sqliteDb) {
    try {
      const now = new Date().toISOString();
      const upsertKv = sqliteDb.prepare(`
        INSERT INTO kv_store (collection, payload, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(collection) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at
      `);
      upsertKv.run('civicmind_state', serialized, now);

      const upsertComplaint = sqliteDb.prepare(`
        INSERT INTO complaints_sql (id, title, category, department, ward, priority, status, reported_by, created_at, json_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          status = excluded.status,
          priority = excluded.priority,
          department = excluded.department,
          json_data = excluded.json_data
      `);
      for (const c of state.complaints) {
        upsertComplaint.run(
          c.id,
          c.title,
          c.category,
          c.department,
          c.ward,
          c.priority,
          c.status,
          c.reportedBy,
          c.createdAt,
          JSON.stringify(c)
        );
      }

      const upsertUser = sqliteDb.prepare(`
        INSERT INTO users_sql (id, email, name, role, department, json_data)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          role = excluded.role,
          department = excluded.department,
          json_data = excluded.json_data
      `);
      for (const u of state.users) {
        upsertUser.run(u.id, u.email, u.name, u.role, u.department || '', JSON.stringify(u));
      }
    } catch (e) {
      console.error('SQLite sync warning:', e.message);
    }
  }

  return state;
}
