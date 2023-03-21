import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("bg-white text-slate-900 antialiased", inter.className)}>
      <head>
        <title>Similiarity API</title>
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 antialiased">
        <Providers>
          {/* @ts-expect-error Server Component */}
          <NavBar />
          <Toaster position="bottom-right" />
          <main>{children}</main>
          {/* Allow more height for mobile menu on mobile */}
          <div className="h-40 md:hidden" />
        </Providers>
      </body>
    </html>
  );
}
