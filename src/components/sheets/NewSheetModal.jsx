import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuthStore } from "../../store/authStore";
import { useSheetStore, TAB_COLORS } from "../../store/sheetStore";
import { TAB_COLOR_HEX } from "../../utils/format";
import { Check, Loader2 } from "lucide-react";

export default function NewSheetModal({ open, onClose }) {
  const { user } = useAuthStore();
  const { addSheet } = useSheetStore();
  const [name, setName] = useState("");
  const [color, setColor] = useState(TAB_COLORS[0]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await addSheet(user.uid, { name: name.trim(), color });
    setLoading(false);
    setName("");
    setColor(TAB_COLORS[0]);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Yeni sayfa oluştur">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Sayfa adı"
          placeholder="Örn. Ev Giderleri, Market..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
        <div>
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-text-muted">
            Sekme rengi
          </span>
          <div className="flex flex-wrap gap-2.5">
            {TAB_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-105 cursor-pointer"
                style={{ backgroundColor: TAB_COLOR_HEX[c] }}
              >
                {color === c && <Check size={16} className="text-ink" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
          icon={loading ? Loader2 : undefined}
        >
          {loading ? "Oluşturuluyor..." : "Sayfayı Oluştur"}
        </Button>
      </form>
    </Modal>
  );
}
