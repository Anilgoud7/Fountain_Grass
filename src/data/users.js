// src/data/users.js
// Simple local-storage-backed user store with subscribe/update helpers.
// Usage (named imports):
//   import { getUsers, setUserName, subscribe } from 'src/data/users';
// Usage (default import):
//   import users from 'src/data/users';
//   users.getUsers()

const DEFAULT_USERS = {
  user001: "Alice Johnson",
  user002: "Bob Smith",
  user003: "Charlie Brown",
  user004: "Diana Prince",
  user005: "Edward Norton",
};

const STORAGE_KEY = "voice_tutor_users_v1";

let _users = loadFromStorage();
const _listeners = new Set();

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_USERS };
    const parsed = JSON.parse(raw);
    // ensure defaults present (non-destructive)
    return { ...DEFAULT_USERS, ...(parsed || {}) };
  } catch (err) {
    console.warn("users: load error, using defaults", err);
    return { ...DEFAULT_USERS };
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_users));
  } catch (err) {
    console.warn("users: persist error", err);
  }
}

function emitChange() {
  for (const cb of Array.from(_listeners)) {
    try {
      cb({ ..._users });
    } catch (err) {
      console.error("users: listener error", err);
    }
  }
}

export function getUsers() {
  return { ..._users };
}

/**
 * Set a user's name. If id not present, it will be created.
 * Returns the new user object.
 */
export function setUserName(id, name) {
  if (!id || typeof name !== "string") return getUsers();
  _users = { ..._users, [id]: name };
  persist();
  emitChange();
  return { ..._users };
}

/**
 * Replace entire users object (use sparingly).
 */
export function replaceUsers(newUsers) {
  _users = { ...(newUsers || {}) };
  persist();
  emitChange();
  return { ..._users };
}

/**
 * Subscribe to user changes. Returns unsubscribe function.
 * cb receives the entire users object.
 */
export function subscribe(cb) {
  _listeners.add(cb);
  // call immediately with current state
  try {
    cb({ ..._users });
  } catch (err) {}
  return () => {
    _listeners.delete(cb);
  };
}

/**
 * Reset to defaults (clears persisted store).
 */
export function resetToDefaults() {
  _users = { ...DEFAULT_USERS };
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
  emitChange();
}

/**
 * Default export (object) — mirrors the named exports so both import styles work.
 */
const defaultExport = {
  getUsers,
  setUserName,
  replaceUsers,
  subscribe,
  resetToDefaults,
};

export default defaultExport;
