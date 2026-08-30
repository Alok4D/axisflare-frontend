"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const filters = ["All Rules", "Required", "Not Required", "Conditional"];

interface TransitRulesToolbarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function TransitRulesToolbar({ activeFilter, onFilterChange }: TransitRulesToolbarProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-100/50 shadow-xs px-10 py-5 flex items-center justify-between">
      <div className="flex items-center gap-12">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={cn(
              "text-lg font-medium transition-all px-8 py-3 rounded-lg whitespace-nowrap",
              activeFilter === filter
                ? "bg-[#91C3F0] hover:bg-[#81B3E0] text-[#2F3375]"
                : "text-[#999999] hover:bg-[#91C3F0]/10 hover:text-[#2F3375]"
            )}
          >
            {filter}
          </button>
        ))}
      </div>


      <Link href="/dashboard/transit-rules/add-transit">
        <Button
          className="bg-[#91C3F0] hover:bg-[#81B3E0] text-[#2F3375] font-semibold rounded-xl px-10 py-7 flex items-center gap-3 shadow-none border-none text-lg transition-all active:scale-95"
        >
          <Plus size={24} className="stroke-[2.5px]" />
          Add Transit Rule
        </Button>
      </Link>
    </div>
  );
}
