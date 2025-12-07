"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { toast } from "sonner"
import { usePrivacy } from "@/contexts/privacy-context"
import type { SplitBill, SplitBillParticipant } from "@/types"

interface SplitBillWithParticipants extends SplitBill {
  participants: SplitBillParticipant[]
}

interface SplitBillCardProps {
  bill: SplitBillWithParticipants
  onUpdate: () => void
}

export function SplitBillCard({ bill, onUpdate }: SplitBillCardProps) {
  const { maskAmount } = usePrivacy()
  const paidCount = bill.participants.filter(p => p.isPaid).length
  const totalCount = bill.participants.length

  const handleMarkPaid = async (participantId: string) => {
    try {
      const res = await fetch(`/api/split-bills/${bill.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId })
      })

      if (res.ok) {
        toast.success("Peserta ditandai lunas")
        onUpdate()
      } else {
        const data = await res.json()
        toast.error(data.error || "Gagal menandai sebagai lunas")
      }
    } catch (error) {
      console.error("Error marking as paid:", error)
      toast.error("Terjadi kesalahan")
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{bill.title}</h3>
          <p className="text-2xl font-bold">{maskAmount(`Rp ${Number(bill.totalAmount).toLocaleString('id-ID')}`)}</p>
        </div>
        <Badge variant={paidCount === totalCount ? "default" : "secondary"}>
          {paidCount}/{totalCount} Lunas
        </Badge>
      </div>

      <div className="space-y-2">
        {bill.participants.map((participant) => (
          <div
            key={participant.id}
            className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium">{participant.name}</p>
              <p className="text-sm text-muted-foreground">
                {maskAmount(`Rp ${Number(participant.amount).toLocaleString('id-ID')}`)}
              </p>
            </div>
            {participant.isPaid ? (
              <Badge variant="default" className="bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                Lunas
              </Badge>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMarkPaid(participant.id)}
              >
                <X className="h-3 w-3 mr-1" />
                Belum Bayar
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
