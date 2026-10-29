"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const SPECIAL_CHARACTERS = "!@#&()-[{}]:;',\"?/*~$^+=<>._`|%";

type PasswordRule = {
  id: string;
  label: string;
  valid: boolean;
};

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const hasSpecialCharacter = Array.from(SPECIAL_CHARACTERS).some((char) =>
    password.includes(char)
  );

  const passwordRules: PasswordRule[] = [
    {
      id: "length",
      label: "No mínimo 8 caracteres",
      valid: password.length >= 8,
    },
    {
      id: "number",
      label: "Pelo menos um número",
      valid: /\d/.test(password),
    },
    {
      id: "lowercase",
      label: "Pelo menos uma letra minúscula",
      valid: /[a-z]/.test(password),
    },
    {
      id: "uppercase",
      label: "Pelo menos uma letra maiúscula",
      valid: /[A-Z]/.test(password),
    },
    {
      id: "special",
      label: `Pelo menos um caractere especial (${SPECIAL_CHARACTERS})`,
      valid: hasSpecialCharacter,
    },
  ];

  const validRulesCount = passwordRules.filter((rule) => rule.valid).length;
  const allRulesValid = validRulesCount === passwordRules.length;
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit = allRulesValid && passwordsMatch && !loading;

  const handleRequestReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erro ao solicitar recuperação de senha."
        );
      }

      if (data.resetToken) {
        setResetToken(data.resetToken);
        setStep(2);
        setMessage("E-mail verificado. Agora crie sua nova senha.");
      } else {
        setMessage(
          data.message ||
            "Se o e-mail existir, as instruções de recuperação foram enviadas."
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao processar solicitação.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token: resetToken,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir senha.");
      }

      setMessage(data.message || "Senha redefinida com sucesso!");
      setTimeout(() => router.push("/admin/login"), 2500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao processar solicitação.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setResetToken("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto bg-[#18181B] border border-[#27272A] rounded-2xl p-8 shadow-2xl">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-[#F59E0B] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Voltar para o Login
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#F59E0B] flex items-center justify-center bg-[#0D0D0D] mx-auto mb-4 shadow-lg">
            <span className="text-amber-500 font-extrabold text-xl tracking-wider">
              BP
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#F59E0B] tracking-wide uppercase">
            Buteco do Papá
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {step === 1 ? "Recuperar Senha" : "Redefinir Senha"}
          </p>
        </div>

        {/* Indicador de etapas */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                step === 1
                  ? "border-[#F59E0B] bg-[#F59E0B] text-black"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {step > 1 ? <Check size={14} strokeWidth={3} /> : "1"}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                step === 1 ? "text-[#F59E0B]" : "text-emerald-400"
              }`}
            >
              E-mail
            </span>
          </div>

          <div
            className={`h-px w-8 transition-colors ${
              step > 1 ? "bg-emerald-500/40" : "bg-[#27272A]"
            }`}
          />

          <div className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                step === 2
                  ? "border-[#F59E0B] bg-[#F59E0B] text-black"
                  : "border-[#27272A] bg-[#0D0D0D] text-zinc-500"
              }`}
            >
              2
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                step === 2 ? "text-[#F59E0B]" : "text-zinc-500"
              }`}
            >
              Nova senha
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-lg mb-6 text-center">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2"
              >
                E-mail Cadastrado
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-zinc-600"
                  placeholder="admin@buteco.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full mt-2 bg-[#F59E0B] hover:bg-[#d97706] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#F59E0B]"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Verificando...
                </>
              ) : (
                <>
                  Continuar <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Lock size={18} />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-3 pl-10 pr-11 text-white text-sm focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-zinc-600"
                  placeholder="Crie uma senha forte"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-[#F59E0B] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2"
              >
                Confirmação de Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Lock size={18} />
                </span>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  aria-invalid={
                    confirmPassword.length > 0 && !passwordsMatch
                      ? true
                      : undefined
                  }
                  className={`w-full bg-[#0D0D0D] border rounded-xl py-3 pl-10 pr-11 text-white text-sm focus:outline-none transition-colors placeholder:text-zinc-600 ${
                    confirmPassword.length > 0 && !passwordsMatch
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-[#27272A] focus:border-[#F59E0B]"
                  }`}
                  placeholder="Repita a nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar confirmação de senha"
                      : "Mostrar confirmação de senha"
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-[#F59E0B] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-red-400">
                  <AlertCircle size={12} /> As senhas não coincidem.
                </p>
              )}

              {passwordsMatch && (
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <CheckCircle2 size={12} /> As senhas coincidem.
                </p>
              )}
            </div>

            {/* Quadro de regras de segurança */}
            <div
              className={`rounded-xl border p-4 transition-colors ${
                allRulesValid
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-[#27272A] bg-[#0D0D0D]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    className={
                      allRulesValid ? "text-emerald-400" : "text-[#F59E0B]"
                    }
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Segurança da senha
                  </span>
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    allRulesValid ? "text-emerald-400" : "text-zinc-500"
                  }`}
                >
                  {validRulesCount}/{passwordRules.length}
                </span>
              </div>

              <div className="h-1 w-full rounded-full bg-[#27272A] mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    allRulesValid ? "bg-emerald-500" : "bg-[#F59E0B]"
                  }`}
                  style={{
                    width: `${(validRulesCount / passwordRules.length) * 100}%`,
                  }}
                />
              </div>

              <ul className="space-y-2">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.id}
                    className="flex items-start gap-2 text-xs"
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        rule.valid
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                          : "border-[#27272A] bg-[#18181B] text-zinc-500"
                      }`}
                    >
                      {rule.valid ? (
                        <Check size={12} strokeWidth={3} />
                      ) : (
                        <X size={12} strokeWidth={3} />
                      )}
                    </span>
                    <span
                      className={`transition-colors ${
                        rule.valid ? "text-emerald-400" : "text-zinc-500"
                      }`}
                    >
                      {rule.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full mt-2 bg-[#F59E0B] hover:bg-[#d97706] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#F59E0B]"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Redefinindo...
                </>
              ) : (
                <>
                  <KeyRound size={18} /> Redefinir minha senha
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBackToEmail}
              className="w-full text-center text-xs text-zinc-500 hover:text-[#F59E0B] transition-colors py-2"
            >
              Usar outro e-mail
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
