"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import tokens from "@/utils/tokens";
import { Input } from "@/components/ui/input";
import { ThirdwebProvider, useActiveAccount } from "thirdweb/react";
import { prepareTransaction } from "thirdweb";
import { sendAndConfirmTransaction } from "thirdweb";
import { useWalletBalance } from "thirdweb/react";
// Removed Card imports - using custom styled divs instead
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TransactionHistory,
  Transaction,
} from "@/components/feature/TransactionHistory";

import { toast } from "sonner";

import { client } from "../client";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets/private-key";
import { defineChain } from "thirdweb/chains";
import { getBalance } from "thirdweb/extensions/erc20";

const Page = () => {
  const [balance, setBalance] = useState(0);
  const [avaxPrice, setAvaxPrice] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);
  const [avaxAmount, setAvaxAmount] = useState(0);
  const chainId = 43113; 
  const [transferProgress, setTransferProgress] = useState(0);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [transferredTokens, setTransferredTokens] = useState<string[]>([]);
  const [failedTokens, setFailedTokens] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const account = useActiveAccount();
  const { data, isLoading, isError } = useWalletBalance({
    chain: defineChain(chainId),
    address: account?.address,
    client,
  });

  // Fetch AVAX price
  async function fetchAvaxPrice() {
    try {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/coins/avalanche-2",
        {
          headers: { x_cg_demo_api_key: process.env.NEXT_PUBLIC_GECKO_KEY! },
        }
      );
      setAvaxPrice(res.data.market_data.current_price.usd);
    } catch (err) {
      toast.error("Error fetching AVAX price, try again later");
    }
  }
  useEffect(() => {
    if (avaxAmount > 0 && avaxPrice > 0) {
      setUsdAmount(avaxAmount * avaxPrice);
    } else {
      setUsdAmount(0);
    }
  }, [avaxAmount, avaxPrice]);

  useEffect(() => {
    if (isLoading || isError) return;

    if (!data) {
      toast.error("Failed to fetch AVAX balance");
      return;
    }

    setBalance(parseFloat(data.displayValue));
  }, [data, isLoading, isError]);
  // Buy token basket
  async function buyBasket() {
    if (!account || !account.address) {
      return;
    }

    setIsProcessing(true);
    setTransferProgress(0);
    setCurrentTokenIndex(0);
    setTransferredTokens([]);
    setFailedTokens([]);

    try {
      const transaction = prepareTransaction({
        to: "0xB2673DEa091820C1678dcF7052d836D0a816f991",
        chain: defineChain(chainId),
        client: client,
        value: BigInt(avaxAmount * 1e18),
      });
      const transactionReceipt = await sendAndConfirmTransaction({
        account,
        transaction,
      });
      if (!transactionReceipt) throw new Error("AVAX payment failed");

      const wallet = privateKeyToAccount({
        client,
        privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY!,
      });

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        setCurrentTokenIndex(i);

        try {
          const contract = getContract({
            client,
            chain: defineChain(chainId),
            address: token.contractAddress,
          });

          const tokenAmount = BigInt(
            Math.floor(
              ((usdAmount * parseFloat(token.percentage)) /
                100 /
                token.priceUsd) *
                1e18
            )
          );

          const transaction = await prepareContractCall({
            contract,
            method:
              "function transfer(address to, uint256 value) returns (bool)",
            params: [account?.address, tokenAmount],
          });

          const { transactionHash } = await sendAndConfirmTransaction({
            transaction,
            account: wallet,
          });

          const newTransaction: Transaction = {
            id: `${Date.now()}-${i}`,
            tokenSymbol: token.symbol,
            transactionHash,
            timestamp: new Date(),
            status: "success",
          };
          setTransactions((prev) => [newTransaction, ...prev]);

          setTransferredTokens((prev) => [...prev, token.symbol]);
          setTransferProgress(((i + 1) / tokens.length) * 100);
          console.log(`✅ Transferred ${token.symbol}: ${transactionHash}`);
        } catch (err) {
          console.error(`❌ Failed to transfer ${token.symbol}:`, err);
          setFailedTokens((prev) => [...prev, token.symbol]);
          toast.error(`Failed to transfer ${token.symbol}, continuing...`);
          setTransferProgress(((i + 1) / tokens.length) * 100);
        }
      }

      toast.success("Basket purchase process completed!");
    } catch (err) {
      console.error(err);
      toast.error("Error buying basket");
    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    fetchAvaxPrice();
  }, []);

  return (
    <ThirdwebProvider>
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex w-full gap-6">
            <div className="flex-1 bg-card text-card-foreground border border-gray-700 rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Buy AVAX50 Basket</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Exchange AVAX for a diversified basket of 50 tokens
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="avax-input" className="text-sm font-medium">
                    AVAX Amount
                  </label>
                  <Input
                    id="avax-input"
                    placeholder="Enter AVAX amount"
                    min={0}
                    type="number"
                    max={balance}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setAvaxAmount(value);
                    }}
                    value={avaxAmount}
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card text-card-foreground border border-gray-700 rounded-lg shadow-sm p-4">
                    <div className="text-sm text-muted-foreground">
                      USD Value
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${usdAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-card text-card-foreground border border-gray-700 rounded-lg shadow-sm p-4">
                    <div className="text-sm text-muted-foreground">
                      Available Balance
                    </div>
                    <div className="text-2xl font-bold">
                      {balance.toFixed(4)} AVAX
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="mt-16" />

              

              <button
                onClick={buyBasket}
                disabled={
                  isProcessing || avaxAmount <= 0 || avaxAmount > balance
                }
                className="w-full h-12 text-lg bg-red-800 font-semibold"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-1 border-gray-700 border-t-transparent rounded-full animate-spin" />
                    Processing Transfer...
                  </div>
                ) : (
                  "Buy Token Basket"
                )}
              </button>

              {!account ? (
                <div className="text-center text-sm text-muted-foreground">
                  Please connect your wallet to continue
                </div>
              ) : <div className="text-center text-sm text-muted-foreground">
                  Wallet is connected!
                </div>}
            </div>

            </div>
            <div className="flex-1 bg-card text-card-foreground border border-gray-700 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Tokens in Basket</h2>
          <div className="flex flex-wrap gap-4 max-h-96 overflow-y-auto">
            {tokens.map((token) => (
              <div
                key={token.contractAddress}
                className="flex items-center gap-2 bg-background border border-gray-700 rounded-lg px-3 py-2"
              >
                <img
                  src={token.url}
                  alt={token.tokenName}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium">{token.tokenName}</span>
              </div>
            ))}
          </div>
        </div>
          </div>     
          {isProcessing && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Transfer Progress</span>
                      <span>{Math.round(transferProgress)}%</span>
                    </div>
                    <Progress value={transferProgress} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      Processing token {currentTokenIndex + 1} of{" "}
                      {tokens.length}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card text-card-foreground border border-gray-700 rounded-lg shadow-sm p-4">
                      <div className="text-sm text-muted-foreground">
                        Successful
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        {transferredTokens.length}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {transferredTokens.slice(-5).map((token) => (
                          <Badge
                            key={token}
                            variant="secondary"
                            className="text-xs"
                          >
                            {token}
                          </Badge>
                        ))}
                        {transferredTokens.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{transferredTokens.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="bg-card text-card-foreground border border-gray-700 rounded-lg shadow-sm p-4">
                      <div className="text-sm text-muted-foreground">
                        Failed
                      </div>
                      <div className="text-xl font-bold text-red-600">
                        {failedTokens.length}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {failedTokens.slice(-5).map((token) => (
                          <Badge
                            key={token}
                            variant="destructive"
                            className="text-xs"
                          >
                            {token}
                          </Badge>
                        ))}
                        {failedTokens.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{failedTokens.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}     

          <TransactionHistory transactions={transactions} />
        </div>
        
      </div>
    </ThirdwebProvider>
  );
};

export default Page;
