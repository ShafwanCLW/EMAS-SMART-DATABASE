// Session management utilities

// Save user session to localStorage
export function saveUserSession(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Load user session from localStorage
export function loadUserSession() {
  const savedUser = localStorage.getItem('currentUser');
  return savedUser ? JSON.parse(savedUser) : null;
}

// Clear user session from localStorage
export function clearUserSession() {
  localStorage.removeItem('currentUser');
}

// Check if user session exists
export function hasUserSession() {
  return localStorage.getItem('currentUser') !== null;
}