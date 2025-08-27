import  tokens  from "@/utils/tokens"

export default function TokenStats() {
  const totalMarketCap = tokens.reduce((sum, token) => sum + token.marketCapUsd, 0)
  const averagePrice = tokens.reduce((sum, token) => sum + token.priceUsd, 0) / tokens.length
  const topGainer = tokens.reduce((max, token) => 
    parseFloat(token.percentage) > parseFloat(max.percentage) ? token : max
  )
  const topLoser = tokens.reduce((min, token) => 
    parseFloat(token.percentage) < parseFloat(min.percentage) ? token : min
  )

  const formatMarketCap = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`
    }
    return `$${(num / 1000).toFixed(2)}K`
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="border border-gray-700 p-4 text-center">
        <h3 className="font-heading text-base md:text-lg text-white/70 mb-1">Total Market Cap</h3>
        <p className="font-heading text-lg md:text-2xl text-white">{formatMarketCap(totalMarketCap)}</p>
      </div>
      
      <div className="border border-gray-700 p-4 text-center">
        <h3 className="font-heading text-base md:text-lg text-white/70 mb-1">Average Price</h3>
        <p className="font-heading text-lg md:text-2xl text-white">${averagePrice.toFixed(4)}</p>
      </div>
      
      <div className="border border-gray-700 p-4 text-center">
        <h3 className="font-heading text-base md:text-lg text-white/70 mb-1">Top Gainer</h3>
        <div className="flex gap-3 justify-center items-center">
          <p className="font-heading text-lg md:text-2xl text-white line-clamp-1">{topGainer.tokenName}</p>
          <p className="font-bold text-lg md:text-2xl text-green-600">+{topGainer.percentage}%</p>
        </div>
      </div>
      
      <div className="border border-gray-700 p-4 text-center">
        <h3 className="font-heading text-base md:text-lg text-white/70 mb-1">Biggest Drop</h3>
        <div className="flex gap-3 justify-center items-center">
        <p className="font-heading text-lg md:text-2xl text-white line-clamp-1">{topLoser.tokenName}</p>
        <p className="font-bold text-lg md:text-2xl text-red-600">{topLoser.percentage}%</p>
        </div>
      </div>
    </div>
  )
}
