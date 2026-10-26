"use client";

import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Formata o preço para o padrão de moeda brasileira (R$)
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(product.price));

  return (
    <article className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm hover:border-amber-500/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="font-bold text-base text-white truncate">
            {product.name}
          </h3>
          {product.isNovelty && (
            <span className="bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Novidade
            </span>
          )}
        </div>
        {product.description && (
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      <div className="text-right shrink-0">
        <span className="text-base font-extrabold text-[#F59E0B] tracking-tight">
          {formattedPrice}
        </span>
      </div>
    </article>
  );
}
