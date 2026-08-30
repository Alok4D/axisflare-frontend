"use client";

import { useState, useEffect } from "react";
import TransitRulesStats from "./_components/TransitRulesStats"
import TransitRulesToolbar from "./_components/TransitRulesToolbar"
import TransitVisaTable from "./_components/TransitVisaTable"
import { useGetTransitRulesQuery } from "@/lib/features/transit/transitApi";
import { toast } from "sonner";

const TransitRulesPage = () => {
  const [activeFilter, setActiveFilter] = useState("All Rules");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: transitResponse, isLoading, isError, error } = useGetTransitRulesQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  useEffect(() => {
    if (isError) {
      const err = error as any;
      toast.error(err?.data?.message || "Failed to fetch transit rules");
    }
  }, [isError, error]);

  const rules = transitResponse?.data || [];
  const stats = transitResponse?.stats;
  const meta = transitResponse?.meta;

  return (
    <div className="p-12 bg-[#F9FAFB] min-h-screen space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#1C1F37]">
          Transit Visa Rules
        </h1>
        <p className="text-[#999999] text-lg font-normal">
          Define and manage rules for transit visas across different countries and nationalities.
        </p>
      </div>

      <TransitRulesStats stats={stats} />

      <div className="space-y-8">
        <TransitRulesToolbar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <TransitVisaTable
          activeFilter={activeFilter}
          rules={rules}
          isLoading={isLoading}
          meta={meta}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  )
}

export default TransitRulesPage