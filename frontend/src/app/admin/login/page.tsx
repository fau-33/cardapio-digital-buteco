"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@buteco.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      // Salva token e dados do admin no localStorage
      localStorage.setItem("admin_token", data.accessToken);
      localStorage.setItem("admin_user", JSON.stringify(data.admin));

      // Redireciona para o painel administrativo
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

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto bg-[#18181B] border border-[#27272A] rounded-2xl p-8 shadow-2xl">
        {/* Voltar para o cardápio */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-[#F59E0B] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Voltar para o Cardápio
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo / Ícone */}
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#F59E0B] flex items-center justify-center bg-[#0D0D0D] mx-auto mb-4 shadow-lg">
            <span className="text-amber-500 font-extrabold text-xl tracking-wider">
              BP
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#F59E0B] tracking-wide uppercase">
            Buteco do Papá
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Painel Administrativo</p>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* E-mail */}
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
                className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-zinc-600"
                placeholder="admin@buteco.com"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Senha
            </label>
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
                className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-zinc-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#F59E0B] hover:bg-[#d97706] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Entrando...
              </>
            ) : (
              "Acessar Painel"
            )}
          </button>
        </form>

        {/* Rodapé */}
        <p className="text-center text-zinc-600 text-xs mt-6">
          Acesso exclusivo para administradores
        </p>
      </div>
    </main>
  );
}
