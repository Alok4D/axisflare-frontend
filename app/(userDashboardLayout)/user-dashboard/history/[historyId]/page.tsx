"use client";

import { AlertCircle, Download, Info, Loader2, ArrowLeft, Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleAiHistoryQuery } from "@/lib/features/ai/aiApi";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

// Custom SVG icon matching the screenshot (route + sparkle/AI stars)
function AIRouteIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M9.68639 1.48314C9.72923 1.25375 9.85096 1.04656 10.0305 0.897461C10.21 0.748364 10.436 0.666748 10.6694 0.666748C10.9028 0.666748 11.1288 0.748364 11.3083 0.897461C11.4878 1.04656 11.6095 1.25375 11.6524 1.48314L12.7034 7.04114C12.778 7.43629 12.9701 7.79976 13.2544 8.08411C13.5388 8.36847 13.9022 8.5605 14.2974 8.63514L19.8554 9.68614C20.0848 9.72899 20.292 9.85072 20.4411 10.0302C20.5902 10.2098 20.6718 10.4358 20.6718 10.6691C20.6718 10.9025 20.5902 11.1285 20.4411 11.308C20.292 11.4876 20.0848 11.6093 19.8554 11.6521L14.2974 12.7031C13.9022 12.7778 13.5388 12.9698 13.2544 13.2542C12.9701 13.5385 12.778 13.902 12.7034 14.2971L11.6524 19.8551C11.6095 20.0845 11.4878 20.2917 11.3083 20.4408C11.1288 20.5899 10.9028 20.6715 10.6694 20.6715C10.436 20.6715 10.21 20.5899 10.0305 20.4408C9.85096 20.2917 9.72923 20.0845 9.68639 19.8551L8.63539 14.2971C8.56074 13.902 8.36871 13.5385 8.08436 13.2542C7.8 12.9698 7.43653 12.7778 7.04139 12.7031L1.48339 11.6521C1.25399 11.6093 1.0468 11.4876 0.897705 11.308C0.748608 11.1285 0.666992 10.9025 0.666992 10.6691C0.666992 10.4358 0.748608 10.2098 0.897705 10.0302C1.0468 9.85072 1.25399 9.72899 1.48339 9.68614L7.04139 8.63514C7.43653 8.5605 7.8 8.36847 8.08436 8.08411C8.36871 7.79976 8.56074 7.43629 8.63539 7.04114L9.68639 1.48314Z" stroke="#36B553" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function HistoryOfPlan() {
    const params = useParams();
    const router = useRouter();
    const historyId = params.historyId as string;
    const [isDownloading, setIsDownloading] = useState(false);

    const { data: historyResponse, isLoading, isError } = useGetSingleAiHistoryQuery(historyId);
    const data = historyResponse?.data;

    const handleDownload = async () => {
        setIsDownloading(true);
        const token = localStorage.getItem("accessToken");
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://206.162.244.134:5711/api/v1"}/ai/history/${historyId}/download`, {
                method: "GET",
                headers: {
                    "Authorization": token || "",
                },
            });

            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Travel-Checklist-${historyId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Checklist downloaded successfully!");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download checklist. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader className="h-12 w-12 animate-spin text-[#77AEE1]" />
                <p className="text-slate-500 font-medium">Fetching travel analysis...</p>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-6">
                <p className="text-red-500 font-medium text-lg">Travel analysis not found.</p>
                <Button 
                    onClick={() => router.push("/user-dashboard/history")}
                    variant="outline"
                    className="mt-4 gap-2"
                >
                    <ArrowLeft size={18} />
                    Back to History
                </Button>
            </div>
        );
    }

    const { aiResponse } = data;

    return (
        <div className="p-4 md:p-6 mb-10 max-w-5xl mx-auto">
            {/* Back Button */}
            <button 
                onClick={() => router.push("/user-dashboard/history")}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-all mb-6 group"
            >
                <div className="p-1.5 rounded-full bg-slate-100 group-hover:bg-slate-200">
                    <ArrowLeft size={18} />
                </div>
                <span className="text-sm font-medium">Return to History</span>
            </button>

            {/* AI Trip Analysis Card */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <AIRouteIcon className="text-green-600" />
                    <span className="text-green-700 font-bold text-base">
                        AI Trip Analysis
                    </span>
                </div>

                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    Based on your travel from <span className="font-bold text-slate-900">{data.originCity}</span> to <span className="font-bold text-slate-900">{data.destinationCity}</span> using <span className="font-bold text-[#77AEE1]">{data.visaType}</span>, our
                    system has analyzed your trip pattern and identified key
                    considerations for your journey. This is a travel pattern through <span className="font-semibold">{data.routeTitle}</span>.
                    The analysis below outlines what to expect and how to prepare.
                </p>
            </div>

            {/* Travel Route Analysis Section Header */}
            <div className="flex items-center gap-2 mb-4 ml-1">
                <Info size={16} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Travel Route Analysis
                </span>
            </div>

            {/* Route Analysis Cards Grid */}
            <div className="border border-blue-100 rounded-2xl p-6 bg-white shadow-sm mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tight">Route Pattern</p>
                        <p className="text-sm font-bold text-slate-800">{data.routeTitle}</p>
                    </div>

                    <div>
                        <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tight">Typical Connections</p>
                        <p className="text-sm font-bold text-slate-800">
                            {data.connectionCount} connections
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tight">Transit Regions</p>
                        <p className="text-sm font-bold text-slate-800">
                            {data.transitRegions.join(", ")}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tight">Estimated Duration</p>
                        <p className="text-sm font-bold text-slate-800">
                            {data.estimatedDuration}
                        </p>
                    </div>
                </div>
            </div>

            {/* 1. Destination Visa Requirement Section */}
            <div className="space-y-6">
                <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm transition-all hover:shadow-md">
                    <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#77AEE1]/10 text-[#77AEE1] text-xs">1</span>
                        Destination Visa Requirement & Practical Guidance
                    </h2>

                    <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                        {aiResponse.visaOverview.summary}
                    </p>

                    <div className="space-y-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Considerations</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {aiResponse.visaOverview.notes.map((note, index) => (
                                <div key={index} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 italic">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#77AEE1] mt-2 shrink-0" />
                                    <p className="text-sm text-slate-600 leading-relaxed">{note}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Route & Transit Visa Guidance */}
                <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm transition-all hover:shadow-md">
                    <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#77AEE1]/10 text-[#77AEE1] text-xs">2</span>
                        Route & Transit Visa Guidance ({data.routeTitle})
                    </h2>

                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-orange-500" size={20} />
                            <div>
                                <p className="text-xs text-orange-400 font-bold uppercase tracking-tight">Risk Level</p>
                                <p className="text-sm font-bold text-orange-700">{aiResponse.transitLogic.riskLevel}</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        {aiResponse.transitLogic.summary}
                    </p>

                    <div className="space-y-3">
                        {aiResponse.transitLogic.notes.map((note, index) => (
                            <div key={index} className="flex gap-3 items-start">
                                <span className="h-1 w-1 rounded-full bg-slate-300 mt-2.5 shrink-0" />
                                <p className="text-sm text-slate-600 leading-relaxed">{note}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Feasibility & Advice Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Advantages */}
                    <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 shadow-sm">
                        <h3 className="text-sm font-bold text-green-700 mb-4 uppercase tracking-widest">Route Advantages</h3>
                        <ul className="space-y-3">
                            {aiResponse.routeFeasibility.advantages.map((adv, index) => (
                                <li key={index} className="flex gap-3 text-sm text-slate-600">
                                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    </div>
                                    {adv}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Concerns */}
                    <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 shadow-sm">
                        <h3 className="text-sm font-bold text-red-700 mb-4 uppercase tracking-widest">Key Concerns</h3>
                        <ul className="space-y-3">
                            {aiResponse.routeFeasibility.concerns.map((con, index) => (
                                <li key={index} className="flex gap-3 text-sm text-slate-600">
                                    <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    </div>
                                    {con}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Overall Assessment Footer */}
                <div className="mt-8 border border-yellow-300 rounded-2xl p-6 bg-yellow-50 shadow-sm border-l-8 border-l-yellow-400">
                    <div className="flex items-center gap-3 mb-3">
                        <AlertCircle className="text-yellow-600" size={24} />
                        <h3 className="text-lg font-bold text-slate-800">Overall Assessment</h3>
                        <span className="ml-auto bg-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-2">
                           Confidence: <span className="text-[#77AEE1]">{aiResponse.overallAssessment.confidenceScore}/10</span>
                        </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                        {aiResponse.overallAssessment.feasibility}
                    </p>
                    <div className="p-4 bg-white/60 rounded-xl border border-yellow-200 italic text-sm text-slate-600">
                        {aiResponse.overallAssessment.finalNote}
                    </div>
                </div>

                {/* Final Actions */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 text-center">
                 <Link href="/user-dashboard/history">
                    <Button 
                        variant="outline" 
                        className=" h-12 px-8 text-slate-600 border-slate-200 hover:bg-slate-50 transition-all rounded-md gap-2 font-medium"
                    >
                        <ArrowLeft size={18} />
                        Back to History
                    </Button>
                 </Link>
                    <Button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="h-12 px-8 bg-[#77AEE1] hover:bg-[#6399c9] text-white font-bold gap-3 transition-all active:scale-95 rounded-md disabled:opacity-70"
                    >
                        {isDownloading ? (
                            <>
                                <Loader className="animate-spin" size={18} />
                                Downloading...
                            </>
                        ) : (
                            <>
                                Download Preparation Checklist
                                <Download size={18} />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
