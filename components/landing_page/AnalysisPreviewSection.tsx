"use client";

import { Counter } from "@/lib/Counter";
import { motion, animate } from "framer-motion";
import {
    Shield, Clock, CloudRain, AlertTriangle,
    FileCheck, Globe, Plane, Map, CheckCircle2
} from "lucide-react";
import { useEffect, useRef } from "react";

const analysisCards = [
    {
        icon: Shield,
        iconColor: "text-[#77AEE1]",
        borderColor: "border-l-[#77AEE1]",
        title: "Visa Requirement",
        status: "Required",
        statusColor: "text-slate-500 bg-slate-100",
        content: "UK Standard Visitor Visa required before departure",
        subContent: "Processing time: 15-21 days • Fee: $142 USD • Validity: 6 months",
        delay: 0.1,
    },
    {
        icon: Clock,
        iconColor: "text-yellow-500",
        borderColor: "border-l-yellow-400",
        title: "Transit Visa",
        status: "Not Required",
        statusColor: "text-yellow-600 bg-yellow-50",
        content: "Dubai transit visa not required for layovers under 8 hours",
        subContent: "You can remain in the international transit area without a visa",
        delay: 0.2,
    },
    {
        icon: CloudRain,
        iconColor: "text-[#77AEE1]",
        borderColor: "border-l-[#77AEE1]",
        title: "Weather Forecast",
        status: "Preparation Needed",
        statusColor: "text-blue-500 bg-blue-50",
        content: "Rain expected in London during your travel dates",
        subContent: "Pack waterproof jacket, umbrella, and closed-toe shoes",
        delay: 0.3,
    },
    {
        icon: AlertTriangle,
        iconColor: "text-red-500",
        borderColor: "border-l-red-400",
        title: "Travel Advisory",
        status: "Level 2",
        statusColor: "text-red-500 bg-red-50",
        content: "Exercise increased caution in the UK",
        subContent: "Due to threat of terrorism. Remain aware of your surroundings.",
        delay: 0.4,
    },
    {
        icon: FileCheck,
        iconColor: "text-green-500",
        borderColor: "border-l-green-400",
        title: "Document Checklist",
        status: "5 Items",
        statusColor: "text-green-600 bg-green-50",
        content: "",
        subContent: "",
        delay: 0.5,
        checklist: [
            "Passport with 6+ months validity",
            "Proof of accommodation (hotel booking)",
            "Return flight confirmation",
        ],
    },
];

export default function AnalysisPreviewSection() {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.location.hash === "#intelligence" && ref.current) {
                setTimeout(() => {
                    const targetPosition = ref.current!.offsetTop - 80;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });
                }, 100);
            }
        };

        handleScroll();
        window.addEventListener("hashchange", handleScroll);
        return () => window.removeEventListener("hashchange", handleScroll);
    }, []);

    return (
        <section id="intelligence" ref={ref} className="py-20 w-full px-4 lg:px-0">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight"
                    >
                        Analytical Intelligence, Not Guesswork
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        viewport={{ once: true }}
                        className="text-slate-500"
                    >
                        Every report is structured, verified, and actionable
                    </motion.p>
                </div>

                {/* Main Dashboard Card with your original BG */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    viewport={{ once: true }}
                    className="rounded-2xl p-6 md:p-10 w-full bg-linear-to-br from-[#F8FAFC] to-[#F1F5F9] border border-slate-100 shadow-sm"
                >
                    {/* Grid updated to 4:8 ratio for wider left side */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Left Column: Route & Score (lg:col-span-4 for more width) */}
                        <div className="lg:col-span-4 space-y-4">
                            <p className="text-[#77AEE1] text-xs font-semibold mb-2 tracking-wider uppercase">
                                Travel Route
                            </p>

                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">New York</h3>
                                        <p className="text-xs text-slate-400 font-medium">JFK Airport</p>
                                    </div>
                                    <Plane className="text-slate-300 h-5 w-5 mt-1" />
                                </div>

                                <div className="border-l-2 border-dashed border-[#77AEE1]/40 ml-2 pl-4 my-4 relative">
                                    <div className="absolute -left-1.25 top-0 w-2 h-2 rounded-full bg-[#77AEE1]" />
                                    <p className="text-[#77AEE1] text-sm font-semibold leading-none mb-1">Via Dubai</p>
                                    <p className="text-[11px] text-slate-400 italic">8h layover at DXB</p>
                                </div>

                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">London</h3>
                                        <p className="text-xs text-slate-400 font-medium">LHR Airport</p>
                                    </div>
                                    <Map className="text-slate-300 h-5 w-5 mt-1" />
                                </div>
                            </div>

                            <div className="bg-[#1B1F24] p-8 rounded-2xl text-white shadow-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <Globe className="h-4 w-4 text-[#77AEE1]" />
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        AI Confidence Score
                                    </p>
                                </div>
                                <div className="text-5xl font-bold text-white mb-2 leading-none">

                                    <Counter value={94} />%</div>
                                <p className="text-[11px] text-slate-500 font-medium">
                                    Based on 12 verified sources
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Analysis Detail Cards (lg:col-span-8) */}
                        <div className="lg:col-span-8 space-y-2">
                            {analysisCards.map((card, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: card.delay,
                                        ease: [0.25, 0.46, 0.45, 0.94]
                                    }}
                                    whileHover={{
                                        x: 6,
                                        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)",
                                        transition: { duration: 0.2 }
                                    }}
                                    viewport={{ once: true }}
                                    className={`bg-white rounded-xl border border-slate-100 border-l-4 ${card.borderColor} p-5 shadow-sm flex flex-col justify-center min-h-25`}
                                >
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex items-center gap-2.5">
                                            <card.icon className={`h-5 w-5 ${card.iconColor}`} strokeWidth={1.5} />
                                            <h4 className="font-bold text-slate-800 text-[14px] leading-none">
                                                {card.title}
                                            </h4>
                                        </div>
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${card.statusColor}`}>
                                            {card.status}
                                        </span>
                                    </div>

                                    {card.content && (
                                        <p className="text-[13px] text-slate-700 font-medium mb-1 pl-7.5">
                                            {card.content}
                                        </p>
                                    )}
                                    {card.subContent && (
                                        <p className="text-[11px] text-slate-400 pl-7.5">
                                            {card.subContent}
                                        </p>
                                    )}

                                    {card.checklist && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pl-7.5">
                                            {card.checklist.map((item, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                                    <span className="text-[12px] text-slate-600">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}