export function formatTRY(amount) {
  const n = Number(amount) || 0;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export const TAB_COLOR_HEX = {
  gold: "#D4A94A",
  wine: "#C1495B",
  slate: "#5B8AA6",
  violet: "#8577AB",
  sage: "#6FA787",
  clay: "#C97B4A",
};

export function initialsOf(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}
