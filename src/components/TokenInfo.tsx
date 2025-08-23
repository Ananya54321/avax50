"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TokenInfoProps = {
  contractAddress: string;
  tokenName: string;
  symbol: string;
  supply: number;
  priceUsd: number;
  marketCapUsd: number;
  percentage: string;
  imageUrl: string;
};

export default function TokenInfo({
  contractAddress,
  tokenName,
  symbol,
  supply,
  priceUsd,
  marketCapUsd,
  percentage,
  imageUrl,
}: TokenInfoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatSupply = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toLocaleString();
  };

  const percentageFloat = parseFloat(percentage);
  const isPositive = percentageFloat >= 0;

  return (
    <>
      <div className="space-y-3">
        {/* Primary Info - Always Visible */}
        <div className="space-y-2">
          {/* Symbol and Price */}
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "font-base text-sm px-2 py-1 rounded-base border-2 border-border",
                isPositive
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-red-100 text-red-800 border-red-300"
              )}
            >
              {isPositive ? "+" : ""}
              {percentage}%
            </span>
            <span className="font-heading text-lg text-foreground">
              ${priceUsd.toFixed(4)}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-2 px-3 text-xs font-base bg-secondary-background border-2 border-border rounded-base hover:bg-main hover:text-main-foreground transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-shadow"
        >
          View Details
        </button>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {tokenName} ({symbol})
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 pt-0">
            {/* Token Image - Centered */}
            <div className="flex gap-4 justify-center mb-6">
              <div className="bg-secondary-background border-4 border-border rounded-base shadow-shadow">
                <Image
                  src={imageUrl}
                  alt={tokenName}
                  className="object-cover"
                  width={500}
                  height={100}
                  onError={(e) => {
                    e.currentTarget.src = "/favicon.ico";
                  }}
                />
              </div>

              {/* Token Information - Full Width */}
              <div className="w-full flex flex-col space-y-4 mb-6">
                {/* Price Information */}
                <div className="bg-secondary-background flex flex-col border-2 border-border rounded-base p-4">
                  <h4 className="font-heading text-sm text-foreground mb-3">
                    Price Information
                  </h4>
                  <div className="grid grid-cols-1  gap-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Current Price:</span>
                      <span className="font-base text-foreground">
                        ${priceUsd.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">24h Change:</span>
                      <span
                        className={cn(
                          "font-base",
                          isPositive ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {isPositive ? "+" : ""}
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Market Information */}
                <div className="bg-secondary-background flex flex-col border-2 border-border rounded-base p-4">
                  <h4 className="font-heading text-sm text-foreground mb-3">
                    Market Information
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Market Cap:</span>
                      <span className="font-base text-foreground">
                        {formatNumber(marketCapUsd)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Total Supply:</span>
                      <span className="font-base text-foreground">
                        {formatSupply(supply)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Information - Full Width */}
            <div className="bg-secondary-background border-2 border-border rounded-base p-4 mb-4">
              <div>
                <span className="text-foreground/70 text-sm block mb-1">
                  Contract Address:
                </span>
                <code className="text-xs font-mono bg-main text-main-foreground px-2 py-1 rounded border border-border break-all block">
                  {contractAddress}
                </code>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-main text-main-foreground border-2 border-border rounded-base shadow-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 font-base text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
