import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/config";

function mapAuthError(code) {
  const map = {
    "auth/email-already-in-use": "Bu e-posta adresi zaten kullanımda.",
    "auth/invalid-email": "Geçersiz e-posta adresi.",
    "auth/weak-password": "Şifre en az 6 karakter olmalı.",
    "auth/invalid-credential": "E-posta veya şifre hatalı.",
    "auth/user-not-found": "E-posta veya şifre hatalı.",
    "auth/wrong-password": "E-posta veya şifre hatalı.",
    "auth/too-many-requests": "Çok fazla deneme yapıldı. Lütfen biraz bekleyin.",
  };
  return map[code] || "Bir şeyler ters gitti. Lütfen tekrar deneyin.";
}

export const useAuthStore = create((set, get) => ({
  user: null,
  initializing: true,
  authError: null,
  authLoading: false,

  init: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, initializing: false });
    });
  },

  register: async (name, email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      set({ user: { ...cred.user, displayName: name }, authLoading: false });
      return true;
    } catch (err) {
      set({ authError: mapAuthError(err.code), authLoading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      set({ authLoading: false });
      return true;
    } catch (err) {
      set({ authError: mapAuthError(err.code), authLoading: false });
      return false;
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  clearError: () => set({ authError: null }),
}));
