import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TV Latino | Televisión en vivo",
  description: "Canales públicos verificados y organizados por país.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
