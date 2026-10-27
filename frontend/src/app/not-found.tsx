import Link from "next/link";
import { Beer, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full bg-[#18181B] border border-[#27272A] rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] rounded-2xl flex items-center justify-center mx-auto">
          <Beer size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-[#F59E0B]">404</h1>
          <h2 className="text-xl font-bold">
            Ops! Mesa ou página não encontrada
          </h2>
          <p className="text-sm text-zinc-400">
            Parece que você pediu um petisco que não existe no cardápio ou o
            link está incorreto.
          </p>
        </div>

        <Link
          href="/"
          className="w-full bg-[#F59E0B] hover:bg-[#d9822b] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
        >
          <Home size={18} /> Voltar para o Cardápio Principal
        </Link>
      </div>
    </main>
  );
}
