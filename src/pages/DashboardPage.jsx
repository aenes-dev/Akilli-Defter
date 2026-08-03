import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, BookOpen } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useSheetStore } from "../store/sheetStore";
import Sidebar from "../components/layout/Sidebar";
import OverviewPage from "./OverviewPage";
import SheetPage from "./SheetPage";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const {
    sheets,
    sheetsLoading,
    activeSheetId,
    setActiveSheet,
    subscribeSheets,
    subscribeEntries,
    validateActiveSheet,
    reset,
  } = useSheetStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    subscribeSheets(user.uid);
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    sheets.forEach((s) => subscribeEntries(user.uid, s.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, sheets.length]);

  useEffect(() => {
    // Sayfalar Firestore'dan ilk kez geldiğinde, localStorage'dan gelen
    // aktif sayfa hâlâ mevcut mu diye kontrol et (silinmiş olabilir).
    if (!sheetsLoading) validateActiveSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetsLoading]);

  return (
    <div className="flex min-h-screen bg-bg">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-text-dim hover:bg-surface-2 cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-gold" />
            <span className="font-display text-lg text-text">Akıllı Defter</span>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSheetId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {activeSheetId === "overview" ? (
                <OverviewPage onOpenSheet={(id) => setActiveSheet(id)} />
              ) : (
                <SheetPage sheetId={activeSheetId} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}