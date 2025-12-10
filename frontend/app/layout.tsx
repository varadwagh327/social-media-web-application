import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/Common/Navbar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Social Media Platform",
  description: "Connect, share, and engage with the world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
