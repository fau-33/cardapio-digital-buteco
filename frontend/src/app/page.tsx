"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Category } from "@/types";
import { Header } from "@/components/menu/Header";
import { CategoryTabs } from "@/components/menu/CategoryTabs";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await apiFetch<Category[]>("/categories/menu");
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategoryId(data[0].id);
        }
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
      {/* Cabeçalho Rústico */}
      <Header />

      {/* Barra de Categorias */}
      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Conteúdo Principal */}
      <main className="p-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="p-6 text-center text-amber-500 animate-pulse font-medium">
            Carregando cardápio...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            Nenhuma categoria ou produto cadastrado no momento.
          </div>
        ) : (
          <p className="text-xs text-zinc-500 text-center">
            {categories.length} categoria(s) pronta(s) para exibição
          </p>
        )}
      </main>
    </div>
  );
}
