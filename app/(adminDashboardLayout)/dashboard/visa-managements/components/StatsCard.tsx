import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Counter } from "@/lib/Counter";

interface StatsCardProps {
  title: string;
  value: number;
  icon?: LucideIcon;
  valueColor?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  valueColor = "text-green-600 dark:text-green-400",
}: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={`text-4xl font-bold ${valueColor} flex items-center gap-1`}>
            <Counter value={value} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
