"use client";

import { useRef, useState, useEffect } from "react";
import { Check, ShieldCheck, Clock, XCircle, AlertCircle, Sparkles, PlaneIcon, Loader2, Loader } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useGetMeQuery } from "@/lib/features/user/userApi";
import { useGetSubscriptionPlansQuery, useCreateCheckoutSessionMutation, useGetMySubscriptionQuery, useCancelSubscriptionMutation } from "@/lib/features/subscription/subscriptionApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusConfig: any = {
    "ACTIVE": {
        label: "Active Plan",
        icon: ShieldCheck,
        color: "bg-green-500/10 text-green-600 border-green-200/50",
        light: "bg-green-50/40",
        border: "border-green-100",
        text: "text-slate-700",
        bgIcon: "bg-green-100/50",
        iconColor: "text-green-600"
    },
    "INACTIVE": {
        label: "No Active Plan",
        icon: AlertCircle,
        color: "bg-slate-500/10 text-slate-500 border-slate-200/50",
        light: "bg-slate-50/40",
        border: "border-slate-150",
        text: "text-slate-500",
        bgIcon: "bg-slate-100/50",
        iconColor: "text-slate-500"
    },
    "EXPIRED": {
        label: "Plan Expired",
        icon: Clock,
        color: "bg-amber-500/10 text-amber-600 border-amber-200/50",
        light: "bg-amber-50/40",
        border: "border-amber-100",
        text: "text-slate-700",
        bgIcon: "bg-amber-100/50",
        iconColor: "text-amber-600"
    },
    "CANCELLED": {
        label: "Plan Cancelled",
        icon: XCircle,
        color: "bg-red-500/10 text-red-600 border-red-200/50",
        light: "bg-red-50/40",
        border: "border-red-100",
        text: "text-slate-700",
        bgIcon: "bg-red-100/50",
        iconColor: "text-red-600"
    }
};

