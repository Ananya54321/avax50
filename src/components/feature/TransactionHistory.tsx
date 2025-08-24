"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Successful Transactions
        </CardTitle>
        <CardDescription>
          Transaction history for your recent token purchases
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Transaction Hash</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {successfulTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  <Badge variant="secondary">{transaction.tokenSymbol}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {formatHash(transaction.transactionHash)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatTime(transaction.timestamp)}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.transactionHash)}
                      className="h-8 w-8 p-0"
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
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
