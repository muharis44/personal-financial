"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Wallet,
  CreditCard,
  Smartphone,
  Banknote,
  ArrowLeftRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AccountCard } from "@/components/accounts/account-card";
import { AccountTransferDialog } from "@/components/accounts/account-transfer-dialog";
import { toast } from "sonner";
import type { Account } from "@/types";

const ACCOUNT_TYPES = [
  { value: "cash", label: "Uang Tunai" },
  { value: "bank", label: "Rekening Bank" },
  { value: "e-wallet", label: "E-Wallet" },
  { value: "credit-card", label: "Kartu Kredit" },
];

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export default function AccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "cash",
    balance: "0",
    currency: "IDR",
    color: "#10b981",
    icon: "Wallet",
  });

  const loadAccounts = async () => {
    if (!user) return;

    try {
      const res = await fetch(`/api/accounts?userId=${user.id}`);
      const data = await res.json();
      setAccounts(data.accounts || []);
      setTotalBalance(data.totalBalance || 0);
    } catch (error) {
      console.error("Error loading accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [user]);

  useEffect(() => {
    if (editingAccount) {
      setFormData({
        name: editingAccount.name,
        type: editingAccount.type,
        balance: editingAccount.balance.toString(),
        currency: editingAccount.currency,
        color: editingAccount.color,
        icon: editingAccount.icon,
      });
      setIsFormOpen(true);
    }
  }, [editingAccount]);

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditingAccount(null);
      setFormData({
        name: "",
        type: "cash",
        balance: "0",
        currency: "IDR",
        color: "#10b981",
        icon: "Wallet",
      });
    }
    setIsFormOpen(open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const url = editingAccount
        ? `/api/accounts/${editingAccount.id}`
        : "/api/accounts";
      const method = editingAccount ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
          balance: parseFloat(formData.balance) || 0,
        }),
      });

      if (res.ok) {
        toast.success(
          editingAccount
            ? "Akun berhasil diupdate"
            : "Akun berhasil ditambahkan"
        );
        loadAccounts();
        setIsFormOpen(false);
        setTimeout(() => {
          setEditingAccount(null);
          setFormData({
            name: "",
            type: "cash",
            balance: "0",
            currency: "IDR",
            color: "#10b981",
            icon: "Wallet",
          });
        }, 100);
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menyimpan akun");
      }
    } catch (error) {
      console.error("Error saving account:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTransferOpen = (open: boolean) => {
    setIsTransferOpen(open);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <CreditCard className="h-5 w-5" />;
      case "e-wallet":
        return <Smartphone className="h-5 w-5" />;
      case "credit-card":
        return <CreditCard className="h-5 w-5" />;
      default:
        return <Wallet className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Akun & Dompet</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Kelola rekening bank, e-wallet, dan uang cash
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Dialog open={isTransferOpen} onOpenChange={handleTransferOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Transfer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transfer Antar Akun</DialogTitle>
              </DialogHeader>
              <AccountTransferDialog
                key={isTransferOpen ? "open" : "closed"}
                accounts={accounts}
                onSuccess={() => {
                  setIsTransferOpen(false);
                  loadAccounts();
                }}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isFormOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Akun
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAccount ? "Edit Akun" : "Tambah Akun Baru"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Akun</Label>
                  <Input
                    id="name"
                    placeholder="Contoh: BCA, GoPay, Cash"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipe Akun</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe akun" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="balance">Saldo Awal</Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={formData.balance}
                    onChange={(e) =>
                      setFormData({ ...formData, balance: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Warna</Label>
                  <div className="flex gap-2 mt-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color
                            ? "border-foreground"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving
                    ? "Menyimpan..."
                    : editingAccount
                    ? "Update Akun"
                    : "Simpan Akun"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Banknote className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Saldo (IDR)</p>
            <h2 className="text-3xl font-bold">
              Rp {totalBalance.toLocaleString("id-ID")}
            </h2>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-5 w-24 mb-3" />
              <div className="mt-4">
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-8 w-40" />
              </div>
            </Card>
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <Card className="p-12 text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Belum ada akun</h3>
          <p className="text-muted-foreground mb-4">
            Tambahkan akun pertama Anda untuk mulai tracking keuangan
          </p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Akun Pertama
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              icon={getAccountIcon(account.type)}
              onUpdate={loadAccounts}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
