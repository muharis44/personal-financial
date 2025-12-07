"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const handleDelete = async () => {
    if (!confirm(`Hapus akun ${account.name}?`)) return;

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
          <Button variant="outline" size="sm" onClick={handleDelete}>
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
          {account.currency} {Number(account.balance).toLocaleString("id-ID")}
        </p>
      </div>
    </Card>
  );
}
