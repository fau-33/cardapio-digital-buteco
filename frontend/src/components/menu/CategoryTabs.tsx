"use client";

import { Category } from "@/types";
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  // Centraliza a pílula ativa automaticamente
  useEffect(() => {
    if (scrollRef.current && selectedCategoryId) {
      const activeEl = scrollRef.current.querySelector(
        `[data-category-id="${selectedCategoryId}"]`
      ) as HTMLElement;
      if (activeEl) {
        const containerWidth = scrollRef.current.clientWidth;
        const elLeft = activeEl.offsetLeft;
        const elWidth = activeEl.clientWidth;
        scrollRef.current.scrollTo({
          left: elLeft - containerWidth / 2 + elWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [selectedCategoryId]);

  const scrollByAmount = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handlePrevCategory = () => {
    const currentIndex = categories.findIndex(
      (c) => c.id === selectedCategoryId
    );
    if (currentIndex > 0) {
      onSelectCategory(categories[currentIndex - 1].id);
    }
  };

  const handleNextCategory = () => {
    const currentIndex = categories.findIndex(
      (c) => c.id === selectedCategoryId
    );
    if (currentIndex < categories.length - 1 && currentIndex !== -1) {
      onSelectCategory(categories[currentIndex + 1].id);
    }
  };

  // Handlers para arrastar com o mouse com prevenção de conflito com cliques
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = x - startX;
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (categories.length === 0) return null;

  return (
    <div
      className="w-full bg-[#0D0D0D]/90 backdrop-blur sticky top-0 z-20 border-b border-[#27272A]"
      role="region"
      aria-label="Categorias do cardápio"
    >
      <div className="max-w-3xl mx-auto relative flex items-center px-2">
        {/* Seta Esquerda */}
        {showLeftArrow && (
          <button
            onClick={() => {
              scrollByAmount(-200);
              handlePrevCategory();
            }}
            className="absolute left-1 z-10 bg-[#18181B]/90 hover:bg-[#27272A] text-amber-500 border border-[#27272A] p-2 rounded-full shadow-lg transition-all hidden md:flex items-center justify-center backdrop-blur"
            aria-label="Categoria anterior"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* Lista de Categorias com Rolagem Suave e Touch/Mouse Drag */}
        <nav
          ref={scrollRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full overflow-x-auto py-4 px-3 no-scrollbar flex items-center gap-2 select-none cursor-grab active:cursor-grabbing scroll-smooth"
        >
          {categories.map((category) => {
            const isActive = selectedCategoryId === category.id;

            return (
              <button
                key={category.id}
                data-category-id={category.id}
                onClick={(e) => {
                  if (hasMoved) {
                    e.preventDefault();
                    return;
                  }
                  onSelectCategory(category.id);
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-[#F59E0B] text-black shadow-md shadow-amber-500/20 scale-105 font-extrabold"
                    : "bg-[#18181B] text-zinc-400 hover:text-white hover:bg-[#27272A] border border-[#27272A]"
                }`}
                aria-pressed={isActive}
              >
                {category.name}
              </button>
            );
          })}
        </nav>

        {/* Seta Direita */}
        {showRightArrow && (
          <button
            onClick={() => {
              scrollByAmount(200);
              handleNextCategory();
            }}
            className="absolute right-1 z-10 bg-[#18181B]/90 hover:bg-[#27272A] text-amber-500 border border-[#27272A] p-2 rounded-full shadow-lg transition-all hidden md:flex items-center justify-center backdrop-blur"
            aria-label="Próxima categoria"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
