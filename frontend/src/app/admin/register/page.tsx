"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { API_URL, warmUpApi } from "@/lib/api";
import { validateRealEmail } from "@/lib/emailValidation";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    warmUpApi();
  }, []);

  const handleGoogleAuth = () => {
    setError("");
    window.location.assign(`${API_URL}/auth/google`);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailCheck = validateRealEmail(email);
    if (!emailCheck.valid) {
      setError(emailCheck.error!);
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = emailCheck.normalizedEmail;
      const defaultName = normalizedEmail.split("@")[0];

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "Erro ao registrar administrador";
        throw new Error(errMessage);
      }

      // Se o backend já retornou accessToken no registro, salva imediatamente
      if (data.accessToken) {
        localStorage.setItem("admin_token", data.accessToken);
        localStorage.setItem(
          "admin_user",
          JSON.stringify(
            data.admin || {
              id: data.id,
              name: data.name || defaultName,
              email: data.email || normalizedEmail,
            }
          )
        );
        router.push("/admin/dashboard");
        return;
      }

      // Caso contrário, autentica imediatamente via /auth/login para obter o JWT
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const loginData = await loginResponse.json();
      if (!loginResponse.ok || !loginData.accessToken) {
        router.push("/admin/login");
        return;
      }

      localStorage.setItem("admin_token", loginData.accessToken);
      if (loginData.admin) {
        localStorage.setItem("admin_user", JSON.stringify(loginData.admin));
      }
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao realizar cadastro.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto bg-[#18181B] border border-[#27272A] rounded-2xl p-8 shadow-2xl relative">
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
          <p className="text-sm text-zinc-400 mt-1">
            Criar Conta de Administrador
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Botão de Continuar com Google */}
        <button
          type="button"
          onClick={handleGoogleAuth}
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

        <form onSubmit={handleRegister} className="space-y-4">
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
                className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#F59E0B] transition-colors"
                placeholder="seuemail@gmail.com"
              />
            </div>
          </div>

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
                minLength={6}
                autoComplete="new-password"
                className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#F59E0B] transition-colors"
                placeholder="Mín. 6 caracteres (maiúscula e minúscula)"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">
              Use pelo menos 6 caracteres, incluindo letra maiúscula e minúscula.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#F59E0B] hover:bg-[#d9822b] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Cadastrando...
              </>
            ) : (
              "Cadastrar e Acessar Painel"
            )}
          </button>
        </form>

        {/* Link claro para Login */}
        <div className="mt-6 pt-5 border-t border-[#27272A]/60 text-center">
          <p className="text-xs text-zinc-400">
            Já tem conta?{" "}
            <Link
              href="/admin/login"
              className="text-[#F59E0B] hover:underline font-extrabold transition-colors"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
