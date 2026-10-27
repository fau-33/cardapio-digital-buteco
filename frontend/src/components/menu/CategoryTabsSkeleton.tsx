"use client";

export function CategoryTabsSkeleton() {
  return (
    <div className="w-full bg-[#0D0D0D]/90 border-b border-[#27272A] py-4 px-3">
      <div className="max-w-3xl mx-auto flex items-center gap-2 overflow-hidden animate-pulse">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-9 bg-[#27272A] rounded-full shrink-0"
            style={{ width: `${80 + (index % 3) * 25}px` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
