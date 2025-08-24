# Token Basket Platform

In India, stock market participation has grown rapidly, with a large portion of investors (over 65%) choosing safer, index-based investments such as the Nifty Fifty. However, the same level of adoption has not yet been seen in the crypto space. Many people remain hesitant to enter due to the volatility, complexity, and technical barriers associated with crypto investing.

This project bridges that gap by creating a crypto token basket, similar to how Nifty Fifty works for stocks, but powered by the Avalanche (AVAX) blockchain. The goal is to provide a safe and accessible entry point into the world of crypto for individuals who are curious but uncertain.

By offering a curated, diversified basket of tokens, users can gain exposure to crypto markets without needing to analyze each asset individually or dive into the complexities of wallets and blockchain infrastructure.

To further simplify adoption, the platform integrates smart wallets. Instead of managing private keys or seed phrases, users can sign up and invest seamlessly using just their Google account, lowering the entry barrier significantly.

This opens up new possibilities for first-time investors—people who previously avoided crypto due to fear or lack of technical know-how can now participate in a familiar, index-style investment model, making crypto investing safer, simpler, and more mainstream.

## Avalanche (AVAX) Integration

This platform leverages the Avalanche (AVAX) blockchain for fast, low-cost, and secure transactions. AVAX is chosen for its scalability, eco-friendly consensus, and robust ecosystem, making it ideal for tokenized investment products.

- **Fast & Low Fees:** AVAX enables near-instant transactions with minimal fees, improving user experience.
- **Security:** Avalanche’s consensus protocol ensures high security for all token operations and portfolio management.
- **Ecosystem:** Access to a wide range of DeFi protocols and assets on Avalanche.

### Why AVAX?

- High throughput and low latency for trading and portfolio updates
- Environmentally friendly proof-of-stake consensus
- Growing support for tokenized assets and DeFi applications

## Project Structure

```
├── public/                # Static assets (images, icons, etc.)
├── src/
│   ├── app/               # Next.js app directory (routing, pages)
│   ├── components/        # Reusable React components
│   │   ├── feature/       # Feature-specific components (charts, tables, widgets)
│   │   └── ui/            # UI primitives (buttons, cards, etc.)
│   ├── lib/               # Utility libraries
│   └── utils/             # Helper functions (e.g., token data)
├── .env.example           # Example environment variables
├── package.json           # Project metadata and dependencies
├── tailwind.config.ts     # Tailwind CSS configuration
├── next.config.js/mjs     # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Key Functionalities

- **Token Basket Creation:** Users can invest in a curated basket of crypto tokens, similar to index funds.
- **Portfolio Management:** View, buy, and sell tokens from the basket.
- **Real-Time Stats:** Live price updates and portfolio performance tracking.
- **Charts & Analytics:** Interactive charts for token performance and historical data.
- **Secure Transactions:** Integration with secure payment gateways and wallet providers.
- **Community Features:** Chat widgets and community engagement tools.

- **Avalanche (AVAX) Support:** All token baskets and transactions are powered by Avalanche, ensuring speed and reliability.

## Tech Stack

- **Next.js**: React framework for server-side rendering and routing
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Thirdweb**: Blockchain and wallet integration
- **PostCSS**: CSS processing
- **Vercel**: Deployment platform

- **Avalanche (AVAX):** Blockchain for token baskets and transactions

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Ananya54321/token521.git
   cd token521
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values.
4. **Run the development server:**
   ```sh
   npm run dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Environment Variables

See `.env.example` for required environment variables (API keys, wallet providers, etc.).

### Example AVAX Environment Variables

```
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=
NEXT_PUBLIC_THIRDWEB_CLIENT_SECRET=
NEXT_PUBLIC_GECKO_KEY=
NEXT_PUBLIC_FAT_WALLLET_ADDRESS=
```

Configure these variables in your `.env` file to enable Avalanche integration.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and new features.

## License

This project is licensed under the MIT License.
