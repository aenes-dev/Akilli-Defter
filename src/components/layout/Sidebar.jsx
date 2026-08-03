import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, LayoutGrid, Plus, LogOut, Trash2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useSheetStore, TAB_COLORS } from "../../store/sheetStore";
import { TAB_COLOR_HEX, initialsOf } from "../../utils/format";
import NewSheetModal from "../sheets/NewSheetModal";

function SheetTab({ sheet, active, onClick, onDelete }) {
  const hex = TAB_COLOR_HEX[sheet.color] || TAB_COLOR_HEX.gold;
  return (
    <motion.div
      onClick={onClick}
      layout
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className={`group relative flex w-full items-center gap-3 rounded-l-xl py-2.5 pl-3 pr-2 text-left transition-colors cursor-pointer ${
        active ? "bg-surface" : "hover:bg-surface/60"
      }`}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-ink"
        style={{ backgroundColor: hex }}
      >
        {initialsOf(sheet.name) || "?"}
      </span>
      <span
        className={`flex-1 truncate text-sm ${
          active ? "font-semibold text-text" : "text-text-dim"
        }`}
      >
        {sheet.name}
      </span>
      {active && (
        <motion.span
          layoutId="active-tab-indicator"
          className="absolute -right-[1px] top-0 h-full w-[3px] rounded-full"
          style={{ backgroundColor: hex }}
        />
      )}
    <button
  onClick={(e) => {
    e.stopPropagation();
    onDelete();
  }}
  className="shrink-0 rounded-md p-1 transition-opacity cursor-pointer text-text-muted hover:bg-wine/15 hover:text-wine-soft opacity-100 md:opacity-0 md:group-hover:opacity-100"
  title="Sayfayı sil"
>
  <Trash2 size={13} />
</button>
    </motion.div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sheets, activeSheetId, setActiveSheet, deleteSheet } = useSheetStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Kullanıcı";

  
  return (
    <>
    <aside className="flex h-[100dvh] w-72 shrink-0 flex-col border-r border-border bg-ink">
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
            <BookOpen size={18} />
          </div>
          <span className="font-display text-xl tracking-tight text-paper">Akıllı Defter</span>
        </div>

        <div className="px-3">
          <motion.button
            onClick={() => setActiveSheet("overview")}
            className={`flex w-full items-center gap-3 rounded-l-xl py-2.5 pl-3 pr-2 text-left transition-colors cursor-pointer ${
              activeSheetId === "overview" ? "bg-surface" : "hover:bg-surface/60"
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-text-dim">
              <LayoutGrid size={15} />
            </span>
            <span
              className={`flex-1 text-sm ${
                activeSheetId === "overview" ? "font-semibold text-text" : "text-text-dim"
              }`}
            >
              Genel Bakış
            </span>
            {activeSheetId === "overview" && (
              <motion.span
                layoutId="active-tab-indicator"
                className="absolute right-0 h-8 w-[3px] rounded-full bg-gold"
              />
            )}
          </motion.button>
        </div>

        <div className="mt-6 flex items-center justify-between px-5">
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Sayfalar
          </span>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface-2 hover:text-gold cursor-pointer"
            title="Yeni sayfa ekle"
          >
            <Plus size={16} />
          </button>
        </div>

  <div className="mt-2 flex-1 min-h-0 space-y-1 overflow-y-auto px-3 pb-4">
          <AnimatePresence initial={false}>
            {sheets.map((sheet) => (
              <motion.div
                key={sheet.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
              >
                <SheetTab
                  sheet={sheet}
                  active={activeSheetId === sheet.id}
                  onClick={() => setActiveSheet(sheet.id)}
                  onDelete={() => setConfirmDelete(sheet)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {sheets.length === 0 && (
            <button
              onClick={() => setModalOpen(true)}
              className="mt-2 w-full rounded-xl border border-dashed border-border py-4 text-xs text-text-muted transition-colors hover:border-gold/40 hover:text-gold cursor-pointer"
            >
              + İlk sayfanı oluştur
            </button>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-text-dim">
              {initialsOf(displayName)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">{displayName}</p>
              <p className="truncate text-xs text-text-muted">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Çıkış yap"
              className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-wine/15 hover:text-wine-soft cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <NewSheetModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5"
          >
            <h3 className="font-display text-lg text-text">Sayfayı sil</h3>
            <p className="mt-2 text-sm text-text-dim">
              <strong className="text-text">{confirmDelete.name}</strong> sayfasını ve
              içindeki tüm kayıtları silmek üzeresin. Bu işlem geri alınamaz.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg px-4 py-2 text-sm text-text-dim hover:bg-surface-2 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  deleteSheet(user.uid, confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="rounded-lg bg-wine px-4 py-2 text-sm font-medium text-white hover:bg-wine/90 cursor-pointer"
              >
                Sil
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
