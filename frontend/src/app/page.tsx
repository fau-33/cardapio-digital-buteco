"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Category } from "@/types";
import { Header } from "@/components/menu/Header";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { ProductCard } from "@/components/menu/ProductCard";

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

  const currentCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-12">
      {/* Cabeçalho Rústico */}
      <Header />

      {/* Barra de Categorias */}
      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Lista de Produtos */}
      <main className="p-4 max-w-2xl mx-auto space-y-3">
        {loading ? (
          <div className="p-8 text-center text-amber-500 animate-pulse font-medium">
            Carregando cardápio...
          </div>
        ) : !currentCategory ||
          !currentCategory.products ||
          currentCategory.products.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            Nenhum produto disponível nesta categoria no momento.
          </div>
        ) : (
          currentCategory.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </main>
    </div>
  );
}
