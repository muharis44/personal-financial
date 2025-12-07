import { TransactionList } from "@/components/transactions/transaction-list";

export default function TransactionsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Transaksi</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Kelola semua transaksi pemasukan dan pengeluaran Anda
        </p>
      </div>
      <TransactionList />
    </div>
  );
}
