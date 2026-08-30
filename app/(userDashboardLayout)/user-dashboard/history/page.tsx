"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Loader, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation";
import { useGetAiHistoryQuery, useDeleteAiHistoryMutation } from "@/lib/features/ai/aiApi";
import { toast } from "sonner";
import { TAiHistory } from "@/lib/types";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const HistoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data: historyResponse, isLoading, isError } = useGetAiHistoryQuery({ page: currentPage, limit: itemsPerPage });
  const [deleteAiHistory, { isLoading: isDeleting }] = useDeleteAiHistoryMutation();
  const route = useRouter();

  const historyData = historyResponse?.data || [];
  const meta = historyResponse?.meta || { page: 1, totalPage: 1 };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteAiHistory(id).unwrap();
      if (res.success) {
        toast.success(res.message || "Record deleted successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete record");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader className="h-10 w-10 animate-spin text-[#77AEE1]" />
        <p className="text-slate-500 font-medium font-outfit">Loading your travel history...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <p className="text-red-500 font-medium">Failed to load travel history. Please try again later.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-[#2E3374] text-white rounded-lg hover:bg-[#1a1e4d] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 m-6">
        <div className="bg-white p-6 rounded-full shadow-sm mb-4">
          <Eye size={40} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No history found</h3>
        <p className="text-slate-500 max-w-sm mb-6">
          You haven't performed any travel analyses yet. Start exploring now!
        </p>
        <button 
          onClick={() => route.push("/user-dashboard")}
          className="px-8 py-3 bg-[#77AEE1] text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
        >
          Start New Search
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 min-h-full">
      <div className="rounded-xl border border-slate-100 shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-50">
              <TableHead className="text-slate-600 font-bold py-6 px-8 text-base">Journey</TableHead>
              <TableHead className="text-slate-600 font-bold text-center text-base">Visa Category</TableHead>
              <TableHead className="text-slate-600 font-bold text-center text-base">Route Pattern</TableHead>
              <TableHead className="text-slate-600 font-bold text-center text-base">Search Date</TableHead>
              <TableHead className="text-slate-600 font-bold text-right px-8 text-base">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyData.map((item: TAiHistory) => (
              <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50/30 transition-all duration-200">
                <TableCell className="font-semibold py-6 px-8 text-slate-700 text-base">
                  <div className="flex flex-col">
                    <span>{item.originCity} → {item.destinationCity}</span>
                    <span className="text-[10px] text-slate-400 font-normal uppercase tracking-wider">
                      {item.originAirport} to {item.destinationAirport}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center text-slate-600 font-medium text-base">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                    {item.visaType}
                  </span>
                </TableCell>
                <TableCell className="text-center text-slate-600 font-medium text-base">
                  {item.routeTitle}
                </TableCell>
                <TableCell className="text-center text-slate-600 font-medium text-base">
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => route.push(`/user-dashboard/history/${item.id}`)}
                      className="p-2 text-slate-400 hover:text-[#77AEE1] hover:bg-blue-50 rounded-xl transition-all" 
                      title="View Details"
                    >
                      <Eye size={20} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                      title="Delete record"
                    >
                      <Trash2 size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta.totalPage > 1 && (
        <div className="flex justify-center mt-8 pb-10">
          <Pagination>
            <PaginationContent className="bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={`cursor-pointer transition-all hover:bg-slate-50 border-none ${currentPage === 1 ? "opacity-30 pointer-events-none" : "text-[#77AEE1]"}`}
                />
              </PaginationItem>
              
              {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
                    isActive={currentPage === pageNum}
                    className={`cursor-pointer rounded-lg transition-all border-none ${
                      currentPage === pageNum 
                      ? "bg-[#77AEE1] text-white hover:bg-[#77AEE1]/90 hover:text-white shadow-md shadow-blue-200" 
                      : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(meta.totalPage, prev + 1))}
                  className={`cursor-pointer transition-all hover:bg-slate-50 border-none ${currentPage === meta.totalPage ? "opacity-30 pointer-events-none" : "text-[#77AEE1]"}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};


export default HistoryPage;
