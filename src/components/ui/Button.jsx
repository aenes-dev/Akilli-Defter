import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-gold text-ink font-semibold hover:bg-gold-soft shadow-[0_1px_0_rgba(0,0,0,0.2)]",
  ghost:
    "bg-transparent text-text-dim hover:text-text hover:bg-surface-2 border border-transparent",
  outline:
    "bg-transparent text-text border border-border hover:border-gold/50 hover:text-gold",
  danger: "bg-wine/90 text-white hover:bg-wine",
  subtle: "bg-surface-2 text-text-dim hover:bg-surface-3 hover:text-text",
};

const sizes = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-6 py-3 gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  disabled,
  type = "button",
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={2.2} />}
      {children}
    </motion.button>
  );
}
