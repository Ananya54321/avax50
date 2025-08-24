'use client'

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"


type TokenInfoProps = {
  contractAddress: string
  tokenName: string
  symbol: string
  supply: number
  priceUsd: number
  marketCapUsd: number
  percentage: string
  imageUrl: string
}

export default function TokenInfo({
  contractAddress,
  tokenName,
  symbol,
  supply,
  priceUsd,
  marketCapUsd,
  percentage,
  imageUrl
}: TokenInfoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`
    }
    return `$${num.toFixed(2)}`
  }

  const formatSupply = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`
    }
    return num.toLocaleString()
  }

  const percentageFloat = parseFloat(percentage)
  const isPositive = percentageFloat >= 0

  return (
    <>
      <div className="space-y-3">
        {/* Primary Info - Always Visible */}
        <div className="space-y-2">
          {/* Symbol and Price */}
          <div className="flex items-center justify-between">
            <span className={cn(
              "font-base text-lg px-2 py-1 rounded-base border-1 border-gray-700",
              isPositive 
                ? "bg-green-100 text-green-800 border-green-300" 
                : "bg-red-100 text-red-800 border-red-300"
            )}>
              {isPositive ? "+" : ""}{percentage}%
            </span>
            <span className="font-heading text-lg text-white">
              ${priceUsd.toFixed(4)}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full buttonfont py-2 px-3 text-lg text-black font-base bg-white border-1 border-gray-700 rounded-base"
        >
          View Details
        </button>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="border border-gray-700 bg-black w-[90vw] max-w-4xl min-w-[60vw]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{tokenName} ({symbol})</DialogTitle>
          </DialogHeader>
          
          <div className="p-6 pt-0">
            {/* Main Content Layout - Token Image + Information Side by Side */}
            <div className="flex gap-6 mb-6">
              {/* Token Image - Left Side */}
              <div className="flex-shrink-0">
                <div className="bg-secondary-background border-2 border-gray-700 rounded-base p-4">
                  <Image
                    src={imageUrl}
                    alt={tokenName}
                    className="object-cover rounded-base"
                    width={200}
                    height={200}
                    onError={(e) => {
                      e.currentTarget.src = "/favicon.ico";
                    }}
                  /> 
                </div>
              </div>

              {/* Token Information - Right Side */}
              <div className="flex-1 flex flex-col space-y-4">
                {/* Price Information */}
                <div className="bg-secondary-background flex flex-col border-2 border-gray-700 rounded-base p-4">
                  <h4 className="font-heading text-lg text-white mb-3">Price Information</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-white/70">Current Price:</span>
                      <span className="font-base text-white">${priceUsd.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-white/70">Percentage:</span>
                      <span className={cn(
                        "font-base",
                        isPositive ? "text-green-600" : "text-red-600"
                      )}>
                        {isPositive ? "+" : ""}{percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Market Information */}
                <div className="bg-secondary-background flex flex-col border-2 border-gray-700 rounded-base p-4">
                  <h4 className="font-heading text-lg text-white mb-3">Market Information</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-white/70">Market Cap:</span>
                      <span className="font-base text-white">{formatNumber(marketCapUsd)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-white/70">Total Supply:</span>
                      <span className="font-base text-white">{formatSupply(supply)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* Contract Information - Full Width */}
            <div className="bg-secondary-background border-2 border-gray-700 rounded-base p-4 mb-4">
                <div>
                  <span className="text-white text-lg block mb-1">Contract Address:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-main-foreground px-2 py-1 rounded border border-gray-700 break-all flex-1">
                      {contractAddress}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 border-1 border-gray-700 rounded transition-colors duration-200"
                      title={copied ? "Copied!" : "Copy to clipboard"}
                    >
                      {copied ? (
                        // Check icon
                        <svg 
                          className="w-4 h-4 text-green-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                      ) : (
                        // Copy icon
                        <svg 
                          className="w-4 h-4 text-gray-700" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white font-bold text-black border-1 border-gray-700 rounded-base text-lg"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
