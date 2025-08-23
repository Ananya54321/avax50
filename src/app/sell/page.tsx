"use client";

import { useEffect, useState } from "react";
import tokens from "@/utils/tokens";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PreparedTransaction, prepareTransaction } from "thirdweb";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { privateKeyToAccount } from "thirdweb/wallets/private-key";
import { toast } from "sonner";

import {
  ThirdwebProvider,
  useActiveAccount,
  useWalletBalance,
} from "thirdweb/react";
import {
  getContract,
  prepareContractCall,
  sendAndConfirmTransaction,
  readContract,
  sendBatchTransaction,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "../client";

const Page = () => {
  const chainId = 43113;
  const account = useActiveAccount();

  const { data, isLoading, isError } = useWalletBalance({
    chain: defineChain(chainId),
    address: account?.address,
    client,
  });

  const [balances, setBalances] = useState<Record<string, number>>({});
  const [sellAmounts, setSellAmounts] = useState<Record<string, number>>({});
  const [transferProgress, setTransferProgress] = useState(0);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [transferredTokens, setTransferredTokens] = useState<string[]>([]);
  const [failedTokens, setFailedTokens] = useState<string[]>([]);
  const [totalUsd, setTotalUsd] = useState(0);
  const [avaxPrice, setAvaxPrice] = useState(0);
  async function fetchAvaxPrice() {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd"
      );
      const data = await res.json();
      setAvaxPrice(data["avalanche-2"]?.usd || 0);
    } catch (err) {
      console.error("❌ Failed to fetch AVAX price", err);
    }
  }
  useEffect(() => {
    let total = 0;
    for (const token of tokens) {
      const amount = sellAmounts[token.contractAddress] || 0;
      const price = token.priceUsd || 0; // ✅ use your token.price
      total += amount * price;
    }
    setTotalUsd(total);
  }, [sellAmounts, balances]);

  useEffect(() => {
    fetchAvaxPrice();
  }, []);

  async function fetchBalances() {
    if (!account?.address) return;

    const results: Record<string, number> = {};
    const init: Record<string, number> = {};

    for (const token of tokens) {
      try {
        const contract = getContract({
          client,
          chain: defineChain(chainId),
          address: token.contractAddress,
        });

        const bal = await readContract({
          contract,
          method: "function balanceOf(address owner) view returns (uint256)",
          params: [account.address],
        });
        const formatted = Number(bal) / 1e18;

        results[token.contractAddress] = formatted;
        init[token.contractAddress] = 0;
      } catch (err) {
        console.error(`❌ Error fetching balance for ${token.symbol}`, err);
        results[token.contractAddress] = 0;
        init[token.contractAddress] = 0;
      }
    }

    setBalances(results);
    setSellAmounts(init);
  }

  useEffect(() => {
    if (account?.address) {
      fetchBalances();
    }
  }, [account]);

  async function sellTokens() {
    if (!account?.address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setTransferProgress(0);
    setCurrentTokenIndex(0);
    setTransferredTokens([]);
    setFailedTokens([]);

    const walletTo = process.env.NEXT_PUBLIC_FAT_WALLLET_ADDRESS!;
    if (!walletTo) {
      toast.error("❌ Missing destination wallet address");
      return;
    }
    const preparedTxs: PreparedTransaction[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const amount = sellAmounts[token.contractAddress];
      if (!amount || amount <= 0) continue;

      setCurrentTokenIndex(i);

      try {
        const contract = getContract({
          client,
          chain: defineChain(chainId),
          address: token.contractAddress,
        });

        const weiAmount = BigInt(Math.floor(amount * 1e18));

        const transaction = await prepareContractCall({
          contract,
          method: "function transfer(address to, uint256 value) returns (bool)",
          params: [walletTo, weiAmount],
        });

        preparedTxs.push(transaction);

        setTransferredTokens((prev) => [...prev, token.symbol]);
        setTransferProgress(((i + 1) / tokens.length) * 100);
      } catch (err) {
        console.error(`❌ Failed to sell ${token.symbol}:`, err);
        setFailedTokens((prev) => [...prev, token.symbol]);
        toast.error(`Failed to sell ${token.symbol}, continuing...`);
        setTransferProgress(((i + 1) / tokens.length) * 100);
      }
    }
    try {
      const { transactionHash } = await sendBatchTransaction({
        transactions: preparedTxs,
        account,
      });
      console.log(transactionHash);
      toast.success("Sell process completed!");
      if (transactionHash) {
        const wallet = privateKeyToAccount({
          client,
          privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY!,
        });
        const transaction = prepareTransaction({
          to: account.address,
          chain: defineChain(chainId),
          client: client,
          value: BigInt((totalUsd / avaxPrice) * 1e18),
        });
        const transactionReceipt = await sendAndConfirmTransaction({
          account: wallet,
          transaction,
        });
        if (transactionReceipt) {
          toast.success("✅ Avax Transfer Successful");
        } else {
          toast.error("❌ Avax Transfer Failed");
        }
      }
    } catch (err) {
      console.error("❌ Failed to send batch transaction:", err);
    }
  }

  const applyMasterPercentage = (percent: number) => {
    const updated: Record<string, number> = {};
    for (const [addr, bal] of Object.entries(balances)) {
      updated[addr] = (bal * percent) / 100;
    }
    setSellAmounts(updated);
  };

  const handleInputChange = (addr: string, value: string) => {
    setSellAmounts((prev) => ({
      ...prev,
      [addr]: Number(value),
    }));
  };

  return (
    <ThirdwebProvider>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Sell Tokens</CardTitle>
              <CardDescription>
                Transfer your tokens to the master wallet in one go
              </CardDescription>
            </CardHeader>

            <div className="space-y-1">
              <div className="text-lg font-semibold">
                Estimated USD: ${totalUsd.toFixed(2)}
              </div>
              {avaxPrice > 0 && (
                <div className="text-md text-muted-foreground">
                  ≈ {(totalUsd / avaxPrice).toFixed(4)} AVAX
                </div>
              )}
            </div>

            <Button
              onClick={sellTokens}
              disabled={isLoading || !account?.address}
              className="w-full h-12 text-lg font-semibold bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Fetching balances..." : "Sell Selected Tokens"}
            </Button>

            <CardContent className="space-y-6">
              <div className="flex gap-4">
                {[25, 50, 100].map((p) => (
                  <Button key={p} onClick={() => applyMasterPercentage(p)}>
                    {p}%
                  </Button>
                ))}
                <Button
                  variant="secondary"
                  onClick={() => {
                    const custom = prompt("Enter custom % (0-100):");
                    if (!custom) return;
                    const val = Number(custom);
                    if (val >= 0 && val <= 100) applyMasterPercentage(val);
                  }}
                >
                  Custom %
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tokens.map((token) => (
                  <Card key={token.contractAddress} className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={token.url}
                        alt={token.tokenName}
                        className="w-12 h-12"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">
                          {token.tokenName} ({token.symbol})
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Balance: {balances[token.contractAddress] ?? 0}
                        </div>
                        <Input
                          type="number"
                          min={0}
                          max={balances[token.contractAddress] ?? 0}
                          value={sellAmounts[token.contractAddress] ?? 0}
                          onChange={(e) =>
                            handleInputChange(
                              token.contractAddress,
                              e.target.value
                            )
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Progress Section */}
              {transferProgress > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Transfer Progress</span>
                    <span>{Math.round(transferProgress)}%</span>
                  </div>
                  <Progress value={transferProgress} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    Processing token {currentTokenIndex + 1} of {tokens.length}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">
                        Successful
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        {transferredTokens.length}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {transferredTokens.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="text-xs"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">
                        Failed
                      </div>
                      <div className="text-xl font-bold text-red-600">
                        {failedTokens.length}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {failedTokens.map((t) => (
                          <Badge
                            key={t}
                            variant="destructive"
                            className="text-xs"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ThirdwebProvider>
  );
};

export default Page;