const UserAvailableSubscription = () => {
    const { data: userData, isLoading: isUserLoading } = useGetMeQuery();
    const { data: mySubData, isLoading: isMySubLoading } = useGetMySubscriptionQuery();
    const { data: plansData, isLoading: isPlansLoading } = useGetSubscriptionPlansQuery();
    const [createCheckout, { isLoading: isSubscribing }] = useCreateCheckoutSessionMutation();
    const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();

    const currentStatus = mySubData?.data?.subscriptionStatus || "INACTIVE";
    const planDetails = mySubData?.data?.planDetails;
    const config = statusConfig[currentStatus] || statusConfig["INACTIVE"];
    const StatusIcon = config.icon;

    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        if (currentStatus !== "ACTIVE" || !mySubData?.data?.subscriptionEndDate) {
            setTimeLeft(null);
            return;
        }

        const calculateTimeLeft = () => {
            const end = new Date(mySubData.data.subscriptionEndDate).getTime();
            const now = new Date().getTime();
            const difference = end - now;

            if (difference <= 0) {
                setTimeLeft(null);
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [currentStatus, mySubData?.data?.subscriptionEndDate]);

    const handleSubscribe = async (planId: string) => {
        const toastId = toast.loading("Preparing checkout...");
        try {
            const res = await createCheckout({ planId }).unwrap();
            if (res.success && res.data) {
                toast.success("Redirecting to Stripe...", { id: toastId });
                window.location.href = res.data;
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to start subscription", { id: toastId });
        }
    };

    const handleCancelPlan = async () => {
        const toastId = toast.loading("Cancelling subscription...");
        try {
            const res = await cancelSubscription().unwrap();
            if (res.success) {
                toast.success(res.message || "Subscription cancelled successfully", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to cancel subscription", { id: toastId });
        }
    };

    if (isUserLoading || isPlansLoading || isMySubLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#77AEE1]" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-10 min-h-screen pb-20">
            {/* Header Section */}
            <header className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Subscription Management</h1>
                <p className="text-slate-500 text-sm">Control your premium access and explore available upgrades.</p>
            </header>

            {/* Current Status Card */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("p-6 rounded-2xl border relative overflow-hidden group transition-all shadow-[0_4px_20px_-4px_rgba(119,174,225,0.08)]", config.light, config.border)}
            >
                {/* Decorative blobs */}
                <div className={cn("absolute -top-24 -right-24 w-64 h-64 opacity-10 rounded-full blur-3xl", config.bgIcon)} />
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100/50", config.bgIcon)}>
                            <StatusIcon className={cn("w-7 h-7", config.iconColor)} />
                        </div>
                        <div className="space-y-1.5">
                            <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", config.color)}>
                                {config.label}
                            </span>
                            <h2 className="text-xl font-bold text-slate-800">
                                {currentStatus === "ACTIVE" 
                                    ? planDetails?.name || "Premium Plan"
                                    : "No Active Subscription"}
                            </h2>
                            {currentStatus === "ACTIVE" && (
                                <div className="space-y-1">
                                    {mySubData?.data?.subscriptionStartDate && (
                                        <p className="text-slate-500 text-xs">
                                            Active From: <span className="font-bold text-slate-700">{new Date(mySubData.data.subscriptionStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </p>
                                    )}
                                    {mySubData?.data?.subscriptionEndDate && (
                                        <p className="text-slate-500 text-xs">
                                            Expires On: <span className="font-bold text-slate-700">{new Date(mySubData.data.subscriptionEndDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </p>
                                    )}
                                    {timeLeft && (
                                        <div className="flex items-center gap-2 mt-2 py-1 px-2.5 bg-slate-50 border border-slate-100 rounded-lg w-fit">
                                            <Clock className="w-3.5 h-3.5 text-[#77AEE1] animate-pulse" />
                                            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">
                                                Time Remaining: 
                                                <span className="ml-1 text-[#77AEE1]">
                                                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <p className="text-slate-500 text-xs mt-1">
                                {currentStatus === "ACTIVE" 
                                    ? "Enjoy unlimited AI reports and early access to new transit updates." 
                                    : "Unlock full route analysis, transit rules, and premium AI insights."}
                            </p>
                        </div>
                    </div>

                    {currentStatus === "ACTIVE" && (
                        <div className="flex gap-4">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button 
                                        disabled={isCancelling}
                                        className="px-6 py-2.5 rounded-xl border border-red-200 text-red-500 font-semibold text-xs hover:bg-red-50 hover:border-red-300 transition-all active:scale-[0.98] disabled:opacity-50 whitespace-nowrap flex items-center gap-2 shadow-sm bg-white"
                                    >
                                        {isCancelling && <Loader className="w-3 h-3 animate-spin" />}
                                        {isCancelling ? "Cancelling..." : "Cancel Plan"}
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-xl border-slate-100">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-2xl font-bold text-slate-900">Cancel Subscription?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-slate-500">
                                            This action will cancel your active plan. You will lose access to premium features once your current billing period ends. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="gap-2 mt-4">
                                        <AlertDialogCancel className="rounded-md border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all">
                                            Keep My Plan
                                        </AlertDialogCancel>
                                        <AlertDialogAction 
                                            onClick={handleCancelPlan}
                                            className="rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 shadow-lg shadow-red-100 transition-all border-none"
                                        >
                                            Confirm Cancellation
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            </motion.section>

            {/* Upgrade Options */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <Sparkles className="text-amber-400 w-6 h-6" />
                    <h3 className="text-xl font-bold text-slate-800">Available Plans</h3>
                </div>

                <div className="flex flex-wrap gap-8 justify-start">
                    {plansData?.data?.map((plan: any, idx: number) => {
                        const isCurrent = planDetails?.id === plan.id;
                        return (
                            <PlanCard 
                                key={plan.id} 
                                plan={plan} 
                                idx={idx} 
                                isCurrent={isCurrent}
                                onSubscribe={handleSubscribe} 
                                isLoading={isSubscribing}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function PlanCard({ plan, idx, onSubscribe, isLoading, isCurrent }: any) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const rawY = useMotionValue(0);
    const rawShadow = useMotionValue(0);

    const y = useSpring(rawY, { stiffness: 120, damping: 18, mass: 0.6 });
    const shadowBlur = useSpring(rawShadow, { stiffness: 120, damping: 18, mass: 0.6 });
    const boxShadow = useTransform(
        shadowBlur,
        [0, 1],
        [
            "0 4px 12px -2px rgba(119,174,225,0.08)",
            "0 24px 40px -8px rgba(119,174,225,0.22)",
        ]
    );

    const subtext = plan.billingPeriod === "MONTHLY" ? "/monthly" : plan.billingPeriod === "WEEKLY" ? "/weekly" : "";

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.96 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
        },
    };

    const featureVariants = {
        hidden: { opacity: 0, x: -16 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.07 },
        }),
    };

    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ y, boxShadow }}
            onMouseEnter={() => { rawY.set(-7); rawShadow.set(1); }}
            onMouseLeave={() => { rawY.set(0); rawShadow.set(0); }}
            className="flex flex-col justify-between w-84.75 h-130 bg-white border border-blue-50 rounded-2xl overflow-hidden cursor-pointer"
        >
            <div className="flex flex-col">
                {/* Blue Header Section */}
                <div className="bg-[#77AEE1] p-6 text-white h-30 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[17px] font-medium">{plan.name}</h3>
                        {plan.billingPeriod === "YEARLY" && (
                            <span className="bg-amber-400 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase">Popular</span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-1">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.75 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{
                                type: "spring",
                                stiffness: 180,
                                damping: 13,
                                delay: 0.5 + idx * 0.15,
                            }}
                            className="text-3xl font-bold"
                        >
                            ${plan.price}
                        </motion.span>
                        {subtext && <span className="text-xs opacity-80">{subtext}</span>}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.45 + idx * 0.1 }}
                        className="text-slate-500 text-[13px] mb-6 leading-snug h-10"
                    >
                        {plan.description}
                    </motion.p>

                    {/* Features List */}
                    <div className="space-y-3">
                        {plan.features.map((feature: string, fIndex: number) => (
                            <motion.div
                                key={fIndex}
                                custom={fIndex}
                                variants={featureVariants}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                className="flex items-center gap-3"
                            >
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 14,
                                        delay: 0.4 + fIndex * 0.07,
                                    }}
                                    className="w-4.5 h-4.5 rounded-full border border-[#77AEE1] flex items-center justify-center shrink-0"
                                >
                                    <Check className="text-[#77AEE1] w-2.5 h-2.5" strokeWidth={4} />
                                </motion.div>
                                <span className="text-[13px] text-slate-700 font-medium">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="p-6 pt-0">
                {isCurrent ? (
                    <div className="w-full py-3.5 bg-slate-100 text-slate-400 font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-default border border-slate-200">
                        <ShieldCheck className="w-4.5 h-4.5 text-slate-400" />
                        Active Plan
                    </div>
                ) : (
                    <motion.button
                        whileHover={{ backgroundColor: "#5a9fd4", scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        onClick={() => onSubscribe(plan.id)}
                        disabled={isLoading}
                        className="w-full py-3.5 bg-[#77AEE1] text-white font-bold rounded-xl shadow-md text-sm flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Redirecting...
                            </>
                        ) : (
                            <>
                                <PlaneIcon className="w-4 h-4" />
                                Upgrade to Pro
                            </>
                        )}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

export default UserAvailableSubscription;