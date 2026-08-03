import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const TAB_COLORS = ["gold", "wine", "slate", "violet", "sage", "clay"];

let sheetsUnsub = null;
const entryUnsubs = {};

function sheetsCol(uid) {
  return collection(db, "users", uid, "sheets");
}
function entriesCol(uid, sheetId) {
  return collection(db, "users", uid, "sheets", sheetId, "entries");
}

export const useSheetStore = create(
  persist(
    (set, get) => ({
      sheets: [],
      sheetsLoading: true,
      entries: {}, // { [sheetId]: Entry[] }
      entriesLoading: {}, // { [sheetId]: bool }
      activeSheetId: "overview",

      setActiveSheet: (id) => set({ activeSheetId: id }),

      subscribeSheets: (uid) => {
        if (sheetsUnsub) sheetsUnsub();
        set({ sheetsLoading: true });
        const q = query(sheetsCol(uid), orderBy("createdAt", "asc"));
        sheetsUnsub = onSnapshot(q, (snap) => {
          const sheets = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          set({ sheets, sheetsLoading: false });
        });
      },

      addSheet: async (uid, { name, color }) => {
        const docRef = await addDoc(sheetsCol(uid), {
          name,
          color: color || TAB_COLORS[get().sheets.length % TAB_COLORS.length],
          createdAt: serverTimestamp(),
        });
        return docRef.id;
      },

      renameSheet: async (uid, sheetId, name) => {
        await updateDoc(doc(db, "users", uid, "sheets", sheetId), { name });
      },

      deleteSheet: async (uid, sheetId) => {
        await deleteDoc(doc(db, "users", uid, "sheets", sheetId));
        if (entryUnsubs[sheetId]) {
          entryUnsubs[sheetId]();
          delete entryUnsubs[sheetId];
        }
        set((state) => {
          const entries = { ...state.entries };
          delete entries[sheetId];
          const activeSheetId =
            state.activeSheetId === sheetId ? "overview" : state.activeSheetId;
          return { entries, activeSheetId };
        });
      },

      subscribeEntries: (uid, sheetId) => {
        if (entryUnsubs[sheetId]) return; // already subscribed
        set((state) => ({
          entriesLoading: { ...state.entriesLoading, [sheetId]: true },
        }));
        const q = query(entriesCol(uid, sheetId), orderBy("date", "desc"));
        entryUnsubs[sheetId] = onSnapshot(q, (snap) => {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          set((state) => ({
            entries: { ...state.entries, [sheetId]: list },
            entriesLoading: { ...state.entriesLoading, [sheetId]: false },
          }));
        });
      },

      addEntry: async (uid, sheetId, entry) => {
        await addDoc(entriesCol(uid, sheetId), {
          type: entry.type, // 'income' | 'expense'
          title: entry.title,
          category: entry.category,
          amount: Number(entry.amount),
          date: entry.date,
          note: entry.note || "",
          createdAt: serverTimestamp(),
        });
      },

      updateEntry: async (uid, sheetId, entryId, data) => {
        await updateDoc(doc(db, "users", uid, "sheets", sheetId, "entries", entryId), data);
      },

      deleteEntry: async (uid, sheetId, entryId) => {
        await deleteDoc(doc(db, "users", uid, "sheets", sheetId, "entries", entryId));
      },

      // Aktif sayfayı geçerli olup olmadığını doğrular; silinmiş bir sayfaya
      // işaret ediyorsa Genel Bakış'a döner. Sayfalar yüklendikten sonra çağrılır.
      validateActiveSheet: () => {
        const { activeSheetId, sheets } = get();
        if (activeSheetId === "overview") return;
        if (!sheets.some((s) => s.id === activeSheetId)) {
          set({ activeSheetId: "overview" });
        }
      },

      reset: () => {
        if (sheetsUnsub) sheetsUnsub();
        sheetsUnsub = null;
        Object.values(entryUnsubs).forEach((fn) => fn());
        Object.keys(entryUnsubs).forEach((k) => delete entryUnsubs[k]);
        set({
          sheets: [],
          sheetsLoading: true,
          entries: {},
          entriesLoading: {},
        });
      },
    }),
    {
      name: "defter-active-view",
      // Sadece hangi sayfada olduğumuzu localStorage'da tutuyoruz;
      // gerçek veriler her zaman Firestore'dan gelir.
      partialize: (state) => ({ activeSheetId: state.activeSheetId }),
    }
  )
);