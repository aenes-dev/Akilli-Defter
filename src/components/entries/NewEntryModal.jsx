import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuthStore } from "../../store/authStore";
import { useSheetStore } from "../../store/sheetStore";
import { todayISO } from "../../utils/format";
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from "lucide-react";

const CATEGORIES = {
  income: ["Maaş", "Ek Gelir", "Yatırım", "Hediye", "Diğer"],
  expense: ["Market", "Kira", "Fatura", "Ulaşım", "Sağlık", "Eğlence", "Eğitim", "Diğer"],
};

const EMPTY = {
  type: "expense",
  title: "",
  amount: "",
  category: CATEGORIES.expense[0],
  date: todayISO(),
  note: "",
};

// `entry` verilirse form düzenleme modunda açılır; verilmezse yeni kayıt eklenir.
export default function NewEntryModal({ open, onClose, sheetId, entry = null }) {
  const { user } = useAuthStore();
  const { addEntry, updateEntry } = useSheetStore();
  const isEditing = Boolean(entry);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (entry) {
      setForm({
        type: entry.type,
        title: entry.title,
        amount: String(entry.amount),
        category: entry.category,
        date: entry.date,
        note: entry.note || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, entry]);

  function switchType(t) {
    setForm((f) => ({ ...f, type: t, category: CATEGORIES[t][0] }));
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    setLoading(true);
    const payload = { ...form, title: form.title.trim() };
    if (isEditing) {
      await updateEntry(user.uid, sheetId, entry.id, {
        ...payload,
        amount: Number(payload.amount),
      });
    } else {
      await addEntry(user.uid, sheetId, payload);
    }
    setLoading(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Kaydı düzenle" : "Yeni kayıt ekle"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-surface-2 p-1">
          <button
            type="button"
            onClick={() => switchType("income")}
            className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors cursor-pointer ${
              form.type === "income" ? "bg-gold text-ink" : "text-text-dim hover:text-text"
            }`}
          >
            <ArrowUpCircle size={15} /> Gelir
          </button>
          <button
            type="button"
            onClick={() => switchType("expense")}
            className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors cursor-pointer ${
              form.type === "expense" ? "bg-wine text-white" : "text-text-dim hover:text-text"
            }`}
          >
            <ArrowDownCircle size={15} /> Gider
          </button>
        </div>

        <Input
          label="Açıklama"
          placeholder="Örn. Migros market alışverişi"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          autoFocus
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Tutar (₺)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            required
          />
          <Input
            label="Tarih"
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            required
          />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-muted">
            Kategori
          </span>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/15"
          >
            {CATEGORIES[form.type].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <Input
          label="Not (opsiyonel)"
          placeholder="Ek bilgi..."
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
          icon={loading ? Loader2 : undefined}
        >
          {loading
            ? isEditing
              ? "Güncelleniyor..."
              : "Kaydediliyor..."
            : isEditing
            ? "Değişiklikleri Kaydet"
            : "Kaydı Ekle"}
        </Button>
      </form>
    </Modal>
  );
}