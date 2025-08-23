"use client";

import { useEffect, useState, useMemo } from "react";
import tokens from "@/utils/tokens";
import { Input } from "@/components/ui/input";
import { useActiveAccount } from "thirdweb/react";
import { getContract, readContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "../client";
import Image from "next/image";

export default function PortfolioPage() {
  const chainId = 43113;
  const account = useActiveAccount();

  const [searchTerm, setSearchTerm] = useState("");
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [totalUsd, setTotalUsd] = useState(0);

  async function fetchBalances() {
    if (!account?.address) return;

    try {
      const results = await Promise.all(
        tokens.map(async (token) => {
          try {
            const contract = getContract({
              client,
              chain: defineChain(chainId),
              address: token.contractAddress,
            });

            const bal = await readContract({
              contract,
              method:
                "function balanceOf(address owner) view returns (uint256)",
              params: [account.address],
            });

            const formatted = Number(bal) / 1e18;
            return { address: token.contractAddress, balance: formatted };
          } catch (err) {
            console.error(`❌ Error fetching balance for ${token.symbol}`, err);
            return { address: token.contractAddress, balance: 0 };
          }
        })
      );

      const newBalances: Record<string, number> = {};
      let total = 0;

      for (const { address, balance } of results) {
        newBalances[address] = balance;
        const token = tokens.find((t) => t.contractAddress === address);
        if (token) {
          total += balance * token.priceUsd;
        }
      }

      setBalances(newBalances);
      setTotalUsd(total);
    } catch (err) {
      console.error("❌ Error fetching balances", err);
    }
  }

  useEffect(() => {
    fetchBalances();
  }, [account]);

  const filteredTokens = useMemo(() => {
    return tokens.filter(
      (token) =>
        token.tokenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-black text-foreground">
      <div className="container mx-auto px-4 py-6">
        {/* Portfolio Stats */}
        <div className="bg-secondary-background border-4 border-border rounded-base shadow-shadow p-6 mb-8">
          <h2 className="font-heading text-2xl text-foreground mb-2">
            Portfolio Balance
          </h2>
          <p className="text-4xl font-bold text-main">
            ${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search tokens in portfolio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Tokens Table */}
        <div className="overflow-x-auto rounded-lg border border-border shadow">
          <table className="w-full border-collapse">
            <thead className="bg-secondary-background">
              <tr>
                <th className="px-4 py-3 text-left">Token</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3 text-right">Price (USD)</th>
                <th className="px-4 py-3 text-right">USD Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens
                .filter((t) => (balances[t.contractAddress] || 0) > 0)
                .map((token) => {
                  const balance = balances[token.contractAddress] || 0;
                  return (
                    <tr
                      key={token.contractAddress}
                      className="border-t border-border hover:bg-secondary-background/50 transition"
                    >
                      {/* Token Image + Name */}
                      <td className="px-4 py-3 flex items-center gap-3">
                        <Image
                          src={token.url}
                          alt={token.tokenName}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-semibold">{token.tokenName}</p>
                          <p className="text-xs text-foreground/60">
                            {token.symbol}
                          </p>
                        </div>
                      </td>

                      {/* Balance */}
                      <td className="px-4 py-3 text-right font-mono">
                        {balance.toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}{" "}
                        {token.symbol}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-right">
                        $
                        {token.priceUsd.toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}
                      </td>

                      {/* USD Value */}
                      <td className="px-4 py-3 text-right font-semibold text-main">
                        $
                        {(balance * token.priceUsd).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTokens.filter((t) => (balances[t.contractAddress] || 0) > 0)
          .length === 0 && (
          <div className="text-center py-12">
            <div className="bg-secondary-background border-4 border-border rounded-base shadow-shadow p-8 max-w-md mx-auto">
              <h3 className="font-heading text-xl text-foreground mb-2">
                No tokens in portfolio
              </h3>
              <p className="text-foreground/70">
                Once you purchase or receive tokens, they’ll show up here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
