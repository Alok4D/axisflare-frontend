"use client";

import { motion } from "framer-motion";
import { Shield, Clock, CloudRain, AlertTriangle, FileCheck, Network } from "lucide-react";

const features = [
    {
        icon: Shield,
        title: "Visa Requirement Breakdown",
        description: "Detailed visa types, processing times, and application requirements tailored to your citizenship.",
    },
    {
        icon: Clock,
        title: "Transit Visa Risk",
        description: "Analysis of layover requirements, airport transit zones, and visa-free transit eligibility across the world.",
    },
    {
        icon: CloudRain,
        title: "Weather & Seasonal Advice",
        description: "Climate forecasts, seasonal patterns, and packing recommendations based on historical data.",
    },
    {
        icon: AlertTriangle,
        title: "Travel Advisory Alerts",
        description: "Real-time safety advisories, political situations, and risk assessments from official sources.",
    },
    {
        icon: FileCheck,
        title: "Document Checklist",
        description: "Comprehensive list of required documents, validity requirements, and recommended backups.",
    },
    {
        icon: Network,
        title: "Route Complexity Analysis",
        description: "Multi-country journey analysis including transit points, entry requirements, and risk factors.",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    },
};

export function FeaturesSection() {
    return (
        <section
            className="py-24 w-full relative px-4 lg:px-0"
            style={{
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "transparent",
                borderImage: "linear-gradient(to right, transparent 0%, rgba(119,174,225,0.8) 50%, transparent 100%) 1",
                background: "rgba(119, 174, 225, 0.05)",
            }}
        >
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4 text-[#202020]"
                    >
                        What Our AI Checks For You
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                        viewport={{ once: true }}
                        className="text-slate-500 text-[15px]"
                    >
                        Every insight is verified across multiple authoritative sources
                    </motion.p>
                </div>

                {/* Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{
                                y: -8,
                                scale: 1.02,
                                boxShadow: "0 24px 48px rgba(119,174,225,0.25), 0 8px 20px rgba(119,174,225,0.12)",
                                transition: { duration: 0.35, ease: "easeOut" },
                            }}
                            className="rounded-2xl p-8 flex flex-col cursor-pointer"
                            style={{
                                border: "1px solid rgba(119, 174, 225, 0.2)",
                                background: "rgba(119, 174, 225, 0.05)",
                            }}
                        >
                            {/* Icon */}
                            <motion.div
                                whileHover={{ scale: 1.15, rotate: 6 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                                style={{
                                    background: "linear-gradient(135deg, rgba(119,174,225,0.2) 0%, rgba(119,174,225,0.06) 100%)",
                                }}
                            >
                                <feature.icon className="h-5 w-5 text-[#77AEE1]" strokeWidth={2} />
                            </motion.div>

                            {/* Title */}
                            <motion.h3
                                className="text-[17px] font-bold text-slate-900 mb-3"
                                whileHover={{ color: "#77AEE1", transition: { duration: 0.2 } }}
                            >
                                {feature.title}
                            </motion.h3>

                            {/* Description */}
                            <p className="text-[13px] text-slate-500 leading-relaxed font-normal">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}