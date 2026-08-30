"use client";

import { motion } from "framer-motion";
import { UserCircle2, Cpu, FileText } from "lucide-react";

const steps = [
    {
        icon: UserCircle2,
        step: "1",
        title: "Enter Your Route",
        description: "Input your departure city, destination, and any transit points you're considering",
    },
    {
        icon: Cpu,
        step: "2",
        title: "AI Analyzes Multiple Data Points",
        description: "Our AI scans visa databases, weather patterns, advisories, and regulations instantly",
    },
    {
        icon: FileText,
        step: "3",
        title: "Get Personalized Report",
        description: "Receive a comprehensive travel insight report tailored to your specific journey",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
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

export function HowItWorksSection() {
    return (
        <section className="py-24 relative overflow-hidden px-4 lg:px-0">
            <div className="container mx-auto">
                <div className="text-center mb-28">
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
                    >
                        Intelligence in Three Steps
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                        viewport={{ once: true }}
                        className="text-slate-500"
                    >
                        Your roadmap to a safe journey.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-24 relative z-10"
                >
                    {steps.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{
                                y: -12,
                                transition: { duration: 0.35, ease: "easeOut" },
                            }}
                            className="relative flex flex-col items-center group cursor-pointer"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="absolute -top-24 left-1/2 -translate-x-1/2 text-[150px] font-bold text-blue-50 leading-none select-none z-0 group-hover:text-blue-100/60 transition-colors duration-500"
                            >
                                {item.step}
                            </motion.div>

                            <div className="bg-white border border-blue-100 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm relative z-10 w-full transition-all duration-500 group-hover:shadow-[0_24px_48px_rgba(119,174,225,0.18)] group-hover:border-[#77AEE1]/30">

                                <motion.div
                                    whileHover={{ scale: 1.15, rotate: 6 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className="w-14 h-14 rounded-full bg-[#77AEE1] flex items-center justify-center -mt-4 mb-6 text-white shadow-lg shadow-blue-200/50"
                                >
                                    <item.icon size={24} />
                                </motion.div>

                                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 px-2 group-hover:text-[#77AEE1] transition-colors duration-300">
                                    {item.title}
                                </h3>

                                <p className="text-slate-500 text-sm leading-relaxed font-normal">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}