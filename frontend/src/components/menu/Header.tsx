export function Header() {
  return (
    <header className="relative flex flex-col items-center justify-center pt-8 pb-6 px-4 text-center overflow-hidden border-b border-[#27272A]">
      {/* Brilho / Glow Radial Âmbar ao fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-600/20 blur-3xl pointer-events-none rounded-full" />

      {/* Selo / Emblema Redondo BP */}
      <div className="relative z-10 w-16 h-16 rounded-full border-2 border-dashed border-[#F59E0B] flex items-center justify-center bg-[#18181B] mb-3 shadow-lg">
        <span className="text-amber-500 font-extrabold text-xl tracking-wider">
          BP
        </span>
      </div>

      {/* Subtítulo de Topo */}
      <span className="relative z-10 text-xs tracking-[0.25em] text-amber-500 font-semibold uppercase mb-1">
        Tradição & Sabor
      </span>

      {/* Título Principal */}
      <h1 className="relative z-10 text-3xl sm:text-4xl font-extrabold tracking-wide uppercase text-white">
        Buteco do Papá
      </h1>

      {/* Detalhe Decorativo de Linha com Losango */}
      <div className="relative z-10 flex items-center justify-center gap-2 mt-3 w-full max-w-xs opacity-60">
        <div className="h-[1px] bg-gradient-to-r from-transparent to-amber-500 flex-1" />
        <div className="w-2 h-2 rotate-45 bg-amber-500" />
        <div className="h-[1px] bg-gradient-to-l from-transparent to-amber-500 flex-1" />
      </div>
    </header>
  );
}
