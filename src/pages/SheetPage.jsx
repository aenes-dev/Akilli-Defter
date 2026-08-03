import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useSheetStore } from "../store/sheetStore";
import { TAB_COLOR_HEX, initialsOf } from "../utils/format";
import SummaryCards from "../components/dashboard/SummaryCards";
import EntryTable from "../components/entries/EntryTable";
import NewEntryModal from "../components/entries/NewEntryModal";
import Button from "../components/ui/Button";

export default function SheetPage({ sheetId }) {
  const { sheets, entries, entriesLoading } = useSheetStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filter, setFilter] = useState("all"); // all | income | expense

  const sheet = sheets.find((s) => s.id === sheetId);
  const list = entries[sheetId] || [];
  const loading = entriesLoading[sheetId];

  const totals = useMemo(() => {
    const income = list.filter((e) => e.type === "income").reduce((a, b) => a + b.amount, 0);
    const expense = list.filter((e) => e.type === "expense").reduce((a, b) => a + b.amount, 0);
    return { income, expense };
  }, [list]);

  const filtered = useMemo(() => {
    if (filter === "all") return list;
    return list.filter((e) => e.type === filter);
  }, [list, filter]);

  if (!sheet) return null;

  function openAddModal() {
    setEditingEntry(null);
    setModalOpen(true);
  }

  function openEditModal(entry) {
    setEditingEntry(entry);
    setModalOpen(true);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-ink"
            style={{ backgroundColor: TAB_COLOR_HEX[sheet.color] }}
          >
            {initialsOf(sheet.name)}
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Sayfa</p>
            <h1 className="font-display text-3xl text-text">{sheet.name}</h1>
          </div>
        </div>
        <Button icon={Plus} onClick={openAddModal}>
          Kayıt Ekle
        </Button>
      </div>

      <SummaryCards income={totals.income} expense={totals.expense} />

      <div className="flex items-center gap-2">
        {[
          { key: "all", label: "Tümü" },
          { key: "income", label: "Gelirler", icon: ArrowUpCircle },
          { key: "expense", label: "Giderler", icon: ArrowDownCircle },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              filter === f.key
                ? "border-gold/40 bg-gold/10 text-gold"
                : "border-border text-text-muted hover:text-text"
            }`}
          >
            {f.icon && <f.icon size={13} />}
            {f.label}
          </button>
        ))}
      </div>

      <EntryTable entries={filtered} sheetId={sheetId} loading={loading} onEdit={openEditModal} />

      <NewEntryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sheetId={sheetId}
        entry={editingEntry}
      />
    </div>
  );
}
