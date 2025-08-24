/** @type {import('next').NextConfig} */
const nextConfig = {
  // fixes wallet connect dependency issue https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    domains: [
      "cryptologos.cc",
      "framerusercontent.com",
      "assets.coingecko.com",
      "coin-images.coingecko.com",
      "assets.coingecko.com",
      "s2.coinmarketcap.com",
      "avatars.githubusercontent.com",
      "s3.coinmarketcap.com",
      "cryptologos.cc"
    ],
  },
};

export default nextConfig;
