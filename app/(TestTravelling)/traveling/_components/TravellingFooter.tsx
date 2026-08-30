"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/public/assest/logo.png";

export function TravellingFooter() {
    return (
        <footer className="w-full md:px-6 overflow-hidden mb-10 mt-20 px-4 lg:px-0">
            {/* Styles live in shine.css (global) */}

            {/* Main Rounded Container */}
            <div className="container mx-auto bg-[#77AEE1] rounded-[40px] relative overflow-visible pt-4 flex flex-col items-center">

                <div className="relative z-10 text-center">
                    <div className="flex flex-col items-center justify-center">

                        {/* Logo Section */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                            viewport={{ once: true }}
                            className="mb-4 flex flex-col items-center"
                        >
                            <Image src={logo} alt="AxisFlare Logo" width={76} height={90} className="object-contain" />
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                            viewport={{ once: true }}
                            className="text-white/90 text-sm font-normal px-4 w-full mx-auto"
                        >
                            AI-powered travel intelligence for international travelers who value preparation.
                        </motion.p>

                        {/* Copyright */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="text-white text-xs mt-4 font-normal"
                        >
                            © {new Date().getFullYear()} AxisFlare. All rights reserved.
                        </motion.p>
                    </div>
                </div>

                {/* Travel Text with 45° Shine Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    viewport={{ once: true }}
                    className="w-full flex justify-center pointer-events-none select-none relative z-20 mt-4"
                >
                    <h1 className="travel-text">
                        Travel
                    </h1>
                </motion.div>
            </div>
        </footer>
    );
}