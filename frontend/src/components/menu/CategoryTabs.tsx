"use client";

import { Category } from "@/types";

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}

export function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryTabsProps) {
  if (categories.length === 0) return null;

  return (
    <nav className="w-full overflow-x-auto py-4 px-4 no-scrollbar border-b border-[#27272A] bg-[#0D0D0D]/80 backdrop-blur sticky top-0 z-20">
      <div className="flex items-center gap-2 max-w-2xl mx-auto">
        {categories.map((category) => {
          const isActive = selectedCategoryId === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-[#F59E0B] text-black shadow-md shadow-amber-500/20 scale-105"
                  : "bg-[#18181B] text-zinc-400 hover:text-white hover:bg-[#27272A] border border-[#27272A]"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
