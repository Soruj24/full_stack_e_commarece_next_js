import { Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  totalCards: number;
  totalValue: number;
  totalRemaining: number;
}

export function GiftCardsStats({ totalCards, totalValue, totalRemaining }: Props) {
  const utilization = totalValue > 0 ? (((totalValue - totalRemaining) / totalValue) * 100).toFixed(0) : "0";

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard icon={<Gift className="w-6 h-6 text-primary" />} label="Total Cards" value={String(totalCards)} bg="bg-primary/10" />
      <StatCard icon={<span className="text-green-600 font-bold">$</span>} label="Total Value" value={`$${totalValue.toFixed(2)}`} bg="bg-green-100" />
      <StatCard icon={<span className="text-blue-600 font-bold">$</span>} label="Remaining" value={`$${totalRemaining.toFixed(2)}`} bg="bg-blue-100" />
      <StatCard icon={<span className="text-yellow-600 font-bold">%</span>} label="Utilization" value={`${utilization}%`} bg="bg-yellow-100" />
    </div>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center`}>{icon}</div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
