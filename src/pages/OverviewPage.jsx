import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSheetStore } from "../store/sheetStore";
import { TAB_COLOR_HEX, formatTRY, initialsOf } from "../utils/format";
import SummaryCards from "../components/dashboard/SummaryCards";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";

export default function OverviewPage({ onOpenSheet }) {
  const { sheets, entries } = useSheetStore();

  const allEntries = useMemo(
    () => sheets.flatMap((s) => entries[s.id] || []),
    [sheets, entries]
  );

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const e of allEntries) {
      if (e.type === "income") income += e.amount;
      else expense += e.amount;
    }
    return { income, expense };
  }, [allEntries]);

  const incomeByCategory = useMemo(() => groupByCategory(allEntries, "income"), [allEntries]);
  const expenseByCategory = useMemo(() => groupByCategory(allEntries, "expense"), [allEntries]);

  const sheetTotals = useMemo(() => {
    return sheets.map((s) => {
      const list = entries[s.id] || [];
      const income = list.filter((e) => e.type === "income").reduce((a, b) => a + b.amount, 0);
      const expense = list.filter((e) => e.type === "expense").reduce((a, b) => a + b.amount, 0);
      return { ...s, income, expense, net: income - expense, count: list.length };
    });
  }, [sheets, entries]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gold">Genel Bakış</p>
        <h1 className="mt-1 font-display text-3xl text-text">Tüm sayfaların özeti</h1>
        <p className="mt-1.5 text-sm text-text-muted">
          Tüm gelir ve giderlerinin toplu görünümü, burada.
        </p>
      </div>

      <SummaryCards income={totals.income} expense={totals.expense} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CategoryBreakdown title="Gelir Dağılımı" data={incomeByCategory} />
        <CategoryBreakdown title="Gider Dağılımı" data={expenseByCategory} />
      </div>

      <div>
        <h2 className="font-display text-lg text-text">Sayfalar</h2>
        {sheetTotals.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">
            Henüz bir sayfa oluşturmadın. Sol menüden yeni bir sayfa aç.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sheetTotals.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onOpenSheet(s.id)}
                className="group rounded-2xl border border-border bg-surface p-5 text-left transition-colors hover:border-gold/40 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-ink"
                    style={{ backgroundColor: TAB_COLOR_HEX[s.color] }}
                  >
                    {initialsOf(s.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-text">{s.name}</p>
                    <p className="text-xs text-text-muted">{s.count} kayıt</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-mono-num text-gold">+{formatTRY(s.income)}</span>
                  <span className="font-mono-num text-wine-soft">−{formatTRY(s.expense)}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full bg-gold"
                    style={{
                      width: `${
                        s.income + s.expense > 0 ? (s.income / (s.income + s.expense)) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function groupByCategory(entries, type) {
  const map = {};
  for (const e of entries) {
    if (e.type !== type) continue;
    map[e.category] = (map[e.category] || 0) + e.amount;
  }
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}
