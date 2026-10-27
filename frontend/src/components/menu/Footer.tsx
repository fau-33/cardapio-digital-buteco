"use client";

import Link from "next/link";
import { ShieldCheck, Lock, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#0D0D0D] border-t border-[#27272A] py-8 px-4 mt-12 text-center text-zinc-500 text-xs">
      <div className="max-w-3xl mx-auto space-y-4">
        <p className="font-bold text-zinc-400">
          Buteco do Papá — Cardápio Digital Oficial
        </p>

        <p className="max-w-md mx-auto text-[11px] leading-relaxed">
          Sistema protegido e em conformidade com as diretrizes de segurança da
          informação e LGPD. Apenas exibição de valores e itens.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-zinc-600">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Dados Seguros (Neon DB + SSL)</span>
          </div>

          <span className="text-zinc-700">•</span>

          {/* Botão de Dev */}
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-[#F59E0B] transition-colors bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] px-3 py-1.5 rounded-lg font-medium"
            title="Acesso Restrito a Desenvolvedores e Administradores"
          >
            <Code2 size={14} className="text-[#F59E0B]" />
            <span>Área Dev / Admin</span>
          </Link>
        </div>

        <p className="text-[10px] text-zinc-600 pt-4">
          © {new Date().getFullYear()} Buteco do Papá. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
