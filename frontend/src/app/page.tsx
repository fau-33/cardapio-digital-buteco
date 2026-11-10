"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types";
import { apiFetch, warmUpApi } from "@/lib/apiFetch";
import {
  INITIAL_MENU_CATEGORIES,
  getCachedMenu,
  saveMenuToCache,
} from "@/lib/menuCache";
import { Header } from "@/components/menu/Header";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { ProductCard } from "@/components/menu/ProductCard";
import { Footer } from "@/components/menu/Footer";

function resolveSelectedCategoryId(
  nextCategories: Category[],
  prevCategories: Category[],
  prevSelectedId: string | null
): string | null {
  if (nextCategories.length === 0) return null;
  if (!prevSelectedId) return nextCategories[0].id;

  const byExactId = nextCategories.find((c) => c.id === prevSelectedId);
  if (byExactId) return byExactId.id;

  const prevSelected = prevCategories.find((c) => c.id === prevSelectedId);
  if (prevSelected) {
    const normalizedPrevName = prevSelected.name.trim().toLowerCase();
    const byName = nextCategories.find(
      (c) => c.name.trim().toLowerCase() === normalizedPrevName
    );
    if (byName) return byName.id;
  }

  return nextCategories[0].id;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>(
    INITIAL_MENU_CATEGORIES
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    INITIAL_MENU_CATEGORIES[0]?.id ?? null
  );

  useEffect(() => {
    // 1. Dispara warm-up silencioso na raiz da API
    warmUpApi();

    // 2. Carrega imediatamente a última versão salva no localStorage (Stale)
    const cached = getCachedMenu();
    if (cached && cached.length > 0) {
      setCategories((prev) => {
        setSelectedCategoryId((prevId) =>
          resolveSelectedCategoryId(cached, prev, prevId)
        );
        return cached;
      });
    }

    // 3. Revalida em background no backend (While-Revalidate) sem travar a tela
    let cancelled = false;
    async function revalidateMenu() {
      try {
        const freshData = await apiFetch<Category[]>("/categories/menu");
        if (cancelled) return;
        if (Array.isArray(freshData) && freshData.length > 0) {
          saveMenuToCache(freshData);
          setCategories((prev) => {
            setSelectedCategoryId((prevId) =>
              resolveSelectedCategoryId(freshData, prev, prevId)
            );
            return freshData;
          });
        }
      } catch {
        // Mantém o cardápio instantâneo (cache/fallback) visível sem erro para o cliente
      }
    }

    revalidateMenu();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCategory =
    categories.find((c) => c.id === selectedCategoryId) ?? categories[0];

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-between pb-0">
      <div>
        <Header />

        <CategoryTabs
          categories={categories}
          selectedCategoryId={selectedCategory?.id ?? selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        <section className="max-w-3xl mx-auto px-4 py-6">
          {selectedCategory && (
            <div>
              <h2 className="text-xl font-extrabold text-[#F59E0B] mb-4 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-[#F59E0B] rounded-full inline-block"></span>
                {selectedCategory.name}
              </h2>

              <div className="grid gap-3">
                {(selectedCategory.products ?? []).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={selectedCategory.name}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
