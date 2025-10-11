// Authentication service

// Mock user database
const users = {
  'admin@example.com': { password: 'admin123', role: 'admin', name: 'Administrator' },
  'user@example.com': { password: 'user123', role: 'user', name: 'Regular User' }
};

// Current user state
let currentUser = null;

// Authentication methods
export class AuthService {
  static getCurrentUser() {
    return currentUser;
  }

  static setCurrentUser(user) {
    currentUser = user;
  }

  static login(email, password, selectedRole) {
    // Check if user exists
    const user = users[email];
    
    if (!user) {
      throw new Error('Invalid email address');
    }
    
    // Check password
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    // Check role
    if (user.role !== selectedRole) {
      throw new Error('Invalid role selected for this account');
    }
    
    // Login successful
    currentUser = user;
    return user;
  }

  static logout() {
    currentUser = null;
  }

  static isAuthenticated() {
    return currentUser !== null;
  }

  static isAdmin() {
    return currentUser && currentUser.role === 'admin';
  }

  static isUser() {
    return currentUser && currentUser.role === 'user';
  }

  static getUsers() {
    return users;
  }
}

// Handle login form submission
export function handleLogin(event, onSuccess, onError) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');
  const selectedRole = formData.get('role');
  
  try {
    const user = AuthService.login(email, password, selectedRole);
    onSuccess(user);
  } catch (error) {
    onError(error.message);
  }
}

// Handle logout
export function handleLogout(onLogout) {
  AuthService.logout();
  onLogout();
}