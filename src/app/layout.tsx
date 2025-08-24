"use client";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "@/app/client";
import { avalancheFuji } from "thirdweb/chains";
import Image from "next/image";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen antialiased overflow-hidden">
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <ThirdwebProvider>
              <div className="h-full flex flex-col">
                <div className="bg-black border-b border-gray-700 flex justify-between items-center p-4 flex-shrink-0">
                  {/* <div className="text-white pl-2 titlefont text-3xl">AVAX50</div> */}
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={130}
                    height={130}
                  />
                  <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <ConnectButton
                      client={client}
                      wallets={wallets}
                      chain={avalancheFuji}
                    />
                  </div>
                </div>
                <Toaster />
                <div className="flex flex-1 min-h-0">
                  <div className="w-[15%] flex-shrink-0">
                    <Navbar />
                  </div>
                  <div className="w-[85%] overflow-y-auto">{children}</div>
                </div>
              </div>
            </ThirdwebProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
