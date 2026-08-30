/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Download, Info, Crown, Lock, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetMeQuery } from "@/lib/features/user/userApi";

// Custom SVG icon matching the screenshot (route + sparkle/AI stars)
function AIRouteIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg style={style} className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
    </svg>
  );
}

export default function AITripAnalysis() {
  const router = useRouter();
  const { data: userData } = useGetMeQuery();
  const [data, setData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Attempt to load from localStorage
    const savedAnalysis = localStorage.getItem("currentAiAnalysis");
    if (savedAnalysis) {
      setData(JSON.parse(savedAnalysis));
      // Short delay for "professional" effect
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      // If no data, send back to dashboard
      router.push("/user-dashboard");
    }
  }, [router]);

  const isPro = userData?.data?.subscriptionStatus === "ACTIVE";

  if (isAnalyzing || !data) {
    return (
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
            <AIRouteIcon className="w-12 h-12" style={{ color: 'rgba(119, 174, 225, 1)' }} />
          </div>
        </div>
        <div className="mt-8 text-center space-y-3">
          <h2 className="text-xl font-bold text-gray-800 animate-pulse">Finalizing your Travel Report</h2>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Processing AI insights...</p>
            <p className="text-xs text-gray-400">Custom analysis for {data?.destinationCity || "your journey"}</p>
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
    );
  }

  const { aiResponse } = data;

  return (
    <div className="p-6 animate-in fade-in duration-700">
      {/* AI Trip Analysis Card */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <AIRouteIcon className="text-green-600" />
          <span className="text-green-700 font-bold text-sm">
            AI Trip Analysis
          </span>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed">
          Based on your travel from <span className="font-bold text-slate-900">{data.originCity}</span> to <span className="font-bold text-slate-900">{data.destinationCity}</span> using <span className="font-bold text-[#77AEE1]">{data.visaType}</span>, our
          system has analyzed your trip pattern and identified key
          considerations for your journey to <span className="font-bold">{data.destinationCountry}</span>. This is a travel pattern through <span className="font-semibold">{data.routeTitle}</span>.
          The analysis below outlines what to expect and how to prepare.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Info size={16} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Travel Route Analysis
        </span>
      </div>

      <div>
        <div className="border border-blue-100 rounded-xl p-5 bg-white shadow-sm">
          <div className="grid grid-cols-2 gap-x-12 gap-y-5">
            <div>
              <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-tight">Route Pattern</p>
              <p className="text-sm font-bold text-gray-800">{data.routeTitle}</p>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-tight">Connections</p>
              <p className="text-sm font-bold text-gray-800">
                {data.connectionCount} {data.connectionCount === 1 ? 'connection' : 'connections'}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-tight">Common Transit Regions</p>
              <p className="text-sm font-bold text-gray-800">
                {data.transitRegions.join(", ") || "Direct"}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-tight">Estimated Total Duration</p>
              <p className="text-sm font-bold text-gray-800">
                {data.estimatedDuration}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="border border-blue-100 rounded-xl p-5 bg-white shadow-sm transition-all hover:shadow-md">
          <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-50 text-blue-500 text-[10px] font-bold">1</span>
            1. Destination Visa Requirement &amp; Practical Guidance ({data.destinationCountry})
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium border-l-2 border-blue-100 pl-4 py-1 italic">
            {aiResponse.visaOverview.summary}
          </p>

          <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Key Guidance List</p>

          <div className="space-y-4">
            {aiResponse.visaOverview.notes.map((note: string, index: number) => (
               <div key={index} className="flex gap-3">
                 <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                 <p className="text-sm text-gray-600 leading-relaxed font-medium">
                   {note}
                 </p>
               </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        {!isPro && (
          <div className="absolute inset-0 z-10 bg-white/30 backdrop-blur-[10px] flex items-center justify-center rounded-xl overflow-hidden">
            <div className="bg-white rounded-3xl p-8 max-w-90 w-full shadow-2xl border border-gray-100 flex flex-col items-center text-center mx-4">
              <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center mb-4">
                <Crown className="text-white" size={24} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Unlock Pro Insights
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Get comprehensive guidance for Required Documents, Transit Rules, and Expert Travel Advice.
              </p>
              <Link
                href="/#pricing"
                className="bg-[#2E3374] hover:bg-[#1a1e4d] text-white font-bold py-3 px-10 rounded-full flex items-center gap-2 transition-all shadow-lg active:scale-95 no-underline"
              >
                <Lock size={18} />
                Unlock with Pro
              </Link>
            </div>
          </div>
        )}

        <div className={`${!isPro ? "pointer-events-none select-none" : ""}`}>
          <div className="mb-4">
            <div className="border border-blue-100 rounded-xl p-5 bg-white shadow-sm transition-all hover:shadow-md">
              <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-50 text-blue-500 text-[10px] font-bold">2</span>
                2. Required Documents & Documentation Tips
              </h2>
              <div className="space-y-3">
                {aiResponse.documentationTips.map((tip: string, index: number) => (
                   <div key={index} className="flex gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                     <span className="h-4 w-4 rounded-full bg-blue-100 text-[#77AEE1] flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">✓</span>
                     <p className="text-sm text-gray-600 leading-relaxed">
                       {tip}
                     </p>
                   </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="border border-blue-100 rounded-xl p-5 bg-white shadow-sm transition-all hover:shadow-md">
              <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-50 text-blue-500 text-[10px] font-bold">3</span>
                3. Route &amp; Transit Visa Guidance ({data.routeTitle})
              </h2>
              
              <div className="flex items-center gap-3 mb-4 bg-orange-50 border border-orange-100 p-3 rounded-lg">
                <AlertCircle className="text-orange-500 shrink-0" size={18} />
                <span className="text-xs font-bold text-orange-700 uppercase tracking-tighter">Risk Level: {aiResponse.transitLogic.riskLevel}</span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
                {aiResponse.transitLogic.summary}
              </p>

              <div className="space-y-3">
                {aiResponse.transitLogic.notes.map((note: string, index: number) => (
                    <div key={index} className="flex gap-3 items-start p-2 hover:bg-slate-50 rounded transition-colors group">
                        <span className="h-1 w-1 rounded-full bg-slate-300 mt-2.5 shrink-0 group-hover:bg-blue-300 transition-colors" />
                        <p className="text-sm text-gray-600 leading-relaxed">{note}</p>
                    </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="border border-yellow-300 rounded-xl p-6 bg-yellow-50/50 mb-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={20} className="text-yellow-600 shrink-0" />
                <p className="text-base font-bold text-slate-800">
                  Overall Assessment
                </p>
              </div>
              <p className="text-sm text-slate-700 leading-[1.6] mb-5 font-medium">
                {aiResponse.overallAssessment.feasibility}
              </p>
              <div className="bg-white/60 p-3 rounded-lg border border-yellow-200">
                <p className="text-xs text-slate-500 italic flex items-center gap-2">
                  <Info size={12} />
                  {aiResponse.overallAssessment.finalNote}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button 
                onClick={() => router.push("/user-dashboard")}
                className="w-full py-4 px-6 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                Return to Dashboard
              </button>
              <Link 
                href={`/user-dashboard/history/${data.id}`}
                className="w-full py-4 px-6 rounded-xl bg-[#77AEE1] hover:bg-[#6399c9] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 active:scale-95 no-underline"
              >
                View Full Analysis Record
                <ArrowRight size={18} className="shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ size, className }: { size: number; className?: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            className={className}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}