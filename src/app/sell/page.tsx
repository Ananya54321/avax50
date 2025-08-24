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
import { type PreparedTransaction, prepareTransaction } from "thirdweb";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { privateKeyToAccount } from "thirdweb/wallets/private-key";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, DollarSign } from "lucide-react";

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
  const [isSelling, setIsSelling] = useState(false);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [currentProcessingToken, setCurrentProcessingToken] =
    useState<string>("");
  const [sellPhase, setSellPhase] = useState<
    "idle" | "preparing" | "transferring" | "completing" | "done"
  >("idle");
  const [customPercentage, setCustomPercentage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      const price = token.priceUsd || 0;
      total += amount * price;
    }
    setTotalUsd(total);
  }, [sellAmounts, balances]);

  useEffect(() => {
    fetchAvaxPrice();
  }, []);

  async function fetchBalances() {
    if (!account?.address) return;

    setIsLoadingBalances(true);
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
    setIsLoadingBalances(false);
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

    setIsSelling(true);
    setSellPhase("preparing");
    setTransferProgress(0);
    setCurrentTokenIndex(0);
    setTransferredTokens([]);
    setFailedTokens([]);
    setCurrentProcessingToken("");

    const walletTo = process.env.NEXT_PUBLIC_FAT_WALLLET_ADDRESS!;
    if (!walletTo) {
      toast.error("❌ Missing destination wallet address");
      setIsSelling(false);
      setSellPhase("idle");
      return;
    }

    const preparedTxs: PreparedTransaction[] = [];
    const tokensToProcess = tokens.filter((token) => {
      const amount = sellAmounts[token.contractAddress];
      return amount && amount > 0;
    });

    if (tokensToProcess.length === 0) {
      toast.error("Please select tokens to sell");
      setIsSelling(false);
      setSellPhase("idle");
      return;
    }

    setSellPhase("transferring");
    toast.info(`Preparing ${tokensToProcess.length} token transfers...`);

    for (let i = 0; i < tokensToProcess.length; i++) {
      const token = tokensToProcess[i];
      const amount = sellAmounts[token.contractAddress];

      setCurrentTokenIndex(i);
      setCurrentProcessingToken(token.symbol);

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
        setTransferProgress(((i + 1) / tokensToProcess.length) * 50); // 50% for preparation
      } catch (err) {
        console.error(`❌ Failed to prepare ${token.symbol}:`, err);
        setFailedTokens((prev) => [...prev, token.symbol]);
        toast.error(`Failed to prepare ${token.symbol}, continuing...`);
        setTransferProgress(((i + 1) / tokensToProcess.length) * 50);
      }
    }

    setSellPhase("completing");
    setCurrentProcessingToken("Executing batch transaction...");

    try {
      const { transactionHash } = await sendBatchTransaction({
        transactions: preparedTxs,
        account,
      });

      setTransferProgress(75);
      console.log(transactionHash);
      toast.success("Token transfers completed!");

      if (transactionHash && totalUsd > 0 && avaxPrice > 0) {
        setCurrentProcessingToken("Sending AVAX payment...");
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
          toast.success("✅ AVAX payment sent successfully!");
          setTransferProgress(100);
        } else {
          toast.error("❌ AVAX payment failed");
          setTransferProgress(90);
        }
      } else {
        setTransferProgress(100);
      }

      setSellPhase("done");
      setTimeout(() => {
        setSellPhase("idle");
        setTransferProgress(0);
        setCurrentProcessingToken("");
        // Refresh balances after successful sale
        fetchBalances();
      }, 3000);
    } catch (err) {
      console.error("❌ Failed to send batch transaction:", err);
      toast.error("Transaction failed. Please try again.");
      setSellPhase("idle");
    } finally {
      setIsSelling(false);
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

  const getPhaseDescription = () => {
    switch (sellPhase) {
      case "preparing":
        return "Preparing transactions...";
      case "transferring":
        return "Processing token transfers...";
      case "completing":
        return "Finalizing transactions...";
      case "done":
        return "All transactions completed!";
      default:
        return "";
    }
  };

  const handleCustomPercentage = () => {
    const val = Number(customPercentage);
    if (val >= 0 && val <= 100) {
      applyMasterPercentage(val);
      setIsDialogOpen(false);
      setCustomPercentage("");
    } else {
      toast.error("Please enter a valid percentage between 0 and 100");
    }
  };

  const getTokenStatusIcon = (tokenSymbol: string) => {
    if (transferredTokens.includes(tokenSymbol)) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (failedTokens.includes(tokenSymbol)) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    if (currentProcessingToken === tokenSymbol && isSelling) {
      return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
    }
    return null;
  };

  return (
    <ThirdwebProvider>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="border border-gray-700 p-6">
              <p className="text-2xl font-bold">Sell Tokens</p>
              <p className="pb-6">
                Transfer your tokens to the master wallet in one go
              </p>

            <CardContent className="space-y-6">
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div className="text-lg font-semibold">
                    Estimated USD: ${totalUsd.toFixed(2)}
                  </div>
                </div>
                {avaxPrice > 0 && (
                  <div className="text-md text-muted-foreground ml-7">
                    ≈ {(totalUsd / avaxPrice).toFixed(4)} AVAX
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={sellTokens}
                  disabled={
                    isSelling ||
                    isLoadingBalances ||
                    !account?.address ||
                    totalUsd === 0
                  }
                  className="w-[30%] rounded-md h-12 text-lg font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
                >
                {isSelling ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {getPhaseDescription()}
                  </div>
                ) : isLoadingBalances ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Fetching balances...
                  </div>
                ) : (
                  "Sell Selected Tokens"
                )}
              </Button>
              </div>

              <div className="flex flex-wrap gap-4 ">
                {[25, 50, 100].map((p) => (
                  <Button
                    key={p}
                    onClick={() => applyMasterPercentage(p)}
                    disabled={isLoadingBalances || isSelling}
                    variant="outline"
                    className="transition-all duration-200"
                  >
                    {p}%
                  </Button>
                ))}
                <Button
                  variant="outline"
                  disabled={isLoadingBalances || isSelling}
                  className="transition-all duration-200 bg-transparent"
                  onAbort={() => setIsDialogOpen(false)}
                  onClick={() => setIsDialogOpen(true)}
                >
                  Custom %
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent className="sm:max-w-[425px] p-6">
                    {/* Close Button */}
                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 rounded-full"
                      ></Button>
                    </DialogClose>

                    <DialogHeader>
                      <DialogTitle>Custom Percentage</DialogTitle>
                      <DialogDescription>
                        Enter a custom percentage (0–100) to apply to all token
                        balances.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="percentage" className="text-right">
                          Percentage
                        </Label>
                        <Input
                          id="percentage"
                          type="number"
                          min="0"
                          max="100"
                          value={customPercentage}
                          onChange={(e) => setCustomPercentage(e.target.value)}
                          className="col-span-3"
                          placeholder="Enter 0-100"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      onClick={handleCustomPercentage}
                      className="w-full"
                    >
                      Apply Percentage
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator />

              <div className="border border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Token</TableHead>
                      <TableHead className="w-[50%]">Token</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: Math.ceil(tokens.length / 2) }).map(
                      (_, rowIndex) => {
                        const leftToken = tokens[rowIndex * 2];
                        const rightToken = tokens[rowIndex * 2 + 1];

                        return (
                          <TableRow key={rowIndex}>
                            <TableCell className="p-4">
                              {leftToken && (
                                <div
                                  className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                                    currentProcessingToken ===
                                      leftToken.symbol && isSelling
                                      ? "bg-blue-50 ring-2 ring-blue-200"
                                      : "bg-muted/30"
                                  }`}
                                >
                                  <div className="relative">
                                    <img
                                      src={leftToken.url || "/placeholder.svg"}
                                      alt={leftToken.tokenName}
                                      className="w-10 h-10 rounded-full"
                                    />
                                    <div className="absolute -top-1 -right-1">
                                      {getTokenStatusIcon(leftToken.symbol)}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm truncate">
                                      {leftToken.tokenName} ({leftToken.symbol})
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Balance:{" "}
                                      {isLoadingBalances ? (
                                        <Loader2 className="w-3 h-3 animate-spin inline" />
                                      ) : (
                                        (
                                          balances[leftToken.contractAddress] ??
                                          0
                                        ).toFixed(4)
                                      )}
                                    </div>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={
                                        balances[leftToken.contractAddress] ?? 0
                                      }
                                      value={
                                        sellAmounts[
                                          leftToken.contractAddress
                                        ] ?? 0
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          leftToken.contractAddress,
                                          e.target.value
                                        )
                                      }
                                      disabled={isLoadingBalances || isSelling}
                                      className="mt-2 h-8 text-sm"
                                      placeholder="Amount to sell"
                                    />
                                  </div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="p-4">
                              {rightToken && (
                                <div
                                  className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                                    currentProcessingToken ===
                                      rightToken.symbol && isSelling
                                      ? "bg-blue-50 ring-2 ring-blue-200"
                                      : "bg-muted/30"
                                  }`}
                                >
                                  <div className="relative">
                                    <img
                                      src={rightToken.url || "/placeholder.svg"}
                                      alt={rightToken.tokenName}
                                      className="w-10 h-10 rounded-full"
                                    />
                                    <div className="absolute -top-1 -right-1">
                                      {getTokenStatusIcon(rightToken.symbol)}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm truncate">
                                      {rightToken.tokenName} (
                                      {rightToken.symbol})
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Balance:{" "}
                                      {isLoadingBalances ? (
                                        <Loader2 className="w-3 h-3 animate-spin inline" />
                                      ) : (
                                        (
                                          balances[
                                            rightToken.contractAddress
                                          ] ?? 0
                                        ).toFixed(4)
                                      )}
                                    </div>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={
                                        balances[rightToken.contractAddress] ??
                                        0
                                      }
                                      value={
                                        sellAmounts[
                                          rightToken.contractAddress
                                        ] ?? 0
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          rightToken.contractAddress,
                                          e.target.value
                                        )
                                      }
                                      disabled={isLoadingBalances || isSelling}
                                      className="mt-2 h-8 text-sm"
                                      placeholder="Amount to sell"
                                    />
                                  </div>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </div>

            </CardContent>
          </div>
        </div>
      </div>
    </ThirdwebProvider>
  );
};

export default Page;
