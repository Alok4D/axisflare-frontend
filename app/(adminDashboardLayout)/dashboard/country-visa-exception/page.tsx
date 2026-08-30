"use client";

import React, { useState } from "react";
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    RotateCcw,
    Loader2,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Counter } from "@/lib/Counter";
import { toast } from "sonner";
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
} from "@/components/ui/alert-dialog";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useDeleteCountryPolicyMutation,
    useGetCountryPoliciesQuery,
} from "@/lib/features/country-policy/countryPolicyApi";

const CountryVisaExceptionPage = () => {
    // Filter State
    const [filters, setFilters] = useState({
        travelerCountry: "",
        destinationCountry: "",
        visaOutcome: "ALL",
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // API Query
    const queryParams: Record<string, any> = {
        page: currentPage,
        limit: itemsPerPage,
    };

    if (filters.travelerCountry) queryParams.travelerCountry = filters.travelerCountry;
    if (filters.destinationCountry) queryParams.destinationCountry = filters.destinationCountry;
    if (filters.visaOutcome !== "ALL") queryParams.visaOutcome = filters.visaOutcome;

    const { data: response, isLoading, isFetching } = useGetCountryPoliciesQuery(queryParams);
    const [deleteCountryPolicy, { isLoading: isDeleting }] = useDeleteCountryPolicyMutation();

    const policies = response?.data || [];
    const meta = response?.meta;
    const stats = response?.stats;

    // Delete Logic
    const handleDelete = async (id: string) => {
        try {
            await deleteCountryPolicy(id).unwrap();
            toast.success("Exception deleted successfully", {
                description: "The record has been removed from the system.",
            });
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete exception");
        }
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const handleResetFilters = () => {
        setFilters({
            travelerCountry: "",
            destinationCountry: "",
            visaOutcome: "ALL",
        });
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-linear-to from-slate-50 via-white to-blue-50 p-6 md:p-10 space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Country Visa Exceptions
                    </h1>
                    <p className="text-gray-500 mt-2">Manage global rules & overrides for traveler nationalities</p>
                </div>
                <Link href="/dashboard/country-visa-exception/add-country-exception">
                    <Button className="rounded-md bg-[#77AEE1] hover:bg-[#77AEE1]/80 px-10 py-6 text-lg font-medium transition-all hover:scale-105 active:scale-95">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Exception
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { label: "Exceptions", value: stats?.exceptionsDefined || 0 },
                    { label: "Countries", value: stats?.countriesInExceptions || 0 },
                    { label: "Coverage", value: stats?.defaultPolicyCoverage || 0, suffix: "+" },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100 transition-all hover:shadow-md"
                    >
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{s.label}</p>
                        <div className="text-4xl font-bold text-gray-900 mt-2 flex items-baseline gap-1">
                            {isLoading ? (
                                <Loader2 className="w-8 h-8 animate-spin text-blue-200" />
                            ) : (
                                <Counter value={s.value} />
                            )}
                            {s.suffix && <span className="text-2xl opacity-50">{s.suffix}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                    <Search className="w-5 h-5 text-[#77AEE1]" />
                    Filtering & Search
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Traveler Country</label>
                        <Input
                            placeholder="e.g. Bangladesh"
                            value={filters.travelerCountry}
                            onChange={(e) => {
                                setFilters({ ...filters, travelerCountry: e.target.value });
                                setCurrentPage(1);
                            }}
                            className="rounded-xl border-gray-200 focus:ring-[#77AEE1]/20 focus:border-[#77AEE1] transition-all h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Destination Country</label>
                        <Input
                            placeholder="e.g. Thailand"
                            value={filters.destinationCountry}
                            onChange={(e) => {
                                setFilters({ ...filters, destinationCountry: e.target.value });
                                setCurrentPage(1);
                            }}
                            className="rounded-xl border-gray-200 focus:ring-[#77AEE1]/20 focus:border-[#77AEE1] transition-all h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Visa Outcome</label>
                        <Select
                            value={filters.visaOutcome}
                            onValueChange={(value) => {
                                setFilters({ ...filters, visaOutcome: value });
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="rounded-xl border-gray-200 focus:ring-[#77AEE1]/20 focus:border-[#77AEE1] transition-all h-12">
                                <SelectValue placeholder="All Outcomes" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                <SelectItem value="ALL">All Outcomes</SelectItem>
                                <SelectItem value="VISA_REQUIRED">Visa Required</SelectItem>
                                <SelectItem value="VISA_NOT_REQUIRED">Visa Not Required</SelectItem>
                                <SelectItem value="SPECIAL">Special</SelectItem>
                                <SelectItem value="ELECTRONIC">Electronic</SelectItem>
                                <SelectItem value="ON_ARRIVAL">On Arrival</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button
                            variant="ghost"
                            onClick={handleResetFilters}
                            className="w-full rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all gap-2 h-12"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm relative">
                    {(isLoading || isFetching) && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                            <Loader2 className="w-10 h-10 animate-spin text-[#77AEE1]" />
                        </div>
                    )}
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent border-b border-gray-100">
                                <TableHead className="py-5 px-6 text-gray-600 font-bold uppercase text-[11px] tracking-widest">Traveler Country</TableHead>
                                <TableHead className="py-5 px-6 text-gray-600 font-bold uppercase text-[11px] tracking-widest">Destination</TableHead>
                                <TableHead className="py-5 px-6 text-gray-600 font-bold uppercase text-[11px] tracking-widest">Purpose</TableHead>
                                <TableHead className="text-center py-5 px-6 text-gray-600 font-bold uppercase text-[11px] tracking-widest">Outcome</TableHead>
                                <TableHead className="py-5 px-6 text-gray-600 font-bold uppercase text-[11px] tracking-widest">Visa Type</TableHead>
                                <TableHead className="py-5 px-6 text-gray-600 font-bold uppercase text-[11px] tracking-widest">Max Stay</TableHead>
                                <TableHead className="py-5 px-6 text-gray-600 font-bold uppercase text-[11px] tracking-widest">Notice</TableHead>
                                <TableHead className="text-right py-5 px-6 text-gray-600 font-bold uppercase text-[11px] tracking-widest">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {policies.length > 0 ? (
                                policies.map((row) => (
                                    <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors border-b border-gray-50 last:border-0 group">
                                        <TableCell className="font-semibold text-gray-900 py-5 px-6">
                                            {row.travelerCountry}
                                        </TableCell>
                                        <TableCell className="py-5 px-6 text-gray-700">{row.destinationCountry}</TableCell>
                                        <TableCell className="py-5 px-6">
                                            <Badge variant="outline" className="rounded-lg bg-blue-50/50 text-blue-600 border-blue-100 font-medium px-2 py-0.5">
                                                {row.travelPurpose}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-center py-5 px-6">
                                            <Badge
                                                className={`rounded-full px-3 py-1 font-semibold text-[10px] uppercase tracking-wider ${row.visaOutcome === "VISA_NOT_REQUIRED"
                                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                                    : row.visaOutcome === "SPECIAL"
                                                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                                        : row.visaOutcome === "VISA_REQUIRED"
                                                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                                    }`}
                                            >
                                                {row.visaOutcome.replace(/_/g, " ")}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="py-5 px-6 font-medium text-gray-600">{row.visaType || "—"}</TableCell>
                                        <TableCell className="py-5 px-6 text-gray-500">{row.maxStayDuration || "—"}</TableCell>
                                        <TableCell className="py-5 px-6 max-w-[220px]">
                                            <p className="text-gray-400 text-sm truncate leading-relaxed" title={row.notesConditions}>
                                                {row.notesConditions}
                                            </p>
                                        </TableCell>

                                        <TableCell className="text-right py-5 px-6">
                                            <div className="flex justify-end gap-1">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <button className="p-2.5 rounded-xl hover:bg-rose-50 text-rose-500 transition-all hover:scale-110 active:scale-90">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-3xl bg-white border-0 shadow-2xl p-8">
                                                        <AlertDialogHeader>
                                                            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
                                                                <Trash2 className="w-8 h-8 text-rose-500" />
                                                            </div>
                                                            <AlertDialogTitle className="text-2xl font-bold text-gray-900">
                                                                Confirm Deletion
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="text-gray-500 text-lg">
                                                                Are you sure you want to remove the visa rules for <span className="text-gray-900 font-semibold">{row.travelerCountry}</span> to <span className="text-gray-900 font-semibold">{row.destinationCountry}</span>?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="mt-8 gap-3">
                                                            <AlertDialogCancel className="rounded-2xl border-gray-100 text-gray-500 hover:bg-gray-50 px-8 py-6 h-auto transition-all">
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(row.id)}
                                                                className="bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-200 transition-all active:scale-95 px-8 py-6 h-auto"
                                                            >
                                                                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete Permanently"}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                <Link href={`/dashboard/country-visa-exception/${row?.id}`}>
                                                    <button className="p-2.5 rounded-xl hover:bg-blue-50 text-blue-600 transition-all hover:scale-110 active:scale-90">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-64 text-center">
                                        {isLoading || isFetching ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-16 h-16 rounded-full border-4 border-blue-50 border-t-[#77AEE1] animate-spin"></div>
                                                    <Loader2 className="w-6 h-6 animate-spin text-[#77AEE1] absolute inset-0 m-auto" />
                                                </div>
                                                <p className="text-gray-400 font-medium">Loading policies...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                                                <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                                                    <AlertCircle className="w-10 h-10 text-slate-300" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-gray-900 font-bold text-lg">No Exceptions Found</p>
                                                    <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    onClick={handleResetFilters}
                                                    className="mt-2 rounded-xl border-gray-200 text-gray-500 hover:bg-slate-50 transition-all"
                                                >
                                                    Clear All Filters
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {meta && meta.totalPage > 1 && (
                    <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-6 px-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 px-4 rounded-xl bg-white border border-gray-100 flex items-center text-sm text-gray-500 shadow-sm">
                                Showing <span className="font-bold text-gray-900 mx-1.5">{(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-bold text-gray-900 ml-1.5">{meta.total}</span>
                            </div>
                        </div>
                        <Pagination className="justify-end w-auto mx-0">
                            <PaginationContent className="gap-2">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); if (currentPage > 1) goToPage(currentPage - 1); }}
                                        className={`${currentPage === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"} rounded-xl border-gray-100 bg-white hover:bg-gray-50 transition-all h-10 px-4`}
                                    />
                                </PaginationItem>

                                {[...Array(meta.totalPage)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === i + 1}
                                            onClick={(e) => { e.preventDefault(); goToPage(i + 1); }}
                                            className={`${currentPage === i + 1 
                                                ? "bg-[#77AEE1] hover:bg-[#77AEE1]/90 text-white border-[#77AEE1] shadow-lg shadow-blue-100" 
                                                : "bg-white hover:bg-gray-50 text-gray-500 border-gray-100"
                                            } cursor-pointer rounded-xl transition-all h-10 w-10 font-bold`}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); if (currentPage < meta.totalPage) goToPage(currentPage + 1); }}
                                        className={`${currentPage === meta.totalPage ? "pointer-events-none opacity-40" : "cursor-pointer"} rounded-xl border-gray-100 bg-white hover:bg-gray-50 transition-all h-10 px-4`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CountryVisaExceptionPage;
