export default function Input({ label, error, icon: Icon, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium tracking-wide text-text-muted uppercase">
          {label}
        </span>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
        )}
        <input
          className={`w-full rounded-lg border border-border bg-surface-2 py-2.5 text-sm text-text placeholder:text-text-muted/70 outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/15 ${
            Icon ? "pl-9 pr-3" : "px-3"
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="mt-1 block text-xs text-wine-soft">{error}</span>}
    </label>
  );
}
