"use client";

import { useState } from "react";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erro ao solicitar recuperação de senha"
        );
      }

      setMessage(
        "Instruções de recuperação enviadas com sucesso (verifique o console/backend se em ambiente de testes)."
      );
    } catch (err: any) {
      setError(err.message || "Erro ao processar solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto bg-[#18181B] border border-[#27272A] rounded-2xl p-8 shadow-2xl relative">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-[#F59E0B] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Voltar para o Login
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#F59E0B] tracking-wide uppercase">
            Buteco do Papá
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Recuperar Senha</p>
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

        <form onSubmit={handleForgot} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              E-mail Cadastrado
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
                className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#F59E0B] transition-colors"
                placeholder="admin@buteco.com"
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
                <Loader2 size={18} className="animate-spin" /> Enviando...
              </>
            ) : (
              "Enviar Instruções"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
