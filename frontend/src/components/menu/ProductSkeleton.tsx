"use client";

export function ProductSkeleton() {
  return (
    <div className="w-full max-w-full overflow-hidden bg-[#18181B] border border-[#27272A] rounded-xl p-3 sm:p-4 flex items-center justify-between gap-2.5 sm:gap-4 animate-pulse">
      <div className="flex-1 min-w-0 space-y-2">
        {/* Título do produto */}
        <div className="h-4 bg-[#27272A] rounded w-1/2"></div>
        {/* Descrição */}
        <div className="h-3 bg-[#27272A]/60 rounded w-3/4"></div>
      </div>
      {/* Preço + Thumbnail */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        <div className="h-5 bg-[#27272A] rounded w-14 sm:w-16"></div>
        <div className="w-24 h-16 sm:w-28 sm:h-[73px] aspect-[800/520] bg-[#27272A] rounded-lg shrink-0"></div>
      </div>
    </div>
  );
}

export function MenuSkeletonList() {
  return (
    <div className="space-y-3 px-4 py-4 max-w-3xl mx-auto">
      {/* Título da Categoria Skeleton */}
      <div className="h-6 bg-[#27272A] rounded w-36 mb-4 animate-pulse"></div>

      {/* Lista de cards skeleton */}
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}
