import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatTRY } from "../../utils/format";

const cards = [
  {
    key: "income",
    label: "Toplam Gelir",
    icon: TrendingUp,
    color: "var(--color-gold)",
    bg: "bg-gold/10",
    border: "border-gold/25",
  },
  {
    key: "expense",
    label: "Toplam Gider",
    icon: TrendingDown,
    color: "var(--color-wine)",
    bg: "bg-wine/10",
    border: "border-wine/25",
  },
  {
    key: "net",
    label: "Net Bakiye",
    icon: Wallet,
    color: "var(--color-slate)",
    bg: "bg-slate/10",
    border: "border-slate/25",
  },
];

export default function SummaryCards({ income, expense }) {
  const net = income - expense;
  const values = { income, expense, net };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35 }}
          className={`relative overflow-hidden rounded-2xl border ${c.border} ${c.bg} p-5`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {c.label}
            </span>
            <c.icon size={16} style={{ color: c.color }} />
          </div>
          <p
            className="mt-3 font-mono-num text-2xl font-semibold"
            style={{ color: c.key === "net" && net < 0 ? "var(--color-wine)" : c.color }}
          >
            {formatTRY(values[c.key])}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
