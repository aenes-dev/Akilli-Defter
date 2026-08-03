import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Loader2, AlertCircle } from "lucide-react";
import AuthShell from "../components/layout/AuthShell";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, authLoading, authError, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    const ok = await login(email, password);
    if (ok) navigate("/");
  }

  return (
    <AuthShell>
      <h1 className="font-display text-3xl text-text">Tekrar hoş geldin</h1>
      <p className="mt-2 text-sm text-text-muted">
        Defterine devam etmek için giriş yap.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          label="E-posta"
          type="email"
          icon={Mail}
          placeholder="ornek@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Şifre"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 rounded-lg border border-wine/30 bg-wine/10 px-3 py-2.5 text-sm text-wine-soft"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {authError}
          </motion.div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={authLoading}
          icon={authLoading ? Loader2 : LogIn}
        >
          {authLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Hesabın yok mu?{" "}
        <Link to="/register" className="font-medium text-gold hover:text-gold-soft">
          Hemen oluştur
        </Link>
      </p>
    </AuthShell>
  );
}
