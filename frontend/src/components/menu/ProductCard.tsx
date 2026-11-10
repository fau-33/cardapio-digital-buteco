"use client";

import { useState } from "react";
import { Product } from "@/types";
import {
  getFallbackProductImageUrl,
  getProductImageUrl,
} from "@/lib/productImage";

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(product.price));

  const primaryUrl = getProductImageUrl(product, categoryName);
  const fallbackUrl = getFallbackProductImageUrl(product.name, categoryName);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const imageSrc = failedUrl === primaryUrl ? fallbackUrl : primaryUrl;

  return (
    <article
      className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm hover:border-amber-500/50 transition-colors"
      aria-label={`${product.name}, preço ${formattedPrice}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="font-bold text-base text-white truncate">
            {product.name}
          </h3>
          {product.isNovelty && (
            <span className="bg-red-600/25 text-red-400 border border-red-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
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

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <span className="text-base font-extrabold text-[#F59E0B] tracking-tight">
            {formattedPrice}
          </span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={`Imagem ilustrativa de ${product.name}`}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (imageSrc !== fallbackUrl) {
              setFailedUrl(primaryUrl);
            }
          }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0 border border-amber-500/25 bg-[#0D0D0D] shadow-sm"
        />
      </div>
    </article>
  );
}
