"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#0D0D0D] border-t border-[#27272A] py-8 px-4 mt-12 text-center text-zinc-400 text-xs">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
        <p className="text-xs text-zinc-400 font-medium">
          © 2026 Buteco do Papá. Todos os direitos reservados.
        </p>

        <p className="text-xs sm:text-sm font-bold text-[#F59E0B] tracking-wide">
          Desenvolvido por ZyonTech • Feito por Flávio Félix
        </p>

        <div className="pt-1">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-[#F59E0B] transition-colors font-medium"
          >
            <Lock size={12} />
            <span>Painel Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
