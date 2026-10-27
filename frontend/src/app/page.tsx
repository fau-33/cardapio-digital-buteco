"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types";
import { apiFetch } from "@/lib/apiFetch";
import { Header } from "@/components/menu/Header";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { ProductCard } from "@/components/menu/ProductCard";
import { CategoryTabsSkeleton } from "@/components/menu/CategoryTabsSkeleton";
import { MenuSkeletonList } from "@/components/menu/ProductSkeleton";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiFetch<Category[]>("/categories/menu");
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategoryId(data[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white pb-12">
      <Header />

      {loading ? (
        <>
          <CategoryTabsSkeleton />
          <MenuSkeletonList />
        </>
      ) : (
        <>
          <CategoryTabs
            categories={categories}
            selectedCategoryId={selectedCategoryId}
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
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
