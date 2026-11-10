"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  QrCode,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  ArrowLeft,
  Code2,
  Loader2,
  LayoutDashboard,
  Server,
} from "lucide-react";
import { API_URL, warmUpApi } from "@/lib/api";

const OFFICIAL_MENU_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cardapio-buteco-papa.vercel.app";

export default function DeveloperQrCodePage() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingQr, setDownloadingQr] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    warmUpApi();
  }, []);

  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&format=png&margin=20&ecc=H&data=${encodeURIComponent(
    OFFICIAL_MENU_URL
  )}`;

  const showNotice = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleCopyMenuUrl = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_MENU_URL);
      setCopiedLink(true);
      showNotice("Link permanente do cardápio copiado!");
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showNotice("Não foi possível copiar o link automaticamente.");
    }
  };

  const handleDownloadQrCode = async () => {
    setDownloadingQr(true);
    try {
      const response = await fetch(qrCodeImageUrl);
      if (!response.ok) throw new Error("Falha ao gerar arquivo PNG.");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "qrcode-cardapio-buteco-do-papa-alta-resolucao.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      showNotice("QR Code em alta resolução (1000x1000 PNG) baixado!");
    } catch {
      window.open(qrCodeImageUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloadingQr(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white pb-16">
      {/* Header do Desenvolvedor */}
      <header className="sticky top-0 z-30 bg-[#0D0D0D]/95 backdrop-blur border-b border-[#27272A]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B]">
              <Code2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-white">
                  ZyonTech • Área do Desenvolvedor
                </h1>
                <span className="text-[10px] bg-amber-500/20 text-[#F59E0B] border border-amber-500/40 px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                  Flávio Félix
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Gerador Oficial de QR Code para Impressão Gráfica e Ferramentas Técnicas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#18181B] hover:bg-[#27272A] text-zinc-200 border border-[#27272A] px-3 py-2 rounded-xl transition-colors"
            >
              <LayoutDashboard size={14} className="text-[#F59E0B]" />
              Dashboard Admin
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#18181B] hover:bg-[#27272A] text-zinc-200 border border-[#27272A] px-3 py-2 rounded-xl transition-colors"
            >
              <ArrowLeft size={14} className="text-[#F59E0B]" />
              Cardápio Público
            </Link>
          </div>
        </div>
      </header>

      {feedback && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#18181B] border border-[#F59E0B]/40 text-amber-200 text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl">
          {feedback}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        {/* Card Principal: Gerador de QR Code Oficial */}
        <section className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Pré-visualização imediata do QR Code */}
            <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-6 shadow-inner shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeImageUrl}
                alt={`QR Code permanente para ${OFFICIAL_MENU_URL}`}
                width={260}
                height={260}
                className="w-60 h-60 sm:w-64 sm:h-64 object-contain"
              />
              <span className="mt-3 text-xs font-extrabold uppercase tracking-widest text-zinc-900">
                Buteco do Papá • Cardápio Digital
              </span>
              <span className="mt-1 text-[10px] font-semibold text-zinc-500">
                PNG 1000×1000px • Correção de Erro Alta (ECC H)
              </span>
            </div>

            {/* Informações e Ações do QR Code */}
            <div className="flex-1 space-y-5 w-full">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-[#F59E0B] text-xs font-extrabold uppercase tracking-wider">
                  <QrCode size={16} />
                  <span>Gerador Oficial de Produção</span>
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-wide">
                  QR Code Permanente das Mesas
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Uso exclusivo da{" "}
                  <strong className="text-white">ZyonTech (Flávio Félix)</strong>{" "}
                  para geração e envio à gráfica. O administrador do bar gerencia
                  apenas os itens e preços na Dashboard sem risco de alterar o
                  endereço das mesas.
                </p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="text-emerald-400 shrink-0 mt-0.5"
                />
                <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                  QR Code estático e vitalício com alta redundância (ECC H - 30%).
                  Qualquer alteração de preços, fotos ou novos pratos no painel
                  reflete automaticamente neste mesmo código.
                </p>
              </div>

              {/* Link Ativo + Copiar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Link Oficial Embutido no QR Code
                  </label>
                  <a
                    href={OFFICIAL_MENU_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F59E0B] hover:underline"
                  >
                    Testar link <ExternalLink size={12} />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={OFFICIAL_MENU_URL}
                    className="w-full bg-[#0D0D0D] border border-[#27272A] rounded-xl py-3 px-3.5 text-xs text-[#F59E0B] font-mono select-all focus:outline-none focus:border-[#F59E0B]"
                  />
                  <button
                    type="button"
                    onClick={handleCopyMenuUrl}
                    className={`inline-flex items-center gap-1.5 shrink-0 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider border transition-all cursor-pointer ${
                      copiedLink
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-[#0D0D0D] hover:bg-[#27272A] border-[#27272A] text-white"
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check size={14} /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Botão de Download em Alta Resolução */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={downloadingQr}
                  onClick={handleDownloadQrCode}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#d9822b] text-black font-extrabold uppercase text-xs tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/15 disabled:opacity-50 cursor-pointer"
                >
                  {downloadingQr ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Gerando PNG
                      1000×1000px...
                    </>
                  ) : (
                    <>
                      <Download size={16} /> Baixar QR Code para Impressão Gráfica
                      (PNG 1000×1000)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Diagnóstico Técnico Rápido do Ambiente */}
        <section className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-zinc-300">
            <Server size={15} className="text-[#F59E0B]" />
            <span>Configuração Técnica do Ambiente (ZyonTech)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#0D0D0D] border border-[#27272A] rounded-xl p-3">
              <span className="text-zinc-500 block text-[10px] uppercase font-bold">
                URL do Cardápio (Vercel)
              </span>
              <span className="font-mono text-zinc-200 break-all">
                {OFFICIAL_MENU_URL}
              </span>
            </div>
            <div className="bg-[#0D0D0D] border border-[#27272A] rounded-xl p-3">
              <span className="text-zinc-500 block text-[10px] uppercase font-bold">
                Endpoint da API (Render)
              </span>
              <span className="font-mono text-zinc-200 break-all">
                {API_URL}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
