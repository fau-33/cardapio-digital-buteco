import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buteco do Papá",
  description: "As melhores comidas e bebidas do Buteco",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/logo-buteco.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo-buteco.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-[#0D0D0D] text-white flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
