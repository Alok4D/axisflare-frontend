"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Plane, Info, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useGetAirportRoutesQuery } from "@/lib/features/airport/airportApi";
import { useGetMeQuery } from "@/lib/features/user/userApi";
import { useCreateAiAnalysisMutation } from "@/lib/features/ai/aiApi";
import { TAirport, TTravelPattern } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CardProps {
    pattern: TTravelPattern;
    isSelected: boolean;
    onSelect: () => void;
}

const Card = ({ pattern, isSelected, onSelect }: CardProps) => (
    <div
        onClick={onSelect}
        className={`w-full border rounded-xl p-6 flex justify-between items-start gap-6 shadow-[0_0_1px_rgba(0,0,0,0.25)] cursor-pointer transition-all ${isSelected ? "border-[#77AEE1] ring-1 ring-[#77AEE1] bg-[#77AEE1]/5" : "border-[#77AEE133] hover:border-[#77AEE1]/50"
            }`}
    >
        {/* Left content */}
        <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-gray-800">{pattern.title}</h3>
            <p className="text-sm text-gray-500">Typical route with {pattern.typicalConnections}</p>

            {/* info row */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-gray-600 mt-2">
                <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-[#77AEE1] mt-0.5" />
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Transit regions</p>
                        <p className="text-sm">{pattern.transitRegions.join(", ") || "Direct"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Clock size={16} className="text-[#77AEE1] mt-0.5" />
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Estimated duration</p>
                        <p className="text-sm">{pattern.estimatedDuration}</p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Plane size={16} className="text-[#77AEE1] mt-0.5" />
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Connections</p>
                        <p className="text-sm">{pattern.typicalConnections}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Radio */}
        <div className={`mt-2 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-[#77AEE1] bg-[#77AEE1]" : "border-gray-300"}`}>
            {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
        </div>
    </div>
);

export default function TravelPatterns() {
    const [selectedPattern, setSelectedPattern] = useState<TTravelPattern | null>(null);
    const [routeParams, setRouteParams] = useState({ name: "", origin: "", destination: "" });
    const { data: userResponse } = useGetMeQuery();
    const [createAnalysis, { isLoading: isAnalyzing }] = useCreateAiAnalysisMutation();
    const router = useRouter();

    useEffect(() => {
        const savedOrigin = localStorage.getItem("selectedDepartureAirport");
        const savedDestination = localStorage.getItem("selectedDestinationAirport");
        const userName = userResponse?.data?.name || "User";

        if (savedOrigin && savedDestination) {
            try {
                const origin: TAirport = JSON.parse(savedOrigin);
                const destination: TAirport = JSON.parse(savedDestination);
                setRouteParams({
                    name: userName,
                    origin: origin.icao || origin.iata,
                    destination: destination.icao || destination.iata
                });
            } catch (e) {
                console.error("Error parsing airport data", e);
            }
        }
    }, [userResponse]);

    const { data: routeResponse, isLoading, isError } = useGetAirportRoutesQuery(
        routeParams,
        { skip: !routeParams.origin || !routeParams.destination }
    );

    const patterns = routeResponse?.data?.travelPatterns || [];
    const routeInfo = routeResponse?.data?.route;

    const handleSelectPattern = (pattern: TTravelPattern) => {
        setSelectedPattern(pattern);
        localStorage.setItem("selectedTravelPattern", JSON.stringify(pattern));
    };

    const handleContinue = async () => {
        if (!selectedPattern) return;

        // Check if user has an active subscription or is an admin
        const isSubscriber = userResponse?.data?.subscriptionStatus === "ACTIVE" || userResponse?.data?.role === "ADMIN";

        if (!isSubscriber) {
            router.push("/user-dashboard/visa-selection/default-page");
            return;
        }

        try {
            const savedOrigin = localStorage.getItem("selectedDepartureAirport");
            const savedDestination = localStorage.getItem("selectedDestinationAirport");
            const savedVisa = localStorage.getItem("selectedVisa");

            if (!savedOrigin || !savedDestination || !savedVisa) {
                toast.error("Missing travel information. Please restart search.");
                return;
            }

            const origin: TAirport = JSON.parse(savedOrigin);
            const destination: TAirport = JSON.parse(savedDestination);
            const visa = JSON.parse(savedVisa);

            const payload = {
                originAirport: origin.icao || origin.iata,
                originCity: origin.city,
                originCountry: origin.country,
                destinationAirport: destination.icao || destination.iata,
                destinationCity: destination.city,
                destinationCountry: destination.country,
                visaType: visa.name || visa.category || "Tourist Visa",
                routeTitle: selectedPattern.title,
                transitRegions: selectedPattern.transitRegions || [],
                estimatedDuration: selectedPattern.estimatedDuration,
                connectionCount: (() => {
                    // Try to use connectionCount if it's already a valid number
                    if (typeof selectedPattern.connectionCount === 'number' && !isNaN(selectedPattern.connectionCount)) {
                        return selectedPattern.connectionCount;
                    }
                    // Extract numeric value from typicalConnections string (e.g., "2 connections")
                    if (selectedPattern.typicalConnections) {
                        const matches = selectedPattern.typicalConnections.match(/\d+/);
                        if (matches) return parseInt(matches[0], 10);
                        if (selectedPattern.typicalConnections.toLowerCase().includes("direct")) return 0;
                    }
                    // Default to 0 as a safe fallback for the backend Prisma check
                    return 0;
                })()
            };

            const response = await createAnalysis(payload).unwrap();

            if (response.success) {
                // Store analysis data for the next page or just pass the ID
                localStorage.setItem("currentAiAnalysis", JSON.stringify(response.data));
                router.push("/user-dashboard/visa-selection/travel-route-analysis-ai");
            }
        } catch (error: any) {
            console.error("Analysis failed", error);
            toast.error(error?.data?.message || "AI Analysis failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex justify-center p-6 bg-slate-50/30">
            <div className="w-full max-w-4xl rounded-xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[32px] font-bold text-gray-900">
                        Common Travel Patterns
                    </h1>
                    {routeInfo ? (
                        <p className="text-gray-500 mt-2 font-medium">
                            Common routing options between <span className="text-[#77AEE1]">{routeInfo.from.city} ({routeInfo.from.code})</span> and <span className="text-[#77AEE1]">{routeInfo.to.city} ({routeInfo.to.code})</span>.
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500 mt-1">
                            Analyzing typical routing options for your journey. Select one to proceed.
                        </p>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-[#77AEE1]" />
                        <p className="text-slate-500 font-medium">Searching for best routes...</p>
                    </div>
                ) : isError ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                        <p className="text-red-500 font-medium">Unable to fetch routes at this time.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-[#77AEE1] text-sm mt-2 hover:underline"
                        >
                            Try refreshing the page
                        </button>
                    </div>
                ) : patterns.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                        <p className="text-slate-500 font-medium">No common travel patterns found for this route.</p>
                        <Link href="/user-dashboard">
                            <button className="text-[#77AEE1] text-sm mt-2 hover:underline">Change your destinations</button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {patterns.map((pattern, index) => (
                            <Card
                                key={index}
                                pattern={pattern}
                                isSelected={selectedPattern?.title === pattern.title}
                                onSelect={() => handleSelectPattern(pattern)}
                            />
                        ))}
                    </div>
                )}

                {/* Notice */}
                <div className="mt-8 border border-blue-100 bg-blue-50/50 rounded-xl p-5 flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Info className="text-[#77AEE1]" size={20} />
                    </div>
                    <div className="text-sm text-slate-700">
                        <p className="font-bold text-slate-900">Important Notice</p>
                        <p className="mt-1 leading-relaxed">
                            These patterns represent common travel routes and typical transit
                            points. Actual flight availability, timing, and connections vary by
                            airline, season, and booking time.
                        </p>
                    </div>
                </div>

                {/* Button */}
                <div className="flex justify-center mt-12 py-10">
                    <button
                        onClick={handleContinue}
                        disabled={!selectedPattern || isAnalyzing}
                        className={`px-10 py-4 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 relative overflow-hidden ${selectedPattern
                                ? "bg-[#77AEE1] hover:bg-[#6a9fd0] text-white active:scale-95"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                            }`}
                    >
                        {isAnalyzing ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="animate-spin" size={20} />
                                <span>Generating AI Report...</span>
                            </div>
                        ) : (
                            <>
                                {selectedPattern ? "Continue to AI Analysis" : "Select a Pattern to Continue"}
                                {selectedPattern && <ArrowRight size={18} />}
                            </>
                        )}
                    </button>

                </div>
            </div>

            {/* AI Analysis Overlay */}
            {isAnalyzing && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="relative">
                            <div className="absolute -top-4 -right-4">
                                <Sparkles className="text-blue-400 animate-bounce" size={24} />
                            </div>
                            <div
                                className="p-8 rounded-full animate-pulse shadow-sm relative"
                                style={{ backgroundColor: 'rgba(119, 174, 225, 0.2)', border: '1px solid rgba(119, 174, 225, 0.4)' }}
                            >
                                <div
                                    className="absolute inset-0 rounded-full border-2 animate-spin"
                                    style={{ borderColor: 'transparent', borderTopColor: 'rgba(119, 174, 225, 1)' }}
                                />
                                <Plane className="w-12 h-12" style={{ color: 'rgba(119, 174, 225, 1)' }} />
                            </div>
                        </div>
                        <div className="mt-8 text-center space-y-3">
                            <h2 className="text-xl font-bold text-gray-800 animate-pulse">Finalizing your Travel Report</h2>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-gray-500">Processing AI insights...</p>
                                <p className="text-xs text-gray-400">Custom analysis for {routeInfo?.to?.city || "your journey"}</p>
                            </div>
                        </div>

                        {/* Progress bar simulation */}
                        <div className="w-64 h-1.5 bg-gray-100 rounded-full mt-6 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full animate-[loading_2.5s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
                        </div>

                        <style jsx>{`
                        @keyframes loading {
                            0% { transform: translateX(-100%); width: 30%; }
                            50% { width: 60%; }
                            100% { transform: translateX(300%); width: 30%; }
                        }
                    `}</style>
                    </div>
                </div>
            )}
        </div>
    );
}

function ArrowRight({ size }: { size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}