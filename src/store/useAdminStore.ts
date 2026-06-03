import { create } from "zustand";

const SESSION_KEY = "lors_admin_auth";

interface AdminState {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_EMAIL = "admin@lorsnexus";
const ADMIN_PASSWORD = "2026@Lorsnexus";

function loadSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: loadSession(),
  adminEmail: loadSession() ? ADMIN_EMAIL : null,

  login: (email, password) => {
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      set({ isAuthenticated: true, adminEmail: ADMIN_EMAIL });
      return true;
    }
    return false;
  },

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ isAuthenticated: false, adminEmail: null });
  },
}));
