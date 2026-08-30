"use client";

import { motion, animate } from "framer-motion";
import { Globe, AlertTriangle, CloudRain, CheckSquare } from "lucide-react";
import { useEffect, useRef } from "react";

const problems = [
    {
        icon: Globe,
        title: "Confusing Visa Rules",
        description: "Different Requirements for every country. Processing times vary. Easy to miss critical details.",
        color: "text-blue-400",
    },
    {
        icon: AlertTriangle,
        title: "Transit Surprises",
        description: "Transit visas can be required even for short layovers. Rules changes without warning.",
        color: "text-orange-400",
    },
    {
        icon: CloudRain,
        title: "Weather Unpreparedness",
        description: "Seasonal weather changes catch travelers off guard. Warning clothing ruins experiences.",
        color: "text-blue-400",
    },
    {
        icon: CheckSquare,
        title: "Get AI Guidance",
        description: "Proof of funds, return tickets, hotel bookings, requirements vary and are easy to overlook.",
        color: "text-green-500",
    },
];

export function ProblemSection() {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.location.hash === "#how-it-works" && ref.current) {
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
        <section id="how-it-works" ref={ref} className="py-20 px-4 lg:px-0">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
                    >
                        International Travel Is Complicated.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        viewport={{ once: true }}
                        className="text-slate-500"
                    >
                        Current solutions are fragmented and confusing.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {problems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: index * 0.12,
                                duration: 0.7,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            whileHover={{
                                y: -6,
                                boxShadow: "0 20px 40px rgba(119,174,225,0.25), 0 8px 16px rgba(119,174,225,0.15)",
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            viewport={{ once: true }}
                            className="relative p-0.5 rounded-xl overflow-hidden cursor-pointer"
                        >
                            {/* Gradient Border */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: index % 2 === 0
                                        ? "linear-gradient(to bottom, rgba(119,174,225,1) 0%, rgba(255,255,255,0.2) 100%)"
                                        : "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(119,174,225,1) 100%)"
                                }}
                            />

                            {/* Card Body */}
                            <motion.div
                                whileHover={{ background: "linear-gradient(135deg, rgba(119,174,225,0.06) 0%, rgba(255,255,255,1) 100%)" }}
                                transition={{ duration: 0.3 }}
                                className="relative flex flex-col p-6 rounded-[10px] bg-white h-full"
                            >
                                {/* Icon */}
                                <div
                                    className="w-full h-12 flex items-center justify-start mb-6 rounded-xl"
                                    style={{
                                        background: "linear-gradient(90deg, rgba(119,174,225,0.03) 0%, rgba(255,255,255,0.16) 100%)"
                                    }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        <item.icon className={`h-6 w-6 ${item.color}`} />
                                    </motion.div>
                                </div>

                                <h3 className="text-[16px] font-bold text-slate-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-[13px] text-slate-400 leading-relaxed font-normal">
                                    {item.description}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}