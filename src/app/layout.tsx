import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import TailwindToaster from "@/components/TailwindToaster/TailwindToaster";

export const metadata: Metadata = {
  title: "Estoque Inteligente",
  description: "Landing page moderna e responsiva",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="antialiased font-onest">
        <UserProvider>
          <TailwindToaster />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}