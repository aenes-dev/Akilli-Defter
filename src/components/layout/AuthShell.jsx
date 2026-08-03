import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function AuthShell({ children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
      {/* Left — brand panel */}
      <div className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between p-12 grain">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(700px 400px at 10% 10%, rgba(212,169,74,0.10), transparent 60%), radial-gradient(600px 500px at 90% 90%, rgba(91,138,166,0.10), transparent 60%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
            <BookOpen size={18} />
          </div>
          <span className="font-display text-xl tracking-tight text-paper">Defter</span>
        </motion.div>

        <div className="relative max-w-md">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display text-4xl leading-[1.15] text-paper"
          >
            Her kuruşun kaydı,{" "}
            <span className="text-gold">kendi sayfasında.</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-sm leading-relaxed text-text-dim"
          >
            Gelirlerini ve giderlerini kişi ya da kategori bazında ayrı sayfalarda
            tut, toplamları tek bakışta gör.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex gap-2"
          >
            {["gold", "wine", "slate", "sage"].map((c, i) => (
              <span
                key={c}
                className="h-1.5 w-10 rounded-full"
                style={{
                  backgroundColor: `var(--color-${c})`,
                  opacity: 0.8 - i * 0.12,
                }}
              />
            ))}
          </motion.div>
        </div>

        <p className="relative text-xs text-text-muted">
          © {new Date().getFullYear()} Defter — kişisel gelir gider defteri
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center bg-bg px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
              <BookOpen size={18} />
            </div>
            <span className="font-display text-xl tracking-tight text-text">Defter</span>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
