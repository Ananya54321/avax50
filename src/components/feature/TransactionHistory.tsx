"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  tokenSymbol: string;
  transactionHash: string;
  timestamp: Date;
  amount?: string;
  status: "success" | "failed";
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      toast.success("Transaction hash copied to clipboard");
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      toast.error("Failed to copy transaction hash");
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  const openInExplorer = (hash: string) => {
    // Avalanche Fuji testnet explorer
    window.open(`https://testnet.snowtrace.io/tx/${hash}`, "_blank");
  };

  // Only render if there are successful transactions
  const successfulTransactions = transactions.filter(
    (tx) => tx.status === "success"
  );

  if (successfulTransactions.length === 0) {
    return null;
  }

  return (
    <div className="bg-card text-card-foreground border border-gray-700 rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Successful Transactions
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Transaction history for your recent token purchases
        </p>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-lg border border-border shadow">
        <table className="w-full border-collapse">
          <thead className="bg-secondary-background">
            <tr>
              <th className="px-4 py-3 text-left">Token</th>
              <th className="px-4 py-3 text-left">Transaction Hash</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {successfulTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-t border-border hover:bg-secondary-background/50 transition"
              >
                {/* Token */}
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="font-semibold">
                    {transaction.tokenSymbol}
                  </Badge>
                </td>

                {/* Transaction Hash */}
                <td className="px-4 py-3 font-mono text-sm">
                  {formatHash(transaction.transactionHash)}
                </td>

                {/* Time */}
                <td className="px-4 py-3 text-sm text-foreground/60">
                  {formatTime(transaction.timestamp)}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      transaction.status === "success" ? "default" : "destructive"
                    }
                    className={
                      transaction.status === "success"
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : ""
                    }
                  >
                    {transaction.status === "success" ? "Success" : "Failed"}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.transactionHash)}
                      className="h-8 w-8 p-0 hover:bg-secondary-background"
                    >
                      {copiedHash === transaction.transactionHash ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openInExplorer(transaction.transactionHash)}
                      className="h-8 w-8 p-0 hover:bg-secondary-background"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
