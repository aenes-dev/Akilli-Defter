import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function Spinner({ fullscreen }) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold"
      >
        <BookOpen size={18} />
      </motion.div>
      <span className="text-xs text-text-muted">Yükleniyor...</span>
    </div>
  );

  if (fullscreen) {
    return <div className="flex min-h-screen items-center justify-center bg-bg">{content}</div>;
  }
  return content;
}
