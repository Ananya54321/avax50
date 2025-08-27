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
      setTimeout(() => setCopied(false), 2000)  
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={cn(
              "font-base text-lg px-2 py-1 rounded-base border-1 border-gray-700",
              isPositive 
                ? " text-green-400 border-gray-700" 
                : "bg-red-100 text-red-800 border-red-300"
            )}>
              {percentage}%
            </span>
            <span className="font-heading text-lg text-white">
              ${priceUsd.toFixed(4)}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full buttonfont py-2 px-3 text-lg text-black font-base bg-white border-1 border-gray-700 rounded-base"
        >
          View Details
        </button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="border border-gray-700 bg-black w-[95vw] max-w-4xl sm:w-[90vw] sm:max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">{tokenName} ({symbol})</DialogTitle>
          </DialogHeader>
          
          <div className="p-3 sm:p-6 pt-0">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-4 lg:mb-6">
              <div className="flex-shrink-0 self-center lg:self-start">
                <div className="bg-secondary-background border-2 border-gray-700 rounded-base p-3 sm:p-4">
                  <Image
                    src={imageUrl}
                    alt={tokenName}
                    className="object-cover rounded-base"
                    width={150}
                    height={150}
                    style={{ width: '150px', height: '150px' }}
                    onError={(e) => {
                      e.currentTarget.src = "/favicon.ico";
                    }}
                  /> 
                </div>
              </div>

              <div className="flex-1 flex flex-col space-y-3 lg:space-y-4">
                <div className="bg-secondary-background flex flex-col border-2 border-gray-700 rounded-base p-3 sm:p-4">
                  <h4 className="font-heading text-base sm:text-lg text-white mb-2 sm:mb-3">Price Information</h4>
                  <div className="grid grid-cols-1 gap-2 sm:gap-4">
                    <div className="flex justify-between text-sm sm:text-lg">
                      <span className="text-white/70">Current Price:</span>
                      <span className="font-base text-white">${priceUsd.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-lg">
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

                <div className="bg-secondary-background flex flex-col border-2 border-gray-700 rounded-base p-3 sm:p-4">
                  <h4 className="font-heading text-base sm:text-lg text-white mb-2 sm:mb-3">Market Information</h4>
                  <div className="grid grid-cols-1 gap-2 sm:gap-4">
                    <div className="flex justify-between text-sm sm:text-lg">
                      <span className="text-white/70">Market Cap:</span>
                      <span className="font-base text-white">{formatNumber(marketCapUsd)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-lg">
                      <span className="text-white/70">Total Supply:</span>
                      <span className="font-base text-white">{formatSupply(supply)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <div className="bg-secondary-background border-2 border-gray-700 rounded-base p-3 sm:p-4 mb-3 sm:mb-4">
                <div>
                  <span className="text-white text-sm sm:text-lg block mb-2">Contract Address:</span>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <code className="text-xs sm:text-sm font-mono text-main-foreground px-2 py-1 rounded border border-gray-700 break-all flex-1 w-full sm:w-auto">
                      {contractAddress}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center p-2 bg-white hover:bg-gray-100 border-1 border-gray-700 rounded transition-colors duration-200 self-start sm:self-auto flex-shrink-0"
                      title={copied ? "Copied!" : "Copy to clipboard"}
                    >
                      {copied ? (
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

            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 sm:px-4 py-2 bg-white font-bold text-black border-1 border-gray-700 rounded-base text-sm sm:text-lg"
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
