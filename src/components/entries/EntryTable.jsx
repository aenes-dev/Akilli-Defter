import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, Trash2, Pencil, Inbox } from "lucide-react";
import { formatTRY, formatDate } from "../../utils/format";
import { useAuthStore } from "../../store/authStore";
import { useSheetStore } from "../../store/sheetStore";

export default function EntryTable({ entries, sheetId, loading, onEdit }) {
  const { user } = useAuthStore();
  const { deleteEntry } = useSheetStore();

  if (loading) {
    return (
      <div className="ledger-lines rounded-2xl border border-border bg-surface/60 p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="h-4 w-4 animate-pulse rounded-full bg-surface-3" />
            <div className="h-3.5 w-40 animate-pulse rounded bg-surface-3" />
            <div className="ml-auto h-3.5 w-20 animate-pulse rounded bg-surface-3" />
          </div>
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <Inbox size={28} className="text-text-muted" />
        <p className="mt-3 text-sm text-text-dim">Henüz kayıt yok.</p>
        <p className="text-xs text-text-muted">Bu sayfaya ilk gelir ya da gideri ekle.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-3 border-b border-border bg-surface-2/60 px-5 py-3 text-xs font-medium uppercase tracking-wide text-text-muted sm:grid">
        <span>Açıklama</span>
        <span>Kategori</span>
        <span>Tarih</span>
        <span className="text-right">Tutar</span>
        <span></span>
      </div>
      <div className="divide-y divide-border/70">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              onClick={() => onEdit(entry)}
              className="group grid cursor-pointer grid-cols-2 items-center gap-2 px-5 py-3.5 transition-colors hover:bg-surface-2/40 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto] sm:gap-3"
              title="Kaydı düzenlemek için tıkla"
            >
              <div className="col-span-2 flex items-center gap-2.5 sm:col-span-1">
                {entry.type === "income" ? (
                  <ArrowUpCircle size={16} className="shrink-0 text-gold" />
                ) : (
                  <ArrowDownCircle size={16} className="shrink-0 text-wine" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">{entry.title}</p>
                  {entry.note && (
                    <p className="truncate text-xs text-text-muted">{entry.note}</p>
                  )}
                </div>
              </div>
              <span className="text-xs text-text-dim sm:text-sm">
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-text-dim">
                  {entry.category}
                </span>
              </span>
              <span className="text-xs text-text-muted sm:text-sm">{formatDate(entry.date)}</span>
              <span
                className={`font-mono-num text-sm font-semibold sm:text-right ${
                  entry.type === "income" ? "text-gold" : "text-wine-soft"
                }`}
              >
                {entry.type === "income" ? "+" : "−"} {formatTRY(entry.amount)}
              </span>
              <div className="flex items-center justify-self-end opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(entry);
                  }}
                  className="rounded-md p-1.5 text-text-muted hover:bg-surface-3 hover:text-gold cursor-pointer"
                  title="Kaydı düzenle"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEntry(user.uid, sheetId, entry.id);
                  }}
                  className="rounded-md p-1.5 text-text-muted hover:bg-wine/15 hover:text-wine-soft cursor-pointer"
                  title="Kaydı sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
