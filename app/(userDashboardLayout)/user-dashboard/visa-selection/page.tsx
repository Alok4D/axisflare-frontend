"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useGetVisasQuery } from "@/lib/features/visa/visaApi";
import { TAirport, TVisaType } from "@/lib/types";
import worldCountries from "world-countries";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VisaSelection() {
    const [selectedVisaId, setSelectedVisaId] = useState("");
    const [destinationCountry, setDestinationCountry] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState("All Category");
    const [selectedAirport, setSelectedAirport] = useState<TAirport | null>(null);
    
    // Load destination from localStorage
    useEffect(() => {
        const savedDestination = localStorage.getItem("selectedDestinationAirport");
        if (savedDestination) {
            try {
                const airport: TAirport = JSON.parse(savedDestination);
                setSelectedAirport(airport);
                
                // Get full country name for API call and display
                const fullCountryName = worldCountries.find(c => c.cca2 === airport.country)?.name.common || airport.country;
                setDestinationCountry(fullCountryName);
            } catch (e) {
                console.error("Error parsing destination airport", e);
            }
        }
    }, []);

    const { data: visaResponse, isLoading, isError } = useGetVisasQuery(
        destinationCountry ? { destinationCountry } : undefined,
        { skip: !destinationCountry }
    );

    const visas = visaResponse?.data?.data || [];
    
    // Get unique categories for filter
    const uniqueCategories = [
        "All Category",
        "Tourist Visa",
        "Business Visa",
        "Student Visa",
        "Work Visa",
        "Transit Visa",
        "Medical Visa",
        "Family / Spouse Visa",
        "Immigration Visa"
    ];

    const visaCategoriesMap: Record<string, string> = {
        "Tourist Visa": "TOURISM",
        "Business Visa": "BUSINESS",
        "Student Visa": "STUDY",
        "Work Visa": "WORK",
        "Transit Visa": "TRANSIT",
        "Medical Visa": "MEDICAL",
        "Family / Spouse Visa": "FAMILY_SPOUSE",
        "Immigration Visa": "IMMIGRATION"
    };

    // Filter visas based on selected category
    const filteredVisas = selectedCategory === "All Category"
        ? visas
        : visas.filter(v => v.category === visaCategoriesMap[selectedCategory]);

    // Grouping filtered visas by category
    const groupedVisas = filteredVisas.reduce((acc: Record<string, TVisaType[]>, visa) => {
        const apiCategory = visa.category || "General";
        const displayCategory = Object.keys(visaCategoriesMap).find(key => visaCategoriesMap[key] === apiCategory) || apiCategory;
        if (!acc[displayCategory]) acc[displayCategory] = [];
        acc[displayCategory].push(visa);
        return acc;
    }, {});

    const handleSelectVisa = (visaId: string) => {
        setSelectedVisaId(visaId);
        const visa = visas.find(v => v.id === visaId);
        if (visa) {
            localStorage.setItem("selectedVisa", JSON.stringify(visa));
        }
    };

    return (
        <div className="mx-auto p-4 md:p-6 space-y-6">
            {/* Header Section */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[#202020]">
                    {selectedAirport ? `Visa for ${selectedAirport.city} (${destinationCountry})` : "Select Destination"}
                </h1>
                <p className="text-sm text-[#595959]">
                    Select the visa you will use for this trip. We&#39;ll tailor routes and guidance based on your selection.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-semibold text-[#202020]">Available Visa Types</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="text-sm flex items-center gap-2 border-slate-200 text-[#595959] h-9 min-w-[160px] justify-between">
                            {selectedCategory} <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] rounded-xl shadow-xl border-slate-100">
                        {uniqueCategories.map((category) => (
                            <DropdownMenuItem 
                                key={category} 
                                onClick={() => setSelectedCategory(category)}
                                className={`cursor-pointer focus:bg-[#77AEE1]/10 focus:text-[#77AEE1] py-2.5 px-3 rounded-lg text-sm transition-colors ${selectedCategory === category ? 'bg-[#77AEE1]/5 text-[#77AEE1] font-semibold' : 'text-[#595959]'}`}
                            >
                                {category}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#77AEE1]" />
                    <p className="text-slate-500 font-medium">Loading visa types...</p>
                </div>
            ) : isError ? (
                <div className="text-center py-20">
                    <p className="text-red-500 font-medium">Error loading visas. Please try again later.</p>
                </div>
            ) : Object.keys(groupedVisas).length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    <p>No visas found for the selected destination.</p>
                    <Link href="/user-dashboard">
                        <Button variant="link" className="text-[#77AEE1] mt-2">Go back to Journey Plan</Button>
                    </Link>
                </div>
            ) : (
                <RadioGroup onValueChange={handleSelectVisa} value={selectedVisaId} className="space-y-8">
                    {Object.entries(groupedVisas).map(([categoryName, options]) => (
                        <div key={categoryName} className="space-y-4">
                            <h3 className="text-[10px] font-bold text-[#595959] uppercase tracking-widest opacity-80">
                                {categoryName}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {options.map((visa) => (
                                    <Label
                                        key={visa.id}
                                        htmlFor={visa.id}
                                        className="cursor-pointer block h-full"
                                    >
                                        <Card className={`relative p-5 h-full transition-all duration-300 border shadow-sm ${selectedVisaId === visa.id
                                            ? "border-[#77AEE1] bg-[rgba(119,174,225,0.02)] ring-1 ring-[#77AEE1]"
                                            : "border-slate-100 hover:border-[#77AEE1]/40"
                                            }`}>
                                            <div className="flex gap-4">
                                                <RadioGroupItem
                                                    value={visa.id}
                                                    id={visa.id}
                                                    className="mt-1 border-slate-300 text-[#77AEE1] focus:ring-[#77AEE1]"
                                                />
                                                <div className="space-y-3 w-full">
                                                    <div>
                                                        <h4 className="font-bold text-base text-[#202020] leading-tight">
                                                            {visa.name || Object.keys(visaCategoriesMap).find(key => visaCategoriesMap[key] === visa.category) || visa.category}
                                                        </h4>
                                                        <div className="flex justify-between items-center mt-2">
                                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                                                                {visa.processingTime}
                                                            </span>
                                                        </div>
                                                        {visa.notes && (
                                                            <p className="text-[12px] text-[#595959] mt-2 leading-relaxed">
                                                                {visa.notes}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Key Requirements:</p>
                                                        <ul className="space-y-2">
                                                            {visa.requiredDocs.slice(0, 3).map((doc, index) => (
                                                                <li key={index} className="text-[11px] text-[#595959] flex items-start gap-2">
                                                                    <span className="h-1 w-1 bg-slate-400 rounded-full mt-1.5 shrink-0" />
                                                                    <span className="leading-tight">{doc}</span>
                                                                </li>
                                                            ))}
                                                            {visa.requiredDocs.length > 3 && (
                                                                <li className="text-[11px] text-[#77AEE1] font-medium">+ {visa.requiredDocs.length - 3} more requirements</li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Label>
                                ))}
                            </div>
                        </div>
                    ))}
                </RadioGroup>
            )}

            {/* Guidance Box */}
            <div className="p-4 rounded-xl bg-[rgba(119,174,225,0.08)] border border-[rgba(119,174,225,0.1)]">
                <h5 className="text-sm font-bold text-[#202020] mb-1">Planning guidance:</h5>
                <p className="text-[11px] leading-relaxed text-[#595959]">
                    This selection helps us tailor route options and travel guidance. Visa policies are subject to change —
                    always verify current entry requirements through official government sources before travel.
                </p>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center items-center pt-6 pb-12">
                <Button
                    variant="default"
                    disabled={!selectedVisaId || isLoading}
                    asChild={!!selectedVisaId}
                    className="h-12 pl-10 pr-8 rounded-lg bg-[#77AEE1] hover:bg-[#689cd0] text-white font-semibold flex items-center justify-center gap-3 shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                    {selectedVisaId ? (
                        <Link href="/user-dashboard/visa-selection/common-travel-patterns">
                            <span className="flex items-center gap-3">
                                <span>Continue</span>
                                <ArrowRight className="h-4 w-4 shrink-0" />
                            </span>
                        </Link>
                    ) : (
                        <span className="flex items-center gap-3">
                            <span>Select a Visa</span>
                            <ArrowRight className="h-4 w-4 shrink-0" />
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
}
