import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Counter } from "@/lib/Counter";

export interface StatCardData {
  label: string;
  value: string | number;
  icon: React.ElementType;
}

export default function Stats({ stat }: { stat: StatCardData }) {
  const Icon = stat.icon;
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            <h2 className="text-4xl font-bold mt-2">
              {typeof stat.value === "number" ? (
                <Counter value={stat.value} />
              ) : (
                stat.value
              )}
            </h2>
          </div>
          <div className="h-12 w-12 rounded-lg bg-[#3B4A7D] flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
