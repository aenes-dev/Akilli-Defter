import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, Loader2, AlertCircle } from "lucide-react";
import AuthShell from "../components/layout/AuthShell";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, authLoading, authError, clearError } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    const ok = await register(name, email, password);
    if (ok) navigate("/");
  }

  return (
    <AuthShell>
      <h1 className="font-display text-3xl text-text">Defterini oluştur</h1>
      <p className="mt-2 text-sm text-text-muted">
        Birkaç saniyede hesabını aç, kayda başla.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          label="Ad Soyad"
          type="text"
          icon={User}
          placeholder="Adın Soyadın"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          placeholder="En az 6 karakter"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
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
          icon={authLoading ? Loader2 : UserPlus}
        >
          {authLoading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Zaten hesabın var mı?{" "}
        <Link to="/login" className="font-medium text-gold hover:text-gold-soft">
          Giriş yap
        </Link>
      </p>
    </AuthShell>
  );
}
