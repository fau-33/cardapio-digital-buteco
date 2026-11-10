"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Loader2,
  ArrowLeft,
  AlertTriangle,
  Code2,
} from "lucide-react";
import Link from "next/link";
import { API_URL, warmUpApi } from "@/lib/api";
import { validateRealEmail } from "@/lib/emailValidation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [oauthNotice, setOauthNotice] = useState("");

  useEffect(() => {
    warmUpApi();

    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");

    if (errorParam === "google_not_configured") {
      setOauthNotice(
        "O login com Google ainda não foi configurado nas variáveis do servidor (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET). Utilize seu e-mail e senha abaixo para acessar o painel."
      );
      window.history.replaceState({}, "", "/admin/login");
    } else if (errorParam === "google_auth_failed") {
      setError(
        "Não foi possível concluir a autenticação com o Google. Verifique se seu e-mail possui permissão de administrador ou acesse com e-mail e senha."
      );
      window.history.replaceState({}, "", "/admin/login");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOauthNotice("");

    const emailCheck = validateRealEmail(email);
    if (!emailCheck.valid) {
      setError(emailCheck.error!);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailCheck.normalizedEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      localStorage.setItem("admin_token", data.accessToken);
      if (data.admin) {
        localStorage.setItem("admin_user", JSON.stringify(data.admin));
      }

      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Credenciais inválidas. Verifique seu e-mail e senha.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    setOauthNotice("");
    window.location.assign(`${API_URL}/auth/google`);
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto bg-[#18181B] border border-[#27272A] rounded-2xl p-8 shadow-2xl relative">
        {/* Voltar para o Cardápio */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-[#F59E0B] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Voltar para o Cardápio
        </Link>

        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-buteco.png"
            alt="Logo Buteco do Papá"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-contain mx-auto mb-3 shadow-md"
          />
          <h1 className="text-2xl font-black text-[#F59E0B] tracking-wide uppercase">
            Buteco do Papá
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Painel Administrativo</p>
        </div>

        {oauthNotice && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs p-3.5 rounded-xl mb-6 flex items-start gap-2.5 leading-relaxed">
            <AlertTriangle
              size={16}
              className="text-[#F59E0B] shrink-0 mt-0.5"
            />
            <span>{oauthNotice}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* 1. Botão de Login com Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-[#27272A] hover:bg-[#3F3F46] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl border border-[#3F3F46] transition-all flex items-center justify-center gap-3 mb-6 active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
          Continuar com Google
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-[#27272A] w-full"></div>
          <span className="bg-[#18181B] px-3 text-[10px] text-zinc-500 uppercase tracking-wider font-bold absolute">
            ou com e-mail
          </span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              E-mail de Acesso
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#F59E0B] transition-colors"
                placeholder="seuemail@gmail.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Senha
              </label>

              {/* 2. Link de Esqueceu a Senha */}
              <Link
                href="/admin/forgot-password"
                className="text-[11px] text-[#F59E0B] hover:underline font-semibold transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#F59E0B] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#F59E0B] hover:bg-[#d9822b] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Entrando...
              </>
            ) : (
              "Acessar Painel"
            )}
          </button>
        </form>

        {/* Link claro para Cadastro + Atalho Discreto do Desenvolvedor */}
        <div className="mt-6 pt-5 border-t border-[#27272A]/60 text-center space-y-3">
          <p className="text-xs text-zinc-400">
            Não tem conta?{" "}
            <Link
              href="/admin/register"
              className="text-[#F59E0B] hover:underline font-extrabold transition-colors"
            >
              Cadastre-se
            </Link>
          </p>

          <div className="pt-1">
            <Link
              href="/admin/dev"
              className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
              title="Acesso exclusivo ZyonTech / Desenvolvedor"
            >
              <Code2 size={12} />
              <span>ZyonTech Dev Tools</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
