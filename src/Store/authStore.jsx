import { create } from "zustand";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// Create auth store with Zustand
export const useAuthStore = create((set) => ({
  currentUser: null,
  loading: true,

  // Initialize the auth listener
  initAuth: () => {
    const auth = getAuth();

    // Set persistence to local
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Persistence setting error:", error);
    });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      set({
        currentUser: user,
        loading: false,
      });
    });

    // Return unsubscribe function for cleanup
    return unsubscribe;
  },

  // Logout function
  logout: async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      // No need to update state here as the auth listener will handle it
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },
}));

// Initialize auth listener when the app starts
let unsubscribeAuth;

// Function to initialize auth that should be called once at app startup
export const initializeAuth = () => {
  // Cleanup previous subscription if it exists
  if (unsubscribeAuth) {
    unsubscribeAuth();
  }

  // Set up new subscription
  unsubscribeAuth = useAuthStore.getState().initAuth();

  // Cleanup on app unmount/reload
  return () => {
    if (unsubscribeAuth) {
      unsubscribeAuth();
    }
  };
};
