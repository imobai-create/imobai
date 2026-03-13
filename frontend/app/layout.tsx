import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IMOBAI",
  description: "IMOBAI — você no comando.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
