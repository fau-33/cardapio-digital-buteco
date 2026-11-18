"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Product } from "@/types";
import {
  getFallbackProductImageUrl,
  getHighResProductImageUrl,
  getProductImageAlt,
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
  const highResImageSrc = getHighResProductImageUrl(imageSrc);
  const imageAlt = getProductImageAlt(product, categoryName);

  const [isModalMounted, setIsModalMounted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExtraZoomed, setIsExtraZoomed] = useState(false);

  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const uniqueId = useId();
  const modalTitleId = `lightbox-title-${uniqueId}`;
  const modalDescId = `lightbox-desc-${uniqueId}`;

  const handleOpenModal = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsExtraZoomed(false);
    setIsModalMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsModalVisible(true);
      });
    });
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setIsExtraZoomed(false);
    closeTimeoutRef.current = setTimeout(() => {
      setIsModalMounted(false);
      triggerButtonRef.current?.focus();
    }, 250);
  };

  useEffect(() => {
    if (!isModalMounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalMounted]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <article
        className="w-full max-w-full overflow-hidden bg-[#18181B] border border-[#27272A] rounded-xl p-3 sm:p-4 flex items-center justify-between gap-2.5 sm:gap-4 shadow-sm hover:border-amber-500/50 transition-colors"
        aria-label={`${product.name}${product.isNovelty ? ", novidade" : ""}, preço ${formattedPrice}. ${imageAlt}`}
      >
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-start sm:items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-sm sm:text-base text-white leading-snug break-words line-clamp-2">
              {product.name}
            </h3>
            {product.isNovelty && (
              <span
                className="bg-red-600/25 text-red-400 border border-red-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm shrink-0"
                aria-label="Item em destaque como novidade"
              >
                Novidade
              </span>
            )}
          </div>
          {product.description && (
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed break-words">
              {product.description}
            </p>
          )}
          <span className="sr-only">{imageAlt}</span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <div className="text-right shrink-0">
            <span
              className="text-sm sm:text-base font-extrabold text-[#F59E0B] tracking-tight whitespace-nowrap"
              aria-label={`Preço: ${formattedPrice}`}
            >
              {formattedPrice}
            </span>
          </div>

          <button
            ref={triggerButtonRef}
            type="button"
            onClick={handleOpenModal}
            aria-label={`Ampliar foto de ${product.name}: ${imageAlt}`}
            aria-haspopup="dialog"
            aria-expanded={isModalMounted}
            title={`Clique para ampliar a foto de ${product.name}`}
            className="group relative w-24 h-16 sm:w-28 sm:h-[73px] min-w-[96px] min-h-[64px] sm:min-w-[112px] sm:min-h-[73px] aspect-[800/520] rounded-lg overflow-hidden shrink-0 border border-amber-500/25 hover:border-[#F59E0B] bg-white shadow-sm cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B] transition-all duration-200 flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={imageAlt}
              width={800}
              height={520}
              loading="lazy"
              decoding="async"
              onError={() => {
                if (imageSrc !== fallbackUrl) {
                  setFailedUrl(primaryUrl);
                }
              }}
              className="w-full h-full object-contain p-0.5 block transition-opacity duration-200"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex items-center justify-center"
            >
              <ZoomIn size={16} className="text-[#F59E0B] drop-shadow" />
            </span>
          </button>
        </div>
      </article>

      {isModalMounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            aria-describedby={modalDescId}
            onClick={handleCloseModal}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300 ease-out ${
              isModalVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-lg bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl shadow-black/90 transition-all duration-300 ease-out transform ${
                isModalVisible
                  ? "scale-100 opacity-100 translate-y-0"
                  : "scale-90 opacity-0 translate-y-3"
              }`}
            >
              {/* Barra Superior com Botões de Zoom Extra e Fechar */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExtraZoomed((prev) => !prev)}
                  aria-label={
                    isExtraZoomed
                      ? `Reduzir zoom da foto de ${product.name}`
                      : `Aplicar super zoom na foto de ${product.name}`
                  }
                  aria-pressed={isExtraZoomed}
                  title={isExtraZoomed ? "Reduzir zoom" : "Mais zoom"}
                  className="bg-[#0D0D0D]/85 hover:bg-[#27272A] text-zinc-200 hover:text-[#F59E0B] border border-[#27272A] p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
                >
                  {isExtraZoomed ? (
                    <ZoomOut size={18} aria-hidden="true" />
                  ) : (
                    <ZoomIn size={18} aria-hidden="true" />
                  )}
                </button>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={handleCloseModal}
                  aria-label={`Fechar visualização ampliada de ${product.name}`}
                  title="Fechar (Esc)"
                  className="bg-[#0D0D0D]/85 hover:bg-[#F59E0B] text-white hover:text-black border border-[#27272A] hover:border-[#F59E0B] p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Área da Imagem Ampliada com Zoom Suave */}
              <div
                onClick={() => setIsExtraZoomed((prev) => !prev)}
                className={`relative w-full min-h-[220px] sm:min-h-[280px] aspect-[800/520] bg-white flex items-center justify-center overflow-hidden select-none ${
                  isExtraZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={highResImageSrc}
                  alt={imageAlt}
                  width={800}
                  height={520}
                  decoding="async"
                  onError={() => {
                    if (imageSrc !== fallbackUrl) {
                      setFailedUrl(primaryUrl);
                    }
                  }}
                  className={`w-full h-full max-h-[65vh] sm:max-h-[70vh] object-contain p-1 block transition-transform duration-500 ease-out ${
                    isExtraZoomed ? "scale-150" : "scale-100"
                  }`}
                />
              </div>

              {/* Rodapé Descritivo e Acessível do Modal */}
              <div className="p-4 sm:p-5 bg-[#18181B] border-t border-[#27272A] flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      id={modalTitleId}
                      className="font-extrabold text-lg text-white leading-snug"
                    >
                      {product.name}
                    </h3>
                    {product.isNovelty && (
                      <span className="bg-red-600/25 text-red-400 border border-red-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Novidade
                      </span>
                    )}
                  </div>
                  <span className="text-lg font-extrabold text-[#F59E0B] shrink-0">
                    {formattedPrice}
                  </span>
                </div>

                <p
                  id={modalDescId}
                  className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                >
                  {imageAlt}
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
