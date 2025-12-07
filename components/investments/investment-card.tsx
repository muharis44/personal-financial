"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePrivacy } from "@/contexts/privacy-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TrendingUp, TrendingDown, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Investment } from "@/types"

interface InvestmentCardProps {
  investment: Investment
  onUpdate: () => void
}

export function InvestmentCard({ investment, onUpdate }: InvestmentCardProps) {
  const { maskAmount } = usePrivacy()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const gainLoss = (Number(investment.currentPrice) - Number(investment.buyPrice)) * Number(investment.quantity)
  const gainLossPercentage = ((Number(investment.currentPrice) - Number(investment.buyPrice)) / Number(investment.buyPrice)) * 100
  const currentValue = Number(investment.currentPrice) * Number(investment.quantity)

  const handleEdit = () => {
    toast.info("Fitur update harga akan segera tersedia")
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/investments/${investment.id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        toast.success("Investasi berhasil dihapus")
        onUpdate()
      } else {
        const data = await res.json()
        toast.error(data.error || "Gagal menghapus investasi")
      }
    } catch (error) {
      console.error("Error deleting investment:", error)
      toast.error("Terjadi kesalahan saat menghapus investasi")
    }
    setShowDeleteDialog(false)
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{investment.name}</h3>
            {investment.symbol && (
              <Badge variant="outline">{investment.symbol}</Badge>
            )}
          </div>
          <Badge>{investment.type}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Nilai Sekarang</span>
          <span className="font-semibold">
            {maskAmount(`${investment.currency} ${currentValue.toLocaleString('id-ID')}`)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Gain/Loss</span>
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {maskAmount(`${gainLoss >= 0 ? '+' : ''}${investment.currency} ${Math.abs(gainLoss).toLocaleString('id-ID')}`)}
            </span>
            {gainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Return</span>
          <span className={`font-semibold ${gainLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%
          </span>
        </div>

        <div className="pt-3 border-t grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Harga Beli</p>
            <p className="font-medium">{maskAmount(`${investment.currency} ${Number(investment.buyPrice).toLocaleString('id-ID')}`)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Qty</p>
            <p className="font-medium">{Number(investment.quantity)}</p>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Investasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus investasi <span className="font-semibold">{investment.name}</span>? Tindakan ini tidak dapat dibatalkan.
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
  )
}
