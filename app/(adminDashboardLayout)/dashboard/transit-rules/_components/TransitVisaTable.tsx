"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { useDeleteTransitRuleMutation } from "@/lib/features/transit/transitApi"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { TTransitRule } from "@/lib/types"

interface TransitVisaTableProps {
  activeFilter: string;
  rules: TTransitRule[];
  isLoading?: boolean;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

const TransitVisaTable = ({ 
  activeFilter, 
  rules, 
  isLoading, 
  meta, 
  currentPage, 
  onPageChange, 
  itemsPerPage 
}: TransitVisaTableProps) => {
  const [deleteTransitRule, { isLoading: isDeleting }] = useDeleteTransitRuleMutation();

  const filteredData = rules.filter((item) => {
    if (activeFilter === "All Rules") return true;

    // Mapping UI filter to API values
    const apiRequirement = activeFilter.toUpperCase().replace(" ", "_");
    return item.requirement === apiRequirement;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteTransitRule(id).unwrap();
      toast.success("Transit rule deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete transit rule");
    }
  };

  const getBadgeContent = (req: string) => {
    switch (req) {
      case "REQUIRED": return "Required";
      case "NOT_REQUIRED": return "Not Required";
      case "CONDITIONAL": return "Conditional";
      default: return req;
    }
  };

  const totalItems = meta?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const goToPage = (page: number) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    onPageChange(targetPage);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-gray-100">
            <TableHead className="text-[#333333] font-medium py-8 px-10 text-xl w-[25%] transition-none border-b border-gray-50">Traveler Nationality</TableHead>
            <TableHead className="text-[#333333] font-medium text-xl w-[20%] transition-none border-b border-gray-50">Transit Country</TableHead>
            <TableHead className="text-[#333333] font-medium text-xl w-[15%] transition-none text-center border-b border-gray-50">Requirement</TableHead>
            <TableHead className="text-[#333333] font-medium text-xl w-[30%] transition-none border-b border-gray-50">Conditions Summary</TableHead>
            <TableHead className="text-[#333333] font-medium text-xl w-[10%] transition-none border-b border-gray-50 text-right pr-10">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5} className="py-8">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                </TableCell>
              </TableRow>
            ))
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <TableRow key={index} className="border-gray-50 hover:bg-gray-50/20 transition-all duration-200 group">
                <TableCell className="py-10 px-10 font-medium text-[#4D4D4D] text-lg">{item.travelerCountry}</TableCell>
                <TableCell className="text-[#4D4D4D] text-lg py-10">{item.transitCountry}</TableCell>
                <TableCell className="text-center py-10">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "border-none px-6 py-2 rounded-full font-medium active:scale-95 transition-all outline-none focus:ring-0 text-sm whitespace-nowrap",
                      item.requirement === "REQUIRED" ? "bg-[#FDF2F2] text-[#EC5962] hover:bg-[#FDF2F2]" :
                        item.requirement === "NOT_REQUIRED" ? "bg-[#EAF9F1] text-[#2D9B63] hover:bg-[#EAF9F1]" :
                          "bg-[#FFF8E6] text-[#F3B72B] hover:bg-[#FFF8E6]"
                    )}
                  >
                    {getBadgeContent(item.requirement)}
                  </Badge>
                </TableCell>
                <TableCell className="py-10">
                  <div className="space-y-3">
                    <p className="text-[#4D4D4D] font-normal text-lg">{item.maxLayoverDuration} • {item.conditions}</p>
                    {item.notes && (
                      <p className="text-[#999999] text-xs leading-relaxed max-w-sm font-normal">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-10 pr-10 text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-[#EC5962] hover:text-[#EC5962] hover:bg-[#FDF2F2] rounded-full transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl border-none shadow-2xl p-8">
                      <AlertDialogHeader className="space-y-4">
                        <AlertDialogTitle className="text-2xl font-bold text-[#333333]">
                          Delete Transit Rule?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[#666666] text-lg leading-relaxed">
                          Are you sure you want to delete this rule for <strong>{item.travelerCountry}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-8 gap-3">
                        <AlertDialogCancel className="rounded-xl border-gray-100 text-[#666666] font-medium h-12 px-6">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="rounded-xl bg-[#EC5962] hover:bg-[#D43F48] text-white font-medium h-12 px-6 shadow-sm"
                        >
                          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Rule"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="py-24 text-center text-gray-400 font-medium text-xl">
                No rules found for "{activeFilter}"
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {!isLoading && totalItems > itemsPerPage && (
        <div className="px-10 py-6 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-base text-[#999999]">
            Showing <span className="font-medium text-[#4D4D4D]">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-[#4D4D4D]">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-medium text-[#4D4D4D]">{totalItems}</span> rules
          </p>
          <Pagination className="w-auto ml-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => goToPage(currentPage - 1)}
                  className={cn(
                    "cursor-pointer hover:bg-gray-50 rounded-lg transition-colors",
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => goToPage(page)}
                        className={cn(
                          "cursor-pointer rounded-lg transition-all",
                          currentPage === page ? "bg-[#1C1F37] text-white hover:bg-[#1C1F37] hover:text-white" : "hover:bg-gray-50 text-[#4D4D4D]"
                        )}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => goToPage(currentPage + 1)}
                  className={cn(
                    "cursor-pointer hover:bg-gray-50 rounded-lg transition-colors",
                    currentPage === totalPages && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default TransitVisaTable;
