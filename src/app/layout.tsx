
import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { SelectedOrganizationProvider } from "@/context/SelectedOrganizationContext";
import { Onest } from "next/font/google";
import TailwindToaster from "@/components/TailwindToaster/TailwindToaster";

const onest = Onest({ subsets: ["latin"], weight: ["100","200","300","400","500","600","700","800","900"] });

export const metadata: Metadata = {
  title: "stuff"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`antialiased ${onest.className} h-screen bg-[url('/pattern_faded.png')] bg-repeat bg-[length:98px_98px] `}>
        <UserProvider>
          <SelectedOrganizationProvider>
            <TailwindToaster />
            {children}
          </SelectedOrganizationProvider>
        </UserProvider>
      </body>
    </html>
  );
}