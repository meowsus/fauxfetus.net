import { Providers } from "@/app/providers";
import Header from "@/components/blocks/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Faux Fetus",
  description: "Lost songs from a weird age",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="dark text-foreground bg-background max-w-[1024px] px-6 mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
