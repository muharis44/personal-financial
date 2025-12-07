"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePrivacy } from "@/contexts/privacy-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import type { Account } from "@/types";

interface AccountCardProps {
  account: Account;
  icon: React.ReactNode;
  onUpdate: () => void;
  onEdit: (account: Account) => void;
}

export function AccountCard({ account, icon, onUpdate, onEdit }: AccountCardProps) {
  const { maskAmount } = usePrivacy();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/accounts/${account.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Akun berhasil dihapus");
        onUpdate();
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menghapus akun");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Terjadi kesalahan saat menghapus akun");
    }
    setShowDeleteDialog(false);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'cash': 'Tunai',
      'bank': 'Bank',
      'e-wallet': 'E-Wallet',
      'credit-card': 'Kartu Kredit'
    };
    return labels[type] || type;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: `${account.color}20`,
            color: account.color,
          }}
        >
          {icon}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(account)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <h3 className="font-semibold text-lg mb-2">{account.name}</h3>
      <Badge variant="secondary" className="mb-3">
        {getTypeLabel(account.type)}
      </Badge>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">Saldo</p>
        <p className="text-2xl font-bold">
          {maskAmount(`${account.currency} ${Number(account.balance).toLocaleString("id-ID")}`)}
        </p>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Akun</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus akun <span className="font-semibold">{account.name}</span>? Semua transaksi terkait akun ini akan terpengaruh.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
