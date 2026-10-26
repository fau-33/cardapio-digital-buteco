"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Category } from "@/types";
import { Header } from "@/components/menu/Header";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await apiFetch<Category[]>("/categories/menu");
        setCategories(data);
      } catch (error) {
        console.error("Erro ao carregar o cardápio:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Cabeçalho Rústico do Figma */}
      <Header />

      {/* Conteúdo Principal */}
      <main className="p-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="p-6 text-center text-amber-500 animate-pulse font-medium">
            Carregando cardápio...
          </div>
        ) : (
          <p className="text-xs text-zinc-500 text-center">
            {categories.length} categoria(s) carregada(s)
          </p>
        )}
      </main>
    </div>
  );
}
