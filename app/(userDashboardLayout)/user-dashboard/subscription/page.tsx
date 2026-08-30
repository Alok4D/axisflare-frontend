"use client";

import { useRef, useState, useEffect } from "react";
import { Check, ShieldCheck, Clock, XCircle, AlertCircle, Sparkles, PlaneIcon, Loader2, Loader } from "lucide-react";
import { motion, useInView } from "framer-motion";
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
        color: "bg-green-500",
        light: "bg-green-50",
        border: "border-green-100",
        text: "text-green-700",
        bgIcon: "bg-green-100",
        iconColor: "text-green-600"
    },
    "INACTIVE": {
        label: "No Active Plan",
        icon: AlertCircle,
        color: "bg-slate-400",
        light: "bg-slate-50",
        border: "border-slate-100",
        text: "text-slate-600",
        bgIcon: "bg-slate-100",
        iconColor: "text-slate-500"
    },
    "EXPIRED": {
        label: "Plan Expired",
        icon: Clock,
        color: "bg-amber-500",
        light: "bg-amber-50",
        border: "border-amber-100",
        text: "text-amber-700",
        bgIcon: "bg-amber-100",
        iconColor: "text-amber-600"
    },
    "CANCELLED": {
        label: "Plan Cancelled",
        icon: XCircle,
        color: "bg-red-500",
        light: "bg-red-50",
        border: "border-red-100",
        text: "text-red-700",
        bgIcon: "bg-red-100",
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
                className={cn("p-8 rounded-4xl border relative overflow-hidden group transition-all", config.light, config.border)}
            >
                {/* Decorative blobs */}
                <div className={cn("absolute -top-24 -right-24 w-64 h-64 opacity-20 rounded-full blur-3xl", config.color)} />
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center shadow-sm", config.bgIcon)}>
                            <StatusIcon className={cn("w-10 h-10", config.iconColor)} />
                        </div>
                        <div className="space-y-1.5">
                            <span className={cn("inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", config.color, "text-white")}>
                                {config.label}
                            </span>
                            <h2 className="text-2xl font-bold text-slate-800">
                                {currentStatus === "ACTIVE" 
                                    ? planDetails?.name || "Premium Plan"
                                    : "No Active Subscription"}
                            </h2>
                            {currentStatus === "ACTIVE" && (
                                <div className="space-y-1">
                                    {mySubData?.data?.subscriptionStartDate && (
                                        <p className="text-slate-500 text-sm">
                                            Active From: <span className="font-bold text-slate-700">{new Date(mySubData.data.subscriptionStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </p>
                                    )}
                                    {mySubData?.data?.subscriptionEndDate && (
                                        <p className="text-slate-500 text-sm">
                                            Expires On: <span className="font-bold text-slate-700">{new Date(mySubData.data.subscriptionEndDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </p>
                                    )}
                                    {timeLeft && (
                                        <div className="flex items-center gap-2 mt-2 py-1.5 px-3 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl w-fit shadow-sm">
                                            <Clock className="w-3.5 h-3.5 text-[#77AEE1] animate-pulse" />
                                            <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">
                                                Time Remaining: 
                                                <span className="ml-1 text-[#77AEE1]">
                                                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <p className="text-slate-500 text-sm mt-1">
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
                                        className="px-8 py-3 rounded-md bg-white border border-red-500 text-red-500 font-bold text-md hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50 text-[14px] whitespace-nowrap flex items-center gap-2"
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: idx * 0.1 }}
            className={cn(
                "p-8 rounded-4xl bg-white border border-slate-100 shadow-[0_20px_40px_-15px_rgba(119,174,225,0.15)] flex flex-col justify-between transition-all hover:translate-y-[-4px]",
                plan.billingPeriod === "WEEKLY" ? "border-[#FF6B6B]/20" : "border-[#77AEE1]/20"
            )}
        >
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                             <h4 className="text-xl font-extrabold text-slate-800">{plan.name}</h4>
                             {plan.billingPeriod === "YEARLY" && (
                                <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">Most Popular</span>
                             )}
                        </div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{plan.billingPeriod} ACCESS</p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-slate-900">${plan.price}</span>
                        <p className="text-slate-400 text-[10px] font-bold">Excl. taxes</p>
                    </div>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    {plan.description}
                </p>

                <div className="space-y-4 mb-10">
                    {plan.features.map((feature: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-[#77AEE1]" strokeWidth={3} />
                            </div>
                            <span className="text-sm text-slate-600 font-medium">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                disabled={isLoading || isCurrent}
                onClick={() => onSubscribe(plan.id)}
                className={cn(
                    "w-full py-3 rounded-md font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                    isCurrent 
                        ? "bg-slate-100 text-slate-400 cursor-default" 
                        : "bg-[#77AEE1] hover:bg-[#669dcf] text-white shadow-blue-100"
                )}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : isCurrent ? (
                    <ShieldCheck className="w-5 h-5" />
                ) : (
                    <PlaneIcon className="w-5 h-5" />
                )}
                {isCurrent ? "Active Plan" : "Upgrade to Pro"}
            </button>
        </motion.div>
    );
}

export default UserAvailableSubscription;