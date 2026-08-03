import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatTRY } from "../../utils/format";

const PALETTE = ["#D4A94A", "#C1495B", "#5B8AA6", "#8577AB", "#6FA787", "#C97B4A", "#E0B85C", "#8FA7B3"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-text">{d.name}</p>
      <p className="font-mono-num text-text-dim">{formatTRY(d.value)}</p>
    </div>
  );
}

export default function CategoryBreakdown({ title, data }) {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-text-muted">{title} için henüz veri yok.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="font-display text-base text-text">{title}</h3>
      <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
        <div className="h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 self-stretch">
          {data
            .sort((a, b) => b.value - a.value)
            .map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                />
                <span className="flex-1 truncate text-text-dim">{d.name}</span>
                <span className="font-mono-num text-xs text-text-muted">
                  {total ? Math.round((d.value / total) * 100) : 0}%
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
