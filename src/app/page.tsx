import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900">
      <section>
        <div className="relative h-[600px] lg:h-[700px] overflow-hidden">
          <Image
            src="/hero.png"
            alt="Nifty Fifty - Avalanche Token Basket"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 from-95% to-zinc-800 to-100%"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-wider md:wordspacing titlefont">
                INVEST IN THE TOP 50
                <br />
                <span className="text-gray-200 tracking-wider md:wordspacing">
                  AVALANCHE TOKENS
                </span>
              </h1>
              <p className="text-xl md:text-3xl font-header text-gray-100 max-w-2xl mx-auto">
                One click. One basket. Fifty of the best performing tokens in
                the Avalanche ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/buy">
                  <button
                    className="bg-gray-100 text-black px-8 py-2 text-lg font-semibold rounded-full hover:bg-gray-300"
                  >
                    Buy Token Basket
                  </button>
                </Link>
                <Link href="/view-tokens">
                  <button
                    className="border-2 border-white text-white px-8 py-2 text-lg font-semibold rounded-full hover: hover:bg-red-900"
                  >
                    Explore Tokens
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-[80%] mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose AVAX50?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {`The smartest way to invest in Avalanche's ecosystem with our curated
            basket of top-performing tokens.`}
          </p>
        </div>

        <BentoGrid className="mx-auto">
          <BentoGridItem
            title="Diversified Portfolio"
            description="Spread your risk across the top 50 tokens in the Avalanche ecosystem. One purchase gives you exposure to the entire market."
            header={
              <div className="relative h-32 w-full rounded-lg bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 overflow-hidden">
                <Image
                  src="/diversified-portfolio.png"
                  alt="Diversified Portfolio"
                  fill
                  className="object-cover"
                />
              </div>
            }
            className="md:col-span-2"
          />

          <BentoGridItem
            title="Smart Rebalancing"
            description="Our algorithm automatically rebalances your portfolio to maintain optimal allocation as token values fluctuate."
            header={
              <div className="relative h-32 w-full rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600 overflow-hidden">
                <Image
                  src="/balance.png"
                  alt="Smart Rebalancing"
                  fill
                  className="object-cover"
                />
              </div>
            }
          />

          <BentoGridItem
            title="Low Fees"
            description="Pay minimal fees compared to buying 50 tokens individually. Save on gas costs and transaction fees."
            header={
              <div className="relative h-32 w-full rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600 overflow-hidden">
                <Image
                  src="/low-fees.png"
                  alt="Low Fees"
                  fill
                  className="object-cover"
                />
              </div>
            }
          />

          <BentoGridItem
            title="Real-time Analytics"
            description="Track your portfolio performance with detailed analytics, market insights, and comprehensive reporting tools."
            header={
              <div className="relative h-32 w-full rounded-lg bg-gradient-to-br from-black to-zinc-900 border border-zinc-700 overflow-hidden">
                <Image
                  src="/real-time.png"
                  alt="Real-time Analytics"
                  fill
                  className="object-cover"
                />
              </div>
            }
            className="md:col-span-2"
          />

          <BentoGridItem
            title="Secure & Audited"
            description="Built with security-first principles. Our smart contracts are audited and battle-tested for your peace of mind."
            header={
              <div className="relative h-32 w-full rounded-lg bg-gradient-to-br from-black to-zinc-900 border border-zinc-700 overflow-hidden">
                <Image
                  src="/security.png"
                  alt="Secure & Audited"
                  fill
                  className="object-cover"
                />
              </div>
            }
            className="md:col-span-1"
          />

          <BentoGridItem
            title="24/7 Trading"
            description="Buy and sell your token basket anytime. The DeFi market never sleeps, and neither do we."
            header={
              <div className="relative h-32 w-full rounded-lg bg-gradient-to-br from-zinc-600 to-black border border-zinc-700 overflow-hidden">
                <Image
                  src="/time.png"
                  alt="24/7 Trading"
                  fill
                  className="object-cover"
                />
              </div>
            }
            className="md:col-span-1"
          />

          <BentoGridItem
            title="Community Driven"
            description="Join a vibrant community of investors. Share insights, learn from others, and grow together in the Avalanche ecosystem."
            header={
              <div className="relative h-32 w-full rounded-lg bg-gradient-to-br from-black to-zinc-900 border border-zinc-700 overflow-hidden">
                <Image
                  src="/community.png"
                  alt="Community Driven"
                  fill
                  className="object-cover"
                />
              </div>
            }
            className="md:col-span-1"
          />
        </BentoGrid>
      </section>

      <footer className="relative mt-16">
        <div className="relative h-[500px] overflow-hidden">
          <Image
            src="/footer.jpg"
            alt="AVAX50 Footer"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <h2 className="text-4xl font-bold mb-4">
                Ready to start investing?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {`Join thousands of investors who are building wealth with our
                curated basket of Avalanche's top 50 tokens.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/buy">
                  <Button
                    size="lg"
                    className="text-black bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full hover:bg-white transition-colors"
                  >
                    Buy Token Basket
                  </Button>
                </Link>
              </div>

              <div className="text-xs text-gray-500">
                © 2025 AVAX50. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
