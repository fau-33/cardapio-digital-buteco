"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Hash, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir senha.");
      }

      setMessage(data.message || "Senha redefinida com sucesso!");
      setTimeout(() => router.push("/admin/login"), 2500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao processar solicitação.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto bg-[#18181B] border border-[#27272A] rounded-2xl p-8 shadow-2xl">
        <Link
          href="/admin/forgot-password"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-[#F59E0B] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Voltar
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
          <p className="text-sm text-zinc-400 mt-1">Redefinir Senha</p>
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

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              E-mail
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Token de Recuperação
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <Hash size={18} />
              </span>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-zinc-600 font-mono"
                placeholder="Cole o token recebido aqui"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-zinc-600"
                placeholder="Nova senha (mín. 6 chars, 1 maiúscula)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#F59E0B] hover:bg-[#d97706] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Redefinindo...
              </>
            ) : (
              "Redefinir Senha"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
