// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate that all required environment variables are present
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Missing Firebase configuration. Using mock services for development.');
  // Instead of throwing an error, we'll use mock services
  // This allows the app to run without Firebase configuration for development
}

// Initialize Firebase or mock services based on configuration availability
let auth, db, storage;

if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
  // Initialize Firebase with real configuration
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  // Mock implementations for development
  auth = {
    // Mock auth methods
    signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'mock-uid' } }),
    signOut: () => Promise.resolve()
  };
  
  db = {
    // Mock firestore methods
    collection: () => ({})
  };
  
  storage = {
    // Mock storage methods
    ref: () => ({})
  };
}

// Export the services (real or mock)
export { auth, db, storage };

// Export a mock app if real app is not initialized
export default firebaseConfig.apiKey ? initializeApp(firebaseConfig) : { name: 'mock-app' };