"use client";

import { Plane, ArrowRightLeft } from "lucide-react";
import { Counter } from "@/lib/Counter";

interface TransitRulesStatsProps {
  stats?: {
    totalRules: number;
    requiredCount: number;
    freeVisaCount: number;
    conditionalCount: number;
  };
}

export default function TransitRulesStats({ stats }: TransitRulesStatsProps) {
  const cards = [
    {
      title: "Transit Rules",
      value: stats?.totalRules || 0,
      icon: Plane,
      valueColor: "text-gray-900",
    },
    {
      title: "Visa Required",
      value: stats?.requiredCount || 0,
      icon: ArrowRightLeft,
      valueColor: "text-red-500",
    },
    {
      title: "Free Visa",
      value: stats?.freeVisaCount || 0,
      icon: Plane,
      valueColor: "text-green-500",
    },
    {
      title: "Conditional Visa",
      value: stats?.conditionalCount || 0,
      icon: ArrowRightLeft,
      valueColor: "text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="
              rounded-2xl p-5 relative
              bg-[#1A73E80D]
              border border-[#1A73E833]
            "
          >
            {/* Icon box */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-indigo-900 rounded-xl flex items-center justify-center">
              <Icon className="text-white w-5 h-5" />
            </div>

            {/* Title */}
            <p className="text-gray-600 text-sm mb-3">{card.title}</p>

            {/* Value */}
            <div className={`text-4xl font-bold ${card.valueColor} flex items-center gap-1`}>
              <Counter value={card.value} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
