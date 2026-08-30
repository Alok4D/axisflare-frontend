"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import CheckCircle from "@/public/assest/checkmark-badge.png";
import { LucideIcon } from "lucide-react";
import { Counter } from "@/lib/Counter";
import Link from "next/link";

export function HeroSection() {
    return (
        <section
            className="relative w-full min-h-screen pt-20 pb-12 flex flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/assest/Rectangle.png')" }}
        >
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute left-0 bottom-50 pointer-events-none z-0"
            >
                <Image width={1044} height={722} src="/assest/CloudTwo.png" alt="Cloud" className="h-auto object-contain" />
            </motion.div>

            <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute right-0 top-0 pointer-events-none z-0"
            >
                <Image width={1044} height={722} src="/assest/CloudOne.png" alt="Cloud" className="h-auto object-contain" />
            </motion.div>

            <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                >
                    <h1 className="text-[32px] sm:text-[42px] md:text-[52px] lg:text-[60px] font-bold leading-[1.2] md:leading-[72px] tracking-tight text-center mt-16">
                        <span
                            className="block"
                            style={{
                                background: "linear-gradient(90deg, #202020 0%, #77AEE1 100%)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Travel Smarter, Stay Ahead &
                        </span>

                        <span className="block overflow-hidden">
                            <motion.span
                                className="block"
                                style={{
                                    background: "linear-gradient(90deg, #202020 0%, #77AEE1 100%)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                                initial={{ clipPath: "inset(0 100% 0 0)" }}
                                animate={{
                                    clipPath: [
                                        "inset(0 100% 0 0)",
                                        "inset(0 0% 0 0)",
                                        "inset(0 0% 0 0)",
                                        "inset(0 100% 0 0)",
                                    ],
                                }}
                                transition={{
                                    duration: 4,
                                    delay: 0.3,
                                    times: [0, 0.3, 0.7, 1],
                                    ease: [0.43, 0, 0.18, 1],
                                    repeat: Infinity,
                                    repeatDelay: 0.5,
                                }}
                            >
                                Know Everything You Need Before You Go.
                            </motion.span>
                        </span>

                    </h1>

                <Link href={"/traveling"}>
                    <Button
                        className="hover:scale-105 transition-all px-8 py-6 h-auto font-semibold"
                        style={{
                            borderRadius: "32px",
                            background: "#77AEE1",
                            boxShadow: "0 8px 30px 0 rgba(119, 174, 225, 0.20)",
                            display: "inline-flex",
                            color: "#202020",
                        }}
                    >
                        Get Started Free
                    </Button>
                </Link>
                </motion.div>

                <div className="relative mt-24 w-full flex flex-col items-center justify-center mb-30">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
                        transition={{
                            opacity: { duration: 2, ease: [0.25, 0.46, 0.45, 0.94] },
                            scale: { duration: 2, ease: [0.25, 0.46, 0.45, 0.94] },
                            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }
                        }}
                        className="relative w-full flex items-center justify-center"
                    >
                        <Image src="/assest/world.png" alt="World Globe" width={676} height={600} className="object-contain" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap md:flex-nowrap justify-center items-center gap-4 p-4 md:p-6 bg-[#77AEE1]/20 rounded-3xl backdrop-blur-md -mt-60 z-20 w-[95%] md:w-auto"
                    >
                        {[
                            { icon: CheckCircle, title: <><Counter value={190} />+ Countries</>, desc: "Global coverage" },
                            { icon: CheckCircle, title: "AI-Powered Analysis", desc: "Multi-source verification" },
                            { icon: CheckCircle, title: "Real-Time Intelligence", desc: "Updated continuously" },
                            { icon: CheckCircle, title: "No Booking Required", desc: "Pure intelligence" }
                        ].map((item, index) => (
                            <div key={index} className="relative p-[1.5px] rounded-2xl overflow-hidden w-[45%] md:w-auto">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: "linear-gradient(to right, rgba(119,174,225,0.9) 0%, rgba(255,255,255,0.9) 50%, rgba(119,174,225,0.9) 100%)"
                                    }}
                                />
                                <div className="relative flex items-center gap-3 p-3 md:p-4 rounded-[14.5px] bg-white min-w-0 md:min-w-50">
                                    <div className="shrink-0">
                                        <Image src={item.icon} alt="icon" width={24} height={24} />
                                    </div>
                                    <div className="flex flex-col text-left min-w-0">
                                        <span className="text-[13px] md:text-[16px] font-normal text-[#202020] leading-tight truncate">
                                            {item.title}
                                        </span>
                                        <span className="text-[11px] md:text-[12px] text-slate-500 font-normal truncate">
                                            {item.desc}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section >
    );
}

interface FloatingCardProps {
    icon: LucideIcon;
    text: string;
    className?: string;
    delay: number;
}

export function FloatingCard({ icon: Icon, text, className, delay }: FloatingCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            className={`hidden md:flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-white/20 backdrop-blur-md bg-white/80 z-30 ${className}`}
        >
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                <Icon size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">{text}</span>
        </motion.div>
    );
}