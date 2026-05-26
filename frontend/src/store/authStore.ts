import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (user: User) => void;
  logout: () => void;
  setInitialized: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setInitialized: () => set({ isInitializing: false }),
}));
