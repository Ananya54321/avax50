"use client";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "@/app/client";
import { avalancheFuji } from "thirdweb/chains";


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
      <body>
        <QueryClientProvider client={queryClient}>
          <ThirdwebProvider>
            <div className="h-full flex flex-col">
              <div className="bg-black flex justify-between items-center p-4 flex-shrink-0 border-b-1 border-gray-700">
                <div className="text-white titlefont text-3xl">Token 50</div>
                <ConnectButton
                  client={client}
                  wallets={wallets}
                  chain={avalancheFuji}
                />
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
      </body>
    </html>
  );
}
