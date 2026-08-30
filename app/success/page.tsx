"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight, Loader } from "lucide-react";
import { useConfirmPaymentQuery } from "@/lib/features/subscription/subscriptionApi";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");

    const { data, isLoading, isError } = useConfirmPaymentQuery(sessionId || "", {
        skip: !sessionId,
    });

    useEffect(() => {
        if (!sessionId) {
            router.push("/");
        }
    }, [sessionId, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader className="w-12 h-12 animate-spin text-[#77AEE1] mb-4" />
                <h2 className="text-xl font-semibold text-slate-700">Verifying your payment...</h2>
                <p className="text-slate-500 mt-2">Please do not close this window.</p>
            </div>
        );
    }

    if (isError || !data?.success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-red-50 max-w-2xl text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">❌</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Verification Failed</h2>
                    <p className="text-slate-500 mb-8">
                        We couldn't verify your payment. If money was deducted, please contact support.
                    </p>
                    <Link
                        href="/#pricing"
                        className="inline-flex items-center justify-center w-full py-4 bg-[#77AEE1] text-white font-bold rounded-2xl hover:bg-[#669dcf] transition-all"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        );
    }

    const payment = data.data.payment;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 sm:p-12 rounded-lg shadow-xl border border-blue-50 max-w-2xl w-full text-center relative overflow-hidden"
            >
                {/* Decorative background elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#77AEE1]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#77AEE1]/10 rounded-full blur-3xl" />

                <div className="relative">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                        className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={2.5} />
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-semibold text-slate-900 mb-3"
                    >
                        Payment Success!
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-slate-500 font-medium mb-10"
                    >
                        Thank you for choosing LeonMakanda. Your subscription is now active.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-10 text-left space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm font-medium">Amount Paid</span>
                            <span className="text-slate-900 font-bold">${payment.amount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm font-medium">Transaction ID</span>
                            <span className="text-slate-900 font-mono text-[11px] truncate ml-4">
                                {payment.stripeSessionId.substring(0, 20)}...
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm font-medium">Status</span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {payment.status}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-4"
                    >
                        <Link
                            href="/user-dashboard"
                            className="flex items-center justify-center w-full py-3.5 bg-[#77AEE1] hover:bg-[#669dcf] text-white font-medium rounded-md shadow-xs shadow-blue-100 transition-all active:scale-[0.98] group"
                        >
                            Go to Dashboard
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <Link
                            href="/"
                            className="inline-block text-slate-400 hover:text-slate-600 text-sm font-semibold transition-colors"
                        >
                            Back to Home
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
