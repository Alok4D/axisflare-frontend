"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import worldCountries from "world-countries";
import { useLazyGetAirportsQuery } from "@/lib/features/airport/airportApi";
import { TAirport } from "@/lib/types";
import { useEffect, useState, useRef } from "react";

const countryNames = worldCountries.map((country) => country.name.common).sort();

const formSchema = z.object({
    departureCity: z.string().min(1, { message: "Departure city is required" }),
    destinationCity: z.string().min(1, { message: "Destination city is required" }),
});

type JourneyFormValues = z.infer<typeof formSchema>;

export default function Traveling() {
    const router = useRouter();
    const [getDepartureAirports, { data: departureData, isFetching: isFetchingDeparture }] = useLazyGetAirportsQuery();
    const [getDestinationAirports, { data: destinationData, isFetching: isFetchingDestination }] = useLazyGetAirportsQuery();

    const [departureSearch, setDepartureSearch] = useState("");
    const [destinationSearch, setDestinationSearch] = useState("");
    const [showDepartureOptions, setShowDepartureOptions] = useState(false);
    const [showDestinationOptions, setShowDestinationOptions] = useState(false);

    const departureRef = useRef<HTMLDivElement>(null);
    const destinationRef = useRef<HTMLDivElement>(null);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<JourneyFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            departureCity: "",
            destinationCity: "",
        },
    });

    // Load from localStorage on mount
    useEffect(() => {
        const savedDeparture = localStorage.getItem("selectedDepartureAirport");
        const savedDestination = localStorage.getItem("selectedDestinationAirport");

        if (savedDeparture) {
            try {
                const airport: TAirport = JSON.parse(savedDeparture);
                const value = `${airport.city} (${airport.iata})`;
                setValue("departureCity", value);
                setDepartureSearch(value);
            } catch (e) {
                console.error("Failed to parse saved departure airport", e);
            }
        }

        if (savedDestination) {
            try {
                const airport: TAirport = JSON.parse(savedDestination);
                const value = `${airport.city} (${airport.iata})`;
                setValue("destinationCity", value);
                setDestinationSearch(value);
            } catch (e) {
                console.error("Failed to parse saved destination airport", e);
            }
        }
    }, [setValue]);

    // Close options on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (departureRef.current && !departureRef.current.contains(event.target as Node)) {
                setShowDepartureOptions(false);
            }
            if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
                setShowDestinationOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search for departure
    useEffect(() => {
        if (departureSearch.length > 1) {
            const timeoutId = setTimeout(() => {
                getDepartureAirports(departureSearch);
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [departureSearch, getDepartureAirports]);

    // Debounced search for destination
    useEffect(() => {
        if (destinationSearch.length > 1) {
            const timeoutId = setTimeout(() => {
                getDestinationAirports(destinationSearch);
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [destinationSearch, getDestinationAirports]);

    const handleSelectAirport = (type: "departure" | "destination", airport: TAirport) => {
        const value = `${airport.city} (${airport.iata})`;
        if (type === "departure") {
            setValue("departureCity", value);
            setDepartureSearch(value);
            setShowDepartureOptions(false);
            localStorage.setItem("selectedDepartureAirport", JSON.stringify(airport));
        } else {
            setValue("destinationCity", value);
            setDestinationSearch(value);
            setShowDestinationOptions(false);
            localStorage.setItem("selectedDestinationAirport", JSON.stringify(airport));
        }
    };

    const onSubmit = (values: JourneyFormValues) => {
        router.push(`/traveling/visa-selection`);
        console.log("Form Values:", values);
    };

    return (
        <div className="h-full w-full flex items-center justify-center overflow-hidden p-4">
            <div
                className="w-full max-w-156 flex flex-col gap-6 md:gap-8 
                           p-6 md:p-[32px_24px] 
                           rounded-2xl border border-[rgba(119,174,225,0.05)] 
                           bg-[rgba(119,174,225,0.05)] 
                           shadow-[8px_8px_16px_0_rgba(119,174,225,0.20)]"
            >
                {/* Header Section */}
                <div className="flex flex-col gap-2 text-left">
                    <h2 className="text-xl md:text-2xl font-semibold leading-tight text-[#595959]">
                        Where are you traveling?
                    </h2>
                    <p className="text-sm md:text-base font-normal text-[#202020]">
                        Enter your departure and destination cities to get started
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
                    <div className="flex flex-col gap-5">

                        {/* Departure Field */}
                        <div className="space-y-1.5 relative" ref={departureRef}>
                            <Label htmlFor="departureCity" className="text-sm md:text-base font-medium text-[#202020] ml-1">
                                Departure city
                            </Label>
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 h-4 w-4 md:h-5 md:w-5 text-slate-400 z-10" />
                                <input
                                    id="departureCity"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Search departure city or airport"
                                    className={`w-full h-12 md:h-14 pl-12 pr-4 bg-[#FDFDFF] border border-[rgba(119,174,225,0.50)] rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#77AEE1] transition-all ${errors.departureCity ? "border-red-400" : ""
                                        }`}
                                    value={departureSearch}
                                    onChange={(e) => {
                                        setDepartureSearch(e.target.value);
                                        setShowDepartureOptions(true);
                                    }}
                                    onFocus={() => setShowDepartureOptions(true)}
                                />
                            </div>

                            {/* Departure Options Dropdown */}
                            {showDepartureOptions && departureSearch.length > 1 && (
                                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                                    {isFetchingDeparture ? (
                                        <div className="p-4 text-center text-slate-400 text-sm italic">Searching...</div>
                                    ) : departureData?.data?.data && departureData.data.data.length > 0 ? (
                                        departureData.data.data.map((airport) => (
                                            <div
                                                key={airport.iata}
                                                className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                                                onClick={() => handleSelectAirport("departure", airport)}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-slate-900 text-sm">{airport.city}, {airport.country}</span>
                                                    <span className="text-xs font-bold text-[#77AEE1] bg-[#77AEE1]/10 px-2 py-0.5 rounded">{airport.iata}</span>
                                                </div>
                                                <div className="text-xs text-slate-500 truncate">{airport.name}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-slate-400 text-sm">No airports found</div>
                                    )}
                                </div>
                            )}

                            <div className="min-h-4 mt-1">
                                {errors.departureCity && (
                                    <p className="text-[10px] text-red-500 ml-1">{errors.departureCity.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Destination Field */}
                        <div className="space-y-1.5 relative" ref={destinationRef}>
                            <Label htmlFor="destinationCity" className="text-sm md:text-base font-medium text-[#202020] ml-1">
                                Destination city
                            </Label>
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 h-4 w-4 md:h-5 md:w-5 text-slate-400 z-10" />
                                <input
                                    id="destinationCity"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Search destination city or airport"
                                    className={`w-full h-12 md:h-14 pl-12 pr-4 bg-[#FDFDFF] border border-[rgba(119,174,225,0.50)] rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#77AEE1] transition-all ${errors.destinationCity ? "border-red-400" : ""
                                        }`}
                                    value={destinationSearch}
                                    onChange={(e) => {
                                        setDestinationSearch(e.target.value);
                                        setShowDestinationOptions(true);
                                    }}
                                    onFocus={() => setShowDestinationOptions(true)}
                                />
                            </div>

                            {/* Destination Options Dropdown */}
                            {showDestinationOptions && destinationSearch.length > 1 && (
                                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                                    {isFetchingDestination ? (
                                        <div className="p-4 text-center text-slate-400 text-sm italic">Searching...</div>
                                    ) : destinationData?.data?.data && destinationData.data.data.length > 0 ? (
                                        destinationData.data.data.map((airport) => (
                                            <div
                                                key={airport.iata}
                                                className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                                                onClick={() => handleSelectAirport("destination", airport)}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-slate-900 text-sm">{airport.city}, {airport.country}</span>
                                                    <span className="text-xs font-bold text-[#77AEE1] bg-[#77AEE1]/10 px-2 py-0.5 rounded">{airport.iata}</span>
                                                </div>
                                                <div className="text-xs text-slate-500 truncate">{airport.name}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-slate-400 text-sm">No airports found</div>
                                    )}
                                </div>
                            )}

                            <div className="min-h-4 mt-1">
                                {errors.destinationCity && (
                                    <p className="text-[10px] text-red-500 ml-1">{errors.destinationCity.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <Button
                        type="submit"
                        className="w-full h-12 md:h-14 rounded-full bg-[#77AEE1] hover:bg-[#689cd0] text-white font-medium shadow-[0_8px_30px_0_rgba(119,174,225,0.20)] transition-all active:scale-[0.98]"
                    >
                        Continue
                    </Button>
                </form>
            </div>
        </div>
    );
}